# Proyecto Business Intelligence & Dashboard Ejecutivo – Aeronáutica Civil de Colombia

Sistema de Analítica de Datos y Dashboard Ejecutivo Interactivo desarrollado para la **Unidad Administrativa Especial de Aeronáutica Civil de Colombia (UAEAC)**, abarcando las 4 etapas metodológicas de Inteligencia de Negocios (Definición del Problema, Comprensión del Negocio, Preparación ETL y Análisis Exploratorio EDA) e implementado sobre la base de datos oficial de **455,787 registros operacionales** (2020 - 2026).

---

## 📁 Estructura del Proyecto

```text
aerocivil-bi-dashboard/
│
├── data/
│   ├── raw/                 # Ubicación de dataset original
│   └── processed/           # Capa limpia Parquet (transporte_aereo_limpio.parquet) y CSV
│
├── etl/
│   └── etl_pipeline.py      # Pipeline de extracción, limpieza de calidad, variables derivadas y exportación
│
├── analysis/
│   └── eda_analysis.py      # Módulo ejecutable de preguntas de negocio y análisis exploratorio
│
├── dashboard/
│   ├── index.html           # Interfaz de usuario HTML5 del Dashboard Ejecutivo (5 Vistas)
│   ├── css/
│   │   └── styles.css       # Estilos CSS institucional (Glassmorphism, Dark Executive Theme)
│   └── js/
│       ├── app.js           # Engine de filtros en cascada, gestión de estado y Plotly.js charts
│       └── data.json        # Payload pre-agregado de datos optimizado para ejecución web ultra-rápida
│
├── docs/
│   └── INFORME_TECNICO_AERONAUTICA_CIVIL.md # Informe técnico académico formal completo
│
├── tests/
│   └── test_quality_and_calculations.py    # Suite de pruebas automatizadas de integridad numérica
│
├── server.py                # Servidor HTTP en Python para ejecutar el dashboard web en localhost:8080
├── requirements.txt         # Lista de dependencias del proyecto
└── README.md                # Guía técnica e instrucciones de ejecución
```

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Requisitos Previos
Asegúrese de contar con Python 3.9+ instalado en su sistema.

### 2. Instalación de Dependencias
Ejecute en la terminal:
```bash
pip install -r requirements.txt
```

### 3. Ejecución del Pipeline ETL
Para procesar el archivo Excel original (`D:\Transporte_Aéreo_Comercial_-_Tráfico_Origen Destino_(Colombia)_20260731.xlsx`), aplicar las 10 reglas de calidad y generar la capa procesada Parquet y `data.json`:
```bash
python etl/etl_pipeline.py
```

### 4. Ejecución del Módulo EDA (Análisis Exploratorio)
Para imprimir en consola los hallazgos empíricos y respuestas cuantitativas a las 8 preguntas de negocio:
```bash
python analysis/eda_analysis.py
```

### 5. Ejecución de la Suite de Pruebas Automatizadas
Para validar que las sumatorias del dashboard coincidan al 100% con los datos procesados:
```bash
python tests/test_quality_and_calculations.py
```

### 6. Iniciar el Dashboard Ejecutivo Web Interactivo
Para arrancar el servidor web local y visualizar el dashboard:
```bash
python server.py
```
Abra su navegador web e ingrese a la dirección:  
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 📊 Vistas del Dashboard Ejecutivo

1. **📊 Resumen Ejecutivo:** Tarjetas KPI dinámicas, tendencia temporal dual (Pasajeros vs Carga), dona de tráfico (Nacional/Internacional/Especial), top 10 aerolíneas y top 10 rutas.
2. **✈️ Pasajeros:** Evolución comparativa anual 2020-2026, pasaje saliente por ciudad de origen, distribución por modalidad de vuelo.
3. **🗺️ Rutas y Aeropuertos:** Matriz de flujo de las 25 principales rutas de Colombia, rankings por aeropuertos de origen y destino (IATA).
4. **🏢 Empresas:** Matriz de desempeño aerolíneas (Pasajeros vs Carga vs Vuelos), desglose de modalidad regular vs charter vs taxi aéreo.
5. **📦 Carga y Correo:** Evolución histórica de masa transportada (Toneladas), top 10 aerolíneas de carga (liderado por Copa Airlines), distribución por tráfico.

---

## 📋 Auditoría de Cumplimiento (Taller 25%)

| Requisito del Taller | Estado | Evidencia |
| :--- | :---: | :--- |
| **Parte I: Definición del Problema (1-5)** | **CUMPLIDO** | [INFORME_TECNICO_AERONAUTICA_CIVIL.md](docs/INFORME_TECNICO_AERONAUTICA_CIVIL.md#parte-i-definición-del-problema) |
| **Parte I: Indicadores Estratégicos (6 KPIs)** | **CUMPLIDO** | Tabla de 6 KPIs con fórmulas, unidades y utilidad. |
| **Parte II: Comprensión del Negocio (16 Var.)**| **CUMPLIDO** | Matriz completa de las 16 variables del diccionario DOCX. |
| **Parte II: Usuarios y Requerimientos** | **CUMPLIDO** | 5 perfiles de usuarios y 12 Requerimientos Funcionales. |
| **Parte III: Preparación ETL y 10 Reglas** | **CUMPLIDO** | [etl_pipeline.py](etl/etl_pipeline.py) y Matriz de 10 reglas de calidad. |
| **Parte III: 6 Variables Derivadas** | **CUMPLIDO** | `Mes_Nombre`, `Periodo_Año_Mes`, `Ruta_IATA`, `Ruta_Ciudad`, `Carga_Ton`, `Categoria_Movilidad`. |
| **Parte IV: EDA (8 Preguntas y Hallazgos)** | **CUMPLIDO** | [eda_analysis.py](analysis/eda_analysis.py) y hallazgos empíricos exactos. |
| **Parte IV: Storyboard (5 Páginas)** | **CUMPLIDO** | Especificación técnica de las 5 páginas del dashboard. |
| **Producto Final: Dashboard Web Interactivo** | **CUMPLIDO** | Aplicación web funcional Plotly.js en [index.html](dashboard/index.html). |
