import os
import sys
import json
import pandas as pd
import numpy as np

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

print("=========================================================")
print("     AERONÁUTICA CIVIL DE COLOMBIA - ETL PIPELINE        ")
print("=========================================================")

# 1. PATH DEFINITIONS
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_RAW_DIR = os.path.join(BASE_DIR, 'data', 'raw')
DATA_PROC_DIR = os.path.join(BASE_DIR, 'data', 'processed')
DASHBOARD_JS_DIR = os.path.join(BASE_DIR, 'dashboard', 'js')

os.makedirs(DATA_PROC_DIR, exist_ok=True)
os.makedirs(DASHBOARD_JS_DIR, exist_ok=True)

# Find raw Excel file in D:\ or local raw folder
EXCEL_PATH = None
if os.path.exists(r'D:\Transporte_Aéreo_Comercial_-_Tráfico_Origen Destino_(Colombia)_20260731.xlsx'):
    EXCEL_PATH = r'D:\Transporte_Aéreo_Comercial_-_Tráfico_Origen Destino_(Colombia)_20260731.xlsx'
else:
    for f in os.listdir(r'D:\\'):
        if f.endswith('.xlsx') and 'Transporte' in f:
            EXCEL_PATH = os.path.join(r'D:\\', f)
            break

if not EXCEL_PATH or not os.path.exists(EXCEL_PATH):
    raise FileNotFoundError("No se encontró el archivo Excel de transporte aéreo comercial.")

print(f"[1/5] Extracción: Cargando datos desde {EXCEL_PATH}...")
df = pd.read_excel(EXCEL_PATH)
raw_rows = len(df)
print(f"      Registros extraídos exitosamente: {raw_rows:,} filas, {len(df.columns)} columnas.")

# 2. TRANSFORMACIÓN & REGLAS DE CALIDAD DE DATOS
print("[2/5] Transformación: Aplicando reglas de calidad de datos...")

# Rule 1: Handling Exact Duplicates
initial_dups = df.duplicated().sum()
print(f"      - Regla Duplicados: Se identificaron {initial_dups:,} filas duplicadas exactas (preservadas/auditadas).")

# Rule 2: Year Fix (Año stored as float 2.02, 2.021 ... 2.026)
def clean_year(val):
    if pd.isna(val):
        return 2026
    val_f = float(val)
    if val_f < 2000:
        return int(round(val_f * 1000))
    return int(val_f)

df['Año'] = df['Año'].apply(clean_year)
print(f"      - Regla Año: Años estandarizados a entero [YYYY]. Años presentes: {sorted(df['Año'].unique())}")

# Rule 3: Month Fix
df['Número de Mes'] = pd.to_numeric(df['Número de Mes'], errors='coerce').fillna(1).astype(int)
df['Número de Mes'] = df['Número de Mes'].clip(lower=1, upper=12)

# Rule 4: Numeric coercion for Pasajeros and Carga
df['Pasajeros'] = pd.to_numeric(df['Pasajeros'], errors='coerce').fillna(0.0)
df['Pasajeros'] = df['Pasajeros'].apply(lambda x: max(0.0, float(x)))

# Carga_Correo (Kg) contains comma-decimal or string formatting in raw excel
def clean_cargo(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return max(0.0, float(val))
    s = str(val).strip().replace(',', '.')
    try:
        return max(0.0, float(s))
    except:
        return 0.0

df['Carga_Correo (Kg)'] = df['Carga_Correo (Kg)'].apply(clean_cargo)

# Clean text columns first
text_cols = ['Origen', 'Ciudad Origen', 'Pais Origen', 'Destino', 'Ciudad Destino', 'Pais Destino', 'Sigla Empresa', 'Nombre', 'Tipo Vuelo', 'Tráfico (N/I)']
for col in text_cols:
    df[col] = df[col].astype(str).str.strip()

# Rule 5: Imputation of Missing Airport Names
print("      - Regla Imputación: Imputando nombres de aeropuertos faltantes...")
origen_map = df.dropna(subset=['Nombre Origen']).set_index('Origen')['Nombre Origen'].to_dict()
destino_map = df.dropna(subset=['Nombre Destino']).set_index('Destino')['Nombre Destino'].to_dict()

df['Nombre Origen'] = df['Nombre Origen'].fillna(df['Origen'].map(origen_map)).fillna(df['Ciudad Origen'] + " APT")
df['Nombre Destino'] = df['Nombre Destino'].fillna(df['Destino'].map(destino_map)).fillna(df['Ciudad Destino'] + " APT")

print("[3/5] Creación de Variables Derivadas...")

# Derived Variable 1: Mes_Nombre
MESES_ES = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
    7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
}
df['Mes_Nombre'] = df['Número de Mes'].map(MESES_ES)

# Derived Variable 2: Periodo_Año_Mes
df['Periodo_Año_Mes'] = df['Año'].astype(str) + '-' + df['Número de Mes'].astype(str).str.zfill(2)

# Derived Variable 3: Ruta_IATA
df['Ruta_IATA'] = df['Origen'] + ' - ' + df['Destino']

# Derived Variable 4: Ruta_Ciudad
df['Ruta_Ciudad'] = df['Ciudad Origen'] + ' - ' + df['Ciudad Destino']

# Derived Variable 5: Carga_Ton
df['Carga_Ton'] = (df['Carga_Correo (Kg)'] / 1000.0).round(4)

# Derived Variable 6: Categoria_Movilidad
def categorizar_movilidad(row):
    pax = row['Pasajeros']
    cargo = row['Carga_Correo (Kg)']
    if pax > 0 and cargo > 0:
        return 'Pasajeros y Carga'
    elif pax > 0 and cargo == 0:
        return 'Solo Pasajeros'
    elif pax == 0 and cargo > 0:
        return 'Solo Carga'
    else:
        return 'Operación Técnica/Sin Carga'

df['Categoria_Movilidad'] = df.apply(categorizar_movilidad, axis=1)

print("      - Variables derivadas creadas exitosamente: Mes_Nombre, Periodo_Año_Mes, Ruta_IATA, Ruta_Ciudad, Carga_Ton, Categoria_Movilidad.")

# 4. GUARDA CAPA PROCESADA
print("[4/5] Carga: Guardando capa procesada (Parquet y CSV)...")
proc_parquet = os.path.join(DATA_PROC_DIR, 'transporte_aereo_limpio.parquet')
proc_csv = os.path.join(DATA_PROC_DIR, 'transporte_aereo_limpio.csv')

df.to_parquet(proc_parquet, index=False)
df.to_csv(proc_csv, index=False, encoding='utf-8')
print(f"      Capa procesada guardada en:\n      - Parquet: {proc_parquet}\n      - CSV: {proc_csv}")

# 5. PREPARACIÓN DE PAYLOAD OPTIMIZADO PARA DASHBOARD WEB (data.json)
print("[5/5] Generación de Payload Optimizado para Dashboard Web (data.json)...")

total_pax = float(df['Pasajeros'].sum())
total_cargo_kg = float(df['Carga_Correo (Kg)'].sum())
total_cargo_ton = float(df['Carga_Ton'].sum())
total_vuelos = int(len(df))
empresas_unicas = int(df['Nombre'].nunique())
rutas_unicas = int(df['Ruta_IATA'].nunique())
ciudades_unicas = int(pd.concat([df['Ciudad Origen'], df['Ciudad Destino']]).nunique())

temporal_monthly = df.groupby(['Año', 'Número de Mes', 'Mes_Nombre', 'Periodo_Año_Mes']).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().to_dict(orient='records')

trafico_summary = df.groupby('Tráfico (N/I)').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().to_dict(orient='records')

tipo_vuelo_summary = df.groupby('Tipo Vuelo').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().to_dict(orient='records')

top_airlines = df.groupby(['Sigla Empresa', 'Nombre']).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False).head(30).to_dict(orient='records')

top_routes_city = df.groupby(['Ruta_Ciudad', 'Ciudad Origen', 'Ciudad Destino', 'Tráfico (N/I)']).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False).head(40).to_dict(orient='records')

top_cities_orig = df.groupby('Ciudad Origen').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False).head(30).to_dict(orient='records')

print("      - Construyendo cubo multidimensional pre-agregado...")
cube = df.groupby(['Año', 'Número de Mes', 'Tráfico (N/I)', 'Tipo Vuelo', 'Nombre', 'Ciudad Origen', 'Ciudad Destino']).agg(
    Pax=('Pasajeros', 'sum'),
    Kg=('Carga_Correo (Kg)', 'sum'),
    Vol=('Pasajeros', 'count')
).reset_index()

cube['Pax'] = cube['Pax'].astype(float)
cube['Kg'] = cube['Kg'].astype(float)

payload = {
    "summary": {
        "total_pasajeros": total_pax,
        "total_carga_kg": total_cargo_kg,
        "total_carga_ton": total_cargo_ton,
        "total_registros": total_vuelos,
        "total_empresas": empresas_unicas,
        "total_rutas": rutas_unicas,
        "total_ciudades": ciudades_unicas,
        "anos_disponibles": sorted(df['Año'].unique().tolist()),
        "meses_disponibles": sorted(df['Número de Mes'].unique().tolist())
    },
    "temporal": temporal_monthly,
    "trafico": trafico_summary,
    "tipo_vuelo": tipo_vuelo_summary,
    "top_empresas": top_airlines,
    "top_rutas": top_routes_city,
    "top_ciudades": top_cities_orig,
    "cube": cube.to_dict(orient='records')
}

json_output_path = os.path.join(DASHBOARD_JS_DIR, 'data.json')
with open(json_output_path, 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

print(f"      Payload optimizado guardado exitosamente en: {json_output_path}")
print("=========================================================")
print("     PROCESO ETL COMPLETADO CON ÉXITO                    ")
print("=========================================================")
