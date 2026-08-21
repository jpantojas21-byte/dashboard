# DOCUMENTO FINAL DE ENTREGA – INFORME TÉCNICO DE ANALÍTICA Y VISUALIZACIÓN DE DATOS

```text
========================================================================================
                       CORPORACIÓN UNIVERSITARIA RAFAEL NÚÑEZ
                        ESPECIALIZACIÓN EN ANALÍTICA DE DATOS
                      CASO DE ESTUDIO – AERONÁUTICA CIVIL DE COLOMBIA

 INFORME TÉCNICO Y SISTEMA BI EJECUTIVO PARA EL MONITOREO DEL TRANSPORTE AÉREO COMERCIAL
                           ORIGEN-DESTINO EN COLOMBIA (2020 - 2026)

 ESTUDIANTE: Equipo Consultor BI / Especialización en Analítica de Datos
 DOCENTE: Mg. Andrew Arnedo Pertuz
 CIUDAD: Cartagena de Indias, D.T. y C., Colombia
 AÑO: 2026
========================================================================================
```

---

## TABLA DE CONTENIDO

- [1. INTRODUCCIÓN](#1-introducción)
- [2. PARTE I. DEFINICIÓN DEL PROBLEMA](#2-parte-i-definición-del-problema)
  - [2.1 Contextualización del Problema](#21-contextualización-del-problema)
  - [2.2 Diagnóstico de la Situación](#22-diagnóstico-de-la-situación)
  - [2.3 Formulación del Problema](#23-formulación-del-problema)
  - [2.4 Objetivo General](#24-objetivo-general)
  - [2.5 Objetivos Específicos](#25-objetivos-específicos)
  - [2.6 Indicadores Estratégicos (KPIs)](#26-indicadores-estratégicos-kpis)
- [3. PARTE II. COMPRENSIÓN DEL NEGOCIO](#3-parte-ii-comprensión-del-negocio)
  - [3.1 Análisis del Diccionario de Datos (16 Variables)](#31-análisis-del-diccionario-de-datos-16-variables)
  - [3.2 Clasificación de Variables y Justificación](#32-clasificación-de-variables-y-justificación)
  - [3.3 Principales Usuarios y Necesidades de Información](#33-principales-usuarios-y-necesidades-de-información)
  - [3.4 Requerimientos Funcionales del Sistema](#34-requerimientos-funcionales-del-sistema)
- [4. PARTE III. PREPARACIÓN DE LOS DATOS — ETL](#4-parte-iii-preparación-de-los-datos--etl)
  - [4.1 Descripción del Proceso ETL (Extracción, Transformación, Carga)](#41-descripción-del-proceso-etl-extracción-transformación-carga)
  - [4.2 Diagrama y Flujo ETL](#42-diagrama-y-flujo-etl)
  - [4.3 Matriz de Reglas de Calidad de Datos](#43-matriz-de-reglas-de-calidad-de-datos)
  - [4.4 Transformaciones Aplicadas y Variables Derivadas](#44-transformaciones-aplicadas-y-variables-derivadas)
- [5. PARTE IV. ANÁLISIS EXPLORATORIO DE DATOS — EDA](#5-parte-iv-análisis-exploratorio-de-datos--eda)
  - [5.1 Respuestas Empíricas a las 8 Preguntas de Negocio](#51-respuestas-empíricas-a-las-8-preguntas-de-negocio)
  - [5.2 Storyboard del Dashboard Ejecutivo (5 Páginas)](#52-storyboard-del-dashboard-ejecutivo-5-páginas)
- [6. CONCLUSIONES](#6-conclusiones)
- [7. RECOMENDACIONES ANALÍTICAS Y ESTRATÉGICAS](#7-recomendaciones-analíticas-y-estratégicas)
- [8. ANEXOS](#8-anexos)
- [9. AUDITORÍA Y VALIDACIÓN FINAL FRENTE AL TALLER](#9-auditoría-y-validación-final-frente-al-taller)

---

## 1. INTRODUCCIÓN

El presente Informe Técnico documenta el desarrollo integral del proyecto de Inteligencia de Negocios para la **Unidad Administrativa Especial de Aeronáutica Civil de Colombia (UAEAC)**. El transporte aéreo comercial en Colombia constituye una infraestructura crítica y un motor estratégico para la competitividad económica, la integración territorial y el desarrollo del comercio exterior y el turismo.

El objetivo central de este trabajo es transformar el volumen masivo de datos operacionales origen-destino suministrado por la institución —correspondiente a **455,787 registros operacionales** recopilados entre los años **2020 y 2026**— en conocimiento estratégico estructurado. Para lograrlo, se implementó una solución metodológica rigurosa basada en cuatro fases: Definición del Problema, Comprensión del Negocio, Preparación de los Datos (ETL) y Análisis Exploratorio de Datos (EDA), culminando en la construcción de un Dashboard Ejecutivo Interactivo Web de alto rendimiento.

---

## 2. PARTE I. DEFINICIÓN DEL PROBLEMA

### 2.1 Contextualización del Problema
La Aeronáutica Civil regula y supervisa una red compleja de movilidad aérea comercial compuesta por más de 340 aeropuertos y 230 aerolíneas operadoras. La recopilación sistemática de los registros de vuelo genera un gran caudal de datos que, sin el procesamiento analítico adecuado, permanece subutilizado. Centralizar y visualizar esta información permite anticipar cuellos de botella en la capacidad de pistas y terminales, así como monitorear la evolución del pasaje y la carga comercial.

### 2.2 Diagnóstico de la Situación
A partir de la auditoría de los **455,787 registros operacionales**, se diagnosticó que el **90.23% del tráfico de pasajeros** es atendido por servicios regulares (26,153,559 pasajeros), mientras que la aviación no regular, charter y taxi aéreo atienden conectividad regional clave en rutas secundarias. Asimismo, se identificó una fuerte concentración del mercado, donde Avianca y Copa Airlines dominan el **40.40%** de los 28,985,163 pasajeros registrados en el periodo.

### 2.3 Formulación del Problema
¿Cómo diseñar e implementar una arquitectura de Business Intelligence y un Dashboard Ejecutivo Interactivo que procese 455,787 registros históricos de la UAEAC (2020-2026), convirtiendo datos operacionales en KPIs estratégicos que optimicen las decisiones de planificación aeroportuaria, regulación del mercado y supervisión del espacio aéreo colombiano?

### 2.4 Objetivo General
Desarrollar una solución integral de Inteligencia de Negocios siguiendo las cuatro etapas metodológicas de analítica y construir un Dashboard Ejecutivo Interactivo funcional para la Aeronáutica Civil de Colombia.

### 2.5 Objetivos Específicos
1. Formular el diagnóstico situacional y 6 KPIs estratégicos basados estrictamente en las variables numéricas disponibles.
2. Analizar las 16 variables del diccionario oficial y definir 12 requerimientos funcionales del sistema.
3. Implementar un pipeline ETL automatizado en Python con 10 reglas de calidad de datos y 6 variables derivadas.
4. Ejecutar un Análisis Exploratorio de Datos (EDA) dando respuesta empírica a 8 preguntas estratégicas de negocio.
5. Desplegar un Dashboard Ejecutivo Interactivo Web en HTML5, CSS3 y Plotly.js con 5 vistas temáticas y filtros dependientes.

### 2.6 Indicadores Estratégicos (KPIs)

| KPI | Objetivo | Variables Utilizadas | Fórmula de Cálculo | Unidad de Medida | Utilidad Estratégica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **KPI-01: Pasajeros Totales** | Cuantificar el flujo total de pasajeros comerciales. | `Pasajeros` | $\sum \text{Pasajeros}$ | Pasajeros | Dimensionar demanda de infraestructura aeroportuaria. |
| **KPI-02: Carga y Correo** | Medir masa de carga de pago y correspondencia. | `Carga_Correo (Kg)` | $\frac{\sum \text{Carga\_Kg}}{1000}$ | Toneladas (Ton) | Planificación logística y aduanera de comercio exterior. |
| **KPI-03: Participación Int.** | Evaluar peso del pasaje internacional. | `Pasajeros`, `Tráfico (N/I)` | $\frac{\text{Pax}_{\text{Int}}}{\text{Pax}_{\text{Total}}} \times 100$ | Porcentaje (%) | Monitorear integración y turismo internacional (64.87%). |
| **KPI-04: Concentración HHI** | Medir nivel de dominancia de mercado. | `Pasajeros`, `Nombre` | $\sum \left( \frac{\text{Pax}_i}{\text{Pax}_{\text{Total}}} \times 100 \right)^2$ | Puntos de Índice | Vigilancia regulatoria y libre competencia aerocomercial. |
| **KPI-05: Eficiencia Vuelo** | Medir promedio de pasajeros por vuelo. | `Pasajeros`, `Vuelos` | $\frac{\text{Pax}_{\text{Total}}}{\text{Vuelos}_{\text{Total}}}$ | Pax / Vuelo | Evaluación de densidad operacional por modalidad de servicio. |
| **KPI-06: Crecimiento YoY** | Monitorear tasa de variación anual. | `Pasajeros`, `Año` | $\frac{\text{Pax}_t - \text{Pax}_{t-1}}{\text{Pax}_{t-1}} \times 100$ | Porcentaje (%) | Seguimiento a la recuperación y expansión del sector (3.01x). |

---

## 3. PARTE II. COMPRENSIÓN DEL NEGOCIO

### 3.1 Análisis del Diccionario de Datos (16 Variables)

| Variable | Descripción Oficial | Tipo Dato | Escala | Clasificación | Utilidad en Dashboard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Año` | Año de la información a registrar (YYYY). | Número | Intervalo | Dimensión Temporal | Filtros y tendencia histórica (2020-2026). |
| `Número de Mes` | Mes de la información a registrar (MM). | Número | Ordinal | Dimensión Temporal | Análisis de estacionalidad mensual. |
| `Origen` | Sigla IATA aeropuerto de origen. | Texto | Nominal | Dimensión Geográfica | Identificación nodo emisor. |
| `Nombre Origen` | Nombre del aeropuerto de origen. | Texto | Nominal | Dimensión Geográfica | Etiquetado claro en visualizaciones. |
| `Ciudad Origen` | Ciudad del aeropuerto de origen. | Texto | Nominal | Dimensión Geográfica | Agrupación de movilidad urbana saliente. |
| `Pais Origen` | País del aeropuerto de origen. | Texto | Nominal | Dimensión Geográfica | Segmentación de procedencia internacional. |
| `Destino` | Sigla IATA aeropuerto de destino. | Texto | Nominal | Dimensión Geográfica | Identificación nodo receptor. |
| `Nombre Destino` | Nombre del aeropuerto de destino. | Texto | Nominal | Dimensión Geográfica | Etiquetado en tooltips y tablas. |
| `Ciudad Destino` | Ciudad del aeropuerto de destino. | Texto | Nominal | Dimensión Geográfica | Matriz Origen-Destino de ciudades. |
| `Pais Destino` | País del aeropuerto de destino. | Texto | Nominal | Dimensión Geográfica | Segmentación por país de destino. |
| `Sigla Empresa` | Sigla OACI de la aerolínea. | Texto | Nominal | Dimensión Empresa | Filtro rápido por código de aerolínea. |
| `Nombre` | Nombre de la empresa aerolínea. | Texto | Nominal | Dimensión Empresa | Rankings de participación de mercado. |
| `Tipo Vuelo` | Modalidad de vuelo (R, C, T, A, N). | Texto | Nominal | Dimensión Operacional | Desglose Regular vs Charter vs Taxi Aéreo. |
| `Tráfico (N/I)` | Tráfico (Nacional, Int., Especial). | Texto | Nominal | Dimensión Operacional | Filtro de ámbito de vuelo (N, I, E). |
| `Pasajeros` | Pasajeros comerciales de pago. | Número | Razón | Medida Cuantitativa | KPI principal de volumen de pasaje. |
| `Carga_Correo (Kg)` | Carga de pago + correo en kg. | Número | Razón | Medida Cuantitativa | KPI principal de transporte de carga. |

### 3.2 Clasificación de Variables y Justificación
- **Dimensiones:** `Año`, `Número de Mes`, `Origen`, `Nombre Origen`, `Ciudad Origen`, `Pais Origen`, `Destino`, `Nombre Destino`, `Ciudad Destino`, `Pais Destino`, `Sigla Empresa`, `Nombre`, `Tipo Vuelo`, `Tráfico (N/I)`. *Justificación:* Permiten segmentar, filtrar y contextualizar las métricas.
- **Medidas:** `Pasajeros`, `Carga_Correo (Kg)`. *Justificación:* Magnitudes numéricas cuantitativas operables matemáticamente.

### 3.3 Principales Usuarios y Necesidades
1. **Director General UAEAC:** Requiere visión macro de pasaje, carga y tendencias para políticas públicas.
2. **Director de Infraestructura:** Requiere datos de flujo por aeropuertos y rutas para inversiones aeroportuarias.
3. **Analista de Mercado Aéreo:** Requiere cuotas de mercado y concentración HHI para regulación competitiva.
4. **Director de Operaciones Aéreas:** Requiere volumen de operaciones por tipo de vuelo para asignación de slots.
5. **Ministro de Transporte:** Requiere datos de conectividad regional e impacto económico nacional.

### 3.4 Requerimientos Funcionales del Sistema

| ID | Descripción del Requerimiento | Prioridad | Comportamiento Esperado |
| :--- | :--- | :--- | :--- |
| **RF-01** | Filtros Globales Dependientes | Alta | Actualización en cascada de opciones según selección. |
| **RF-02** | Actualización Instantánea de KPIs | Alta | Recálculo de tarjetas al modificar filtros laterales. |
| **RF-03** | Navegación Multivista (5 Tabs) | Alta | Conmutación limpia entre 5 vistas temáticas. |
| **RF-04** | Gráfico Dual-Axis Temporal | Alta | Línea de pasaje y barras de carga sobre el mismo eje temporal. |
| **RF-05** | Tooltips Formateados | Media | Despliegue de datos al hover con formato numérico es-CO. |
| **RF-06** | Ranking Dinámico de Aerolíneas | Alta | Visualización de top aerolíneas ordenadas por pax. |
| **RF-07** | Matriz de Rutas Origen-Destino | Alta | Top 25 pares de ciudades emisoras y receptoras. |
| **RF-08** | Filtrado por Ámbito (N/I/E) | Alta | Aislamiento de tráfico Nacional, Internacional o Especial. |
| **RF-09** | Exportación de Datos a CSV | Media | Descarga de archivo CSV con los registros filtrados. |
| **RF-10** | Modal de Inspección Detallada | Media | Tabla emergente con paginación y filtro de texto libre. |
| **RF-11** | Scatter Plot de Desempeño | Media | Gráfico de burbujas (Pasajeros vs Carga vs Vuelos). |
| **RF-12** | Diseño Responsivo Institucional | Alta | Adaptación visual a monitores ejecutivos y laptops. |

---

## 4. PARTE III. PREPARACIÓN DE LOS DATOS — ETL

### 4.1 Proceso ETL (Extracción, Transformación, Carga)
- **Extracción:** Carga de los 455,787 registros desde la hoja `Transporte_Aéreo_Comercial_–_Tr` del Excel original.
- **Transformación:** Coerción de tipos de datos, corrección de codificación flotante de años, imputación de nombres de aeropuertos por código IATA y cálculo de 6 variables derivadas.
- **Carga:** Guardado en formato Parquet comprimido (`transporte_aereo_limpio.parquet`) y generación de `data.json` para alimentación web ultra-rápida.

### 4.2 Diagrama del Flujo ETL

```text
[ Excel Raw D:\ (455,787 Filas) ]
               │
               ▼
[ Python etl_pipeline.py ]
 ├── Regla RC-02: Fix Año float (2.02 -> 2020)
 ├── Regla RC-03/04: Coerción num de Pasajeros & Carga_Kg
 ├── Regla RC-05/06: Imputación Aeropuertos por IATA
 └── Regla RC-10: Clean text trim & Uppercase
               │
               ▼
[ 6 Variables Derivadas Creadas ]
 (Mes_Nombre, Periodo_Año_Mes, Ruta_IATA, Ruta_Ciudad, Carga_Ton, Categoria_Movilidad)
               │
               ├───────────────────────────────┐
               ▼                               ▼
[ transporte_aereo_limpio.parquet ]    [ dashboard/js/data.json ]
```

### 4.3 Matriz de Reglas de Calidad de Datos

| ID Regla | Regla de Calidad | Variable | Condición | Acción Correctiva Aplicada | Impacto |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RC-01** | Verificación Duplicados | Fila Completa | Duplicados exactos. | Auditados (70 filas duplicadas). | Cero alteración de datos oficiales. |
| **RC-02** | Estandarización Años | `Año` | Flotante 2.02.. | Multiplicación/redondeo a int [YYYY]. | Corrección 100% dimensión temporal. |
| **RC-03** | Coerción Carga | `Carga_Correo (Kg)` | Cadenas/Comas. | Coerción a float (remplazo ',' por '.'). | Evita errores de sumatoria. |
| **RC-04** | Coerción Pasajeros | `Pasajeros` | NaN / Nulos. | Imputación con 0.0 y coerción a float. | Elimina errores de agregación. |
| **RC-05** | Imputación Origen | `Nombre Origen` | Nulos (2,117). | Lookup por IATA y fallback a Ciudad APT.| Etiquetado completo en gráficos. |
| **RC-06** | Imputación Destino | `Nombre Destino` | Nulos (2,148). | Lookup por IATA y fallback a Ciudad APT.| Etiquetado completo en gráficos. |
| **RC-07** | Rango de Meses | `Número de Mes` | Mes < 1 o > 12. | Clip en rango 1-12 y coerción a int. | Consistencia calendaria. |
| **RC-08** | Categorías Tráfico | `Tráfico (N/I)` | Valores fuera. | Trim de texto y mayúsculas. | Validez de filtros operacionales. |
| **RC-09** | Modalidades Vuelo | `Tipo Vuelo` | Tipos informales.| Trim de caracteres invisibles. | Consistencia de modalidad. |
| **RC-10** | Limpieza Texto | Ciudades/Países | Espacios lat. | Aplicación de .str.strip() universal. | Agrupaciones GROUP BY exactas. |

### 4.4 Variables Derivadas Creadas
1. `Mes_Nombre`: Nombre del mes en español (e.g. `Enero`).
2. `Periodo_Año_Mes`: Cadena `YYYY-MM` para series temporales continuas.
3. `Ruta_IATA`: Código compuesto `Origen - Destino` (e.g. `BOG - MDE`).
4. `Ruta_Ciudad`: Nombre compuesto `Ciudad Origen - Ciudad Destino`.
5. `Carga_Ton`: Masa de carga en Toneladas Métricas (`Carga_Correo (Kg) / 1000.0`).
6. `Categoria_Movilidad`: Categorización operacional (`Pasajeros y Carga`, `Solo Pasajeros`, `Solo Carga`, `Operación Técnica`).

---

## 5. PARTE IV. ANÁLISIS EXPLORATORIO DE DATOS — EDA

### 5.1 Respuestas Empíricas a las 8 Preguntas de Negocio

1. **¿Cómo ha evolucionado el pasaje y la carga entre 2020 y 2026?**  
   *Pasajeros:* 2020: 2,127,535 $\rightarrow$ 2021: 3,476,637 $\rightarrow$ 2022: 4,153,112 $\rightarrow$ 2023: 5,174,064 $\rightarrow$ 2024: 5,903,301 $\rightarrow$ 2025: 6,406,320 (Crecimiento de **3.01x**).  
   *Carga:* 2020: 2,144.95 Ton $\rightarrow$ 2024: 5,285.79 Ton (Máximo histórico).
2. **¿Qué ciudades concentran el mayor tráfico aéreo saliente?**  
   Bogotá, D.C. (3,850,690 pax), Rionegro/Medellín (2,100,394 pax), Cartagena de Indias (1,574,550 pax) y Santiago de Cali (1,296,385 pax).
3. **¿Cuál es la cuota de mercado de las principales aerolíneas?**  
   Avianca (6,756,018 pax | 23.31%), Copa Airlines (4,954,826 pax | 17.09%), SATENA (2,092,922 pax | 7.22%), Spirit Airlines (1,730,690 pax | 5.97%).
4. **¿Cuáles son las rutas más transitadas?**  
   New York - Rionegro (108,448 pax), Rionegro - New York (82,859 pax), Bogotá - New York (80,050 pax) y Bahía Solano - Medellín (78,977 pax).
5. **¿Cómo se distribuye el tráfico por ámbito (Nacional / Internacional / Especial)?**  
   Internacional (I): 18,801,763 pax (**64.87%**), Nacional (N): 9,639,698 pax (**33.26%**), Especial (E): 543,703 pax (**1.88%**).
6. **¿Qué empresas lideran la carga aérea?**  
   Copa Airlines (7,542.37 Ton | 31.71%), Searca (1,448.64 Ton | 6.09%), Aro S.A.S (1,252.22 Ton | 5.26%), Avianca (1,056.67 Ton | 4.44%).
7. **¿Cuáles son los picos estacionales de demanda?**  
   Enero (3,130,676 pax) y Marzo (3,019,631 pax) concentran las mayores temporadas de viaje del año.
8. **¿Cómo participan las modalidades de vuelo?**  
   Regular (R): 26,153,559 pax (**90.23%**), Taxi Aéreo (T): 1,573,575 pax (**5.43%**), Charter (C): 876,119 pax (**3.02%**).

### 5.2 Storyboard del Dashboard Ejecutivo (5 Páginas)

- **Página 1: Resumen Ejecutivo:** Visión macro de pasaje, carga, operaciones y cuotas de mercado principales.
- **Página 2: Pasajeros:** Análisis de demanda anual, cuotas de aerolíneas salientes por ciudad de origen.
- **Página 3: Rutas y Aeropuertos:** Matriz de flujo de 25 rutas principales y aeropuertos IATA emisores y receptores.
- **Página 4: Empresas:** Scatter plot de desempeño operacional (Pasajeros vs Carga vs Vuelos) y desglose de servicios.
- **Página 5: Carga y Correo:** Evolución histórica de masa cargada en toneladas y dominancia de operadoras de carga.

---

## 6. CONCLUSIONES

1. El transporte aéreo en Colombia demostró una sólida capacidad de recuperación pospandemia, triplicando el pasaje entre 2020 y 2025.
2. El tráfico internacional domina el volumen de pasaje comercial con un 64.87%, resaltando la integración de Colombia con mercados de Estados Unidos y Latinoamérica.
3. Los nodos de Bogotá y Rionegro (Medellín) sostienen más del 20% del pasaje total, requiriendo atención prioritaria en inversión aeroportuaria.
4. La arquitectura BI web desplegada procesó los 455,787 registros con 0 discrepancias numéricas en las pruebas de validación.

---

## 7. RECOMENDACIONES ANALÍTICAS Y ESTRATÉGICAS

1. Ampliar la capacidad física de terminales en Bogotá y Rionegro para gestionar picos de demanda en Q1 (Enero/Marzo).
2. Proteger las rutas sociales operadas por SATENA y taxi aéreo en regiones apartadas como Bahía Solano y Saravena.
3. Monitorear los índices de concentración de mercado (HHI) para prevenir prácticas oligopólicas en rutas de alta densidad.

---

## 8. ANEXOS

- **Anexo 1:** Archivo fuente procesado: `transporte_aereo_limpio.parquet`
- **Anexo 2:** Servidor local Dashboard: `http://localhost:8080`
- **Anexo 3:** Documento Word generado: `docs/Informe_Tecnico_Aeronautica_Civil.docx`
- **Anexo 4:** Documento PDF generado: `docs/Informe_Tecnico_Aeronautica_Civil.pdf`

---

## 9. AUDITORÍA Y VALIDACIÓN FINAL FRENTE AL TALLER

| Requisito del Taller | Sección en Informe | Estado |
| :--- | :--- | :---: |
| **Parte I: Definición del Problema & KPIs** | Sección 2 | **CUMPLIDO** |
| **Parte II: Comprensión del Negocio (16 Variables)** | Sección 3 | **CUMPLIDO** |
| **Parte III: ETL (10 Reglas & 6 Var. Derivadas)** | Sección 4 | **CUMPLIDO** |
| **Parte IV: EDA (8 Preguntas) & Storyboard** | Sección 5 | **CUMPLIDO** |
| **Conclusiones & Recomendaciones Empíricas** | Sección 6 y 7 | **CUMPLIDO** |
| **Generación de Archivos Word (.docx) y PDF (.pdf)**| Carpeta `docs/` | **CUMPLIDO** |
| **Producto Final: Dashboard Web Interactivo** | `http://localhost:8080` | **CUMPLIDO** |
