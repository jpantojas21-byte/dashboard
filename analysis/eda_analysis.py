import os
import sys
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

print("=========================================================")
print("  AERONÁUTICA CIVIL DE COLOMBIA - EDA ANALYSIS MODULE   ")
print("=========================================================")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARQUET_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'transporte_aereo_limpio.parquet')

if not os.path.exists(PARQUET_PATH):
    raise FileNotFoundError("El dataset limpio en formato Parquet no existe. Ejecute etl_pipeline.py primero.")

df = pd.read_parquet(PARQUET_PATH)
print(f"Dataset cargado desde Parquet: {len(df):,} registros.")

print("\n--- RESUMEN EJECUTIVO GENERAL ---")
print(f"Total Pasajeros Transportados: {df['Pasajeros'].sum():,.0f}")
print(f"Total Carga/Correo Transportado: {df['Carga_Correo (Kg)'].sum():,.2f} kg ({df['Carga_Ton'].sum():,.2f} Toneladas)")
print(f"Total Registros Operacionales: {len(df):,}")
print(f"Período Temporal: {df['Año'].min()} - {df['Año'].max()} (Meses 1-12)")

print("\n--- PREGUNTA 1: EVOLUCIÓN TEMPORAL (2020 - 2026) ---")
q1 = df.groupby('Año').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Operaciones=('Pasajeros', 'count')
).reset_index()
q1['Pasajeros_Pct'] = (q1['Pasajeros'] / q1['Pasajeros'].sum()) * 100
print(q1.to_string(index=False))

print("\n--- PREGUNTA 2: CIUDADES Y AEROPUERTOS DE MAYOR TRÁFICO ---")
q2_orig = df.groupby('Ciudad Origen').agg(
    Pax_Salida=('Pasajeros', 'sum'),
    Carga_Ton_Salida=('Carga_Ton', 'sum')
).reset_index().sort_values(by='Pax_Salida', ascending=False).head(10)
print("Top 10 Ciudades de Origen (Salidas):")
print(q2_orig.to_string(index=False))

print("\n--- PREGUNTA 3: PARTICIPACIÓN DE MERCADO POR EMPRESA (AIRLINES) ---")
q3 = df.groupby(['Sigla Empresa', 'Nombre']).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False)
q3['Participacion_Pax_%'] = (q3['Pasajeros'] / q3['Pasajeros'].sum()) * 100
print("Top 10 Aerolíneas por Pasajeros:")
print(q3.head(10).to_string(index=False))

print("\n--- PREGUNTA 4: PRINCIPALES RUTAS DE TRÁFICO AÉREO ---")
q4 = df.groupby(['Ruta_Ciudad', 'Tráfico (N/I)']).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Vuelos=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False)
print("Top 10 Rutas Nacionales/Internacionales:")
print(q4.head(10).to_string(index=False))

print("\n--- PREGUNTA 5: DISTRIBUCIÓN POR TIPO DE TRÁFICO (N/I/E) ---")
q5 = df.groupby('Tráfico (N/I)').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Operaciones=('Pasajeros', 'count')
).reset_index()
q5['Participacion_Pax_%'] = (q5['Pasajeros'] / q5['Pasajeros'].sum()) * 100
q5['Participacion_Carga_%'] = (q5['Carga_Ton'] / q5['Carga_Ton'].sum()) * 100
print(q5.to_string(index=False))

print("\n--- PREGUNTA 6: COMPORTAMIENTO DEL TRANSPORTE DE CARGA Y CORREO ---")
q6 = df.groupby(['Sigla Empresa', 'Nombre']).agg(
    Carga_Ton=('Carga_Ton', 'sum'),
    Pasajeros=('Pasajeros', 'sum')
).reset_index().sort_values(by='Carga_Ton', ascending=False).head(10)
q6['Participacion_Carga_%'] = (q6['Carga_Ton'] / df['Carga_Ton'].sum()) * 100
print("Top 10 Aerolíneas de Carga:")
print(q6.to_string(index=False))

print("\n--- PREGUNTA 7: ESTACIONALIDAD MENSUAL ---")
q7 = df.groupby('Mes_Nombre', observed=False).agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum')
).reset_index().sort_values(by='Pasajeros', ascending=False)
print(q7.to_string(index=False))

print("\n--- PREGUNTA 8: OPERACIÓN POR TIPO DE VUELO ---")
q8 = df.groupby('Tipo Vuelo').agg(
    Pasajeros=('Pasajeros', 'sum'),
    Carga_Ton=('Carga_Ton', 'sum'),
    Operaciones=('Pasajeros', 'count')
).reset_index().sort_values(by='Pasajeros', ascending=False)
print(q8.to_string(index=False))

print("=========================================================")
print("     ANÁLISIS EXPLORATORIO DE DATOS COMPLETADO          ")
print("=========================================================")
