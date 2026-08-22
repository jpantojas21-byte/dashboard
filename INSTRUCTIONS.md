# 📘 INSTRUCTIONS.md — Guía de Reproducción del Proyecto

> Guía técnica completa paso a paso para instalar, configurar y ejecutar el sistema BI de la Aeronáutica Civil de Colombia desde cero.

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#1-requisitos-del-sistema)
2. [Obtener el Código Fuente](#2-obtener-el-código-fuente)
3. [Instalar Dependencias Python](#3-instalar-dependencias-python)
4. [Preparar los Datos Fuente](#4-preparar-los-datos-fuente)
5. [Ejecutar el Pipeline ETL](#5-ejecutar-el-pipeline-etl)
6. [Ejecutar el Análisis Exploratorio EDA](#6-ejecutar-el-análisis-exploratorio-eda)
7. [Ejecutar las Pruebas Automatizadas](#7-ejecutar-las-pruebas-automatizadas)
8. [Iniciar el Dashboard Ejecutivo](#8-iniciar-el-dashboard-ejecutivo)
9. [Subir Cambios a GitHub](#9-subir-cambios-a-github)
10. [Solución de Problemas Comunes](#10-solución-de-problemas-comunes)

---

## 1. Requisitos del Sistema

| Componente | Versión Mínima | Verificar con |
|------------|---------------|---------------|
| **Python** | 3.9+ | `python --version` |
| **pip** | 23+ | `pip --version` |
| **Git** | 2.x | `git --version` |
| **RAM** | 4 GB+ | — |
| **Espacio en disco** | ~500 MB libres | — |
| **Navegador web** | Chrome / Firefox / Edge | — |

---

## 2. Obtener el Código Fuente

### Opción A — Clonar desde GitHub
```bash
git clone https://github.com/jpantojas21-byte/dashboard.git
cd aerocivil-bi-dashboard
```

### Opción B — Descargar ZIP
1. Ve a [github.com/jpantojas21-byte/dashboard](https://github.com/jpantojas21-byte/dashboard)
2. Haz clic en **Code → Download ZIP**
3. Descomprime en tu directorio de proyectos

---

## 3. Instalar Dependencias Python

```bash
# (Recomendado) Crear entorno virtual
python -m venv venv

# Activar en Windows
venv\Scripts\activate

# Activar en macOS/Linux
source venv/bin/activate

# Instalar todas las dependencias
pip install -r requirements.txt
```

### Dependencias incluidas (`requirements.txt`)

| Librería | Versión | Uso |
|----------|---------|-----|
| `pandas` | ≥ 2.0.0 | Manipulación de datos |
| `numpy` | ≥ 1.24.0 | Cálculos numéricos |
| `pyarrow` | ≥ 12.0.0 | Formato Parquet |
| `openpyxl` | ≥ 3.1.0 | Lectura del Excel fuente |
| `python-docx` | ≥ 1.0.0 | Generación de informe Word |
| `pypdf` | ≥ 3.10.0 | Manejo de PDF |
| `plotly` | ≥ 5.15.0 | Generación de gráficos |

---

## 4. Preparar los Datos Fuente

> ⚠️ Los datos fuente **no están incluidos** en el repositorio por su tamaño.

1. Descarga el dataset oficial desde:  
   👉 [datos.gov.co — Transporte Aéreo Comercial](https://www.datos.gov.co/)

2. Coloca el archivo Excel en la carpeta `data/raw/`:
   ```
   data/raw/Transporte_Aéreo_Comercial_-_Tráfico_Origen_Destino_(Colombia)_20260731.xlsx
   ```

3. Verifica que la ruta coincida exactamente con la configurada en `etl/etl_pipeline.py`.

---

## 5. Ejecutar el Pipeline ETL

El pipeline realiza **extracción, limpieza (10 reglas de calidad), generación de 6 variables derivadas y exportación** a Parquet, CSV y `data.json`.

```bash
python etl/etl_pipeline.py
```

### ¿Qué genera este script?

| Archivo generado | Ubicación | Descripción |
|-----------------|-----------|-------------|
| `transporte_aereo_limpio.parquet` | `data/processed/` | Capa limpia en formato columnar |
| `transporte_aereo_limpio.csv` | `data/processed/` | Capa limpia en formato CSV (88 MB) |
| `data.json` | `dashboard/js/` | Payload pre-agregado para el dashboard (112 MB) |

> ⏱️ **Tiempo estimado:** 3–8 minutos dependiendo del hardware.

### Variables Derivadas Creadas

| Variable | Descripción |
|----------|-------------|
| `Mes_Nombre` | Nombre del mes en español (ej: `Enero`) |
| `Periodo_Año_Mes` | Cadena `YYYY-MM` para eje temporal |
| `Ruta_IATA` | Concatenación `ORIG_IATA → DEST_IATA` |
| `Ruta_Ciudad` | Concatenación `Ciudad Origen → Ciudad Destino` |
| `Carga_Ton` | Carga transportada convertida a toneladas |
| `Categoria_Movilidad` | Clasificación por volumen de pasajeros |

---

## 6. Ejecutar el Análisis Exploratorio EDA

Imprime en consola los hallazgos empíricos y respuestas a las **8 preguntas de negocio**:

```bash
python analysis/eda_analysis.py
```

### Preguntas respondidas

1. ¿Cuál es la tendencia de pasajeros nacionales e internacionales 2020–2026?
2. ¿Cuáles son los 10 aeropuertos con mayor tráfico de pasajeros?
3. ¿Qué aerolíneas concentran el 80% del mercado?
4. ¿Cómo se distribuye el tráfico por tipo de vuelo (regular/charter/taxi)?
5. ¿Cuáles son las rutas más demandadas?
6. ¿Qué aerolíneas lideran el transporte de carga?
7. ¿Cuál fue el impacto del COVID-19 en el sector?
8. ¿Qué meses concentran mayor demanda operacional?

---

## 7. Ejecutar las Pruebas Automatizadas

Valida que los totales del dashboard coincidan al 100% con los datos procesados:

```bash
python tests/test_quality_and_calculations.py
```

El script verifica:
- ✅ Integridad de sumas totales (pasajeros, carga, vuelos)
- ✅ Ausencia de valores nulos en columnas críticas
- ✅ Rangos válidos de fechas (2020–2026)
- ✅ Coherencia de rutas IATA

---

## 8. Iniciar el Dashboard Ejecutivo

### Opción A — Servidor Python (recomendado)
```bash
python server.py
```
Abra: 👉 **[http://localhost:8080](http://localhost:8080)**

### Opción B — Servidor Node.js (alternativa)
```bash
npx -y serve dashboard/
```
Abra: 👉 **[http://localhost:3000](http://localhost:3000)**

### Opción C — VS Code Live Server
1. Instala la extensión **Live Server** en VS Code
2. Clic derecho en `dashboard/index.html` → **Open with Live Server**

> ⚠️ **No abrir `index.html` directamente** como archivo local (`file://`).  
> Los navegadores bloquean la carga de archivos JSON locales por política de seguridad CORS.

---

## 9. Subir Cambios a GitHub

```bash
# Ver estado del repositorio
git status

# Agregar todos los cambios (los archivos en .gitignore se excluyen automáticamente)
git add .

# Crear commit
git commit -m "feat: descripción del cambio"

# Subir al repositorio remoto
git push origin main
```

### ⚠️ Archivos que NO se suben (`.gitignore`)

| Archivo | Tamaño | Razón |
|---------|--------|-------|
| `dashboard/js/data.json` | ~112 MB | Supera límite de GitHub (100 MB) |
| `data/processed/transporte_aereo_limpio.csv` | ~88 MB | Archivo grande (comentado en .gitignore) |
| `venv/`, `.venv/` | Variable | Entorno virtual local |
| `__pycache__/` | Variable | Caché de Python |

---

## 10. Solución de Problemas Comunes

### ❌ `ModuleNotFoundError: No module named 'pandas'`
```bash
pip install -r requirements.txt
```

### ❌ `FileNotFoundError` al ejecutar el ETL
Verifica que el archivo Excel esté en `data/raw/` con el nombre exacto esperado en `etl_pipeline.py`.

### ❌ Dashboard en blanco / sin datos
El archivo `dashboard/js/data.json` no existe. Ejecuta primero:
```bash
python etl/etl_pipeline.py
```

### ❌ Error de push a GitHub (archivo grande)
Los archivos en `.gitignore` se excluyen automáticamente. Si ya fueron rastreados:
```bash
git rm --cached dashboard/js/data.json
git commit -m "chore: remover archivos grandes del tracking"
git push origin main
```

### ❌ Puerto 8080 ocupado
Edita `server.py` y cambia el puerto a otro disponible (ej: `8081`).

---

## 📞 Contacto

**Estudiante:** Jorge Armando Pantoja Salguedo  
**Docente:** Mg. Andrew Arnedo Pertuz  
**Institución:** Cartagena de Indias, 2026  
**Repositorio:** [github.com/jpantojas21-byte/dashboard](https://github.com/jpantojas21-byte/dashboard)
