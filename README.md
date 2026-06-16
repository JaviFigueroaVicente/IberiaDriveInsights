# IberiaDriveInsights 🚗📈

**IberiaDriveInsights** es una plataforma web inteligente diseñada para la predicción de precios de coches de segunda mano en el mercado español utilizando modelos avanzados de Machine Learning (ML).

Este proyecto ha sido desarrollado como un entorno de validación de conocimientos para el Curso de Especialización (CE) de Inteligencia Artificial y Big Data y el Ciclo Formativo de Grado Superior (CFGS) de Desarrollo de Aplicaciones Web (DAW).

---

## 🏗️ Arquitectura del Proyecto

El sistema está estructurado bajo una arquitectura desacoplada moderna para garantizar un rendimiento óptimo, escalabilidad y un flujo de despliegue continuo estructurado de la siguiente manera:

* **Frontend:** Interfaz de usuario intuitiva e interactiva, desarrollada con tecnologías de última generación y alojada en Vercel.
* **Backend:** API REST encargada del procesamiento de datos, la lógica de negocio y la ejecución del pipeline de inferencia de Machine Learning, alojada en Render.
* **Base de Datos (BBDD):** Almacenamiento relacional rápido y escalable gestionado con PostgreSQL y alojado en Supabase, encargado de mantener el catálogo de marcas, modelos e histórico de consultas de tasación, además de los modelos y transformadores del modelo de Machine Learning.

---

## 🌟 Características Principales

* **Predicciones de Precio Precisas:** Utilización de modelos predictivos que analizan múltiples variables del coche (marca, modelo, antigüedad, kilometraje, potencia y tipo de combustible) para estimar su valor real de mercado.
* **Formularios Dinámicos:** Los selectores de marca y modelo del frontend se actualizan dinámicamente consumiendo los datos en tiempo real desde la base de datos de Supabase.
* **Historial de Tasaciones:** Registro y persistencia de las consultas realizadas con fines de auditoría y análisis de tendencias de mercado.
* **Despliegue Continuo (CI/CD):** Integración automatizada con los entornos de nube de Vercel y Render mediante control de versiones en Git.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, Framer Motion, Sweet Alert y CSS.
* **Backend:** Python, FastAPI, Scikit-Learn, XGBoost, Pandas, NumPy, MatplotLib, Seaborn y Selenium.
* **Capa de Datos:** Supabase (PostgreSQL).
* **Hosting e Infraestructura:** Vercel (Frontend) y Render (Backend).

---

## 🚀 Instalación y Configuración Local

Si deseas ejecutar este proyecto de forma local para pruebas o desarrollo, sigue estas instrucciones:

### 1. Clonar el repositorio

```bash
git clone https://github.com/JaviFigueroaVicente/IberiaDriveInsights.git
cd IberiaDriveInsights
```

### 2. Configuración del Backend

Accede al directorio del backend, crea un entorno virtual e instala los requisitos:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Configura un archivo .env en la raíz del directorio backend con las credenciales de conexión a tu instancia de base de datos:

```bash
URL_FRONTEND=http://localhost:5173
DATABASE_URL=tu_url_de_conexion_postgresql
URL_MODELO=tu_url_de modelos
URL_TRANSFORMADORES=tu_url_de_transformadores
```

Inicia el servidor local de desarrollo del backend:

```bash
uvicorn main:app --reload
```

### 3. Configuración del Frontend

Navega a la carpeta del frontend e instala las dependencias de node correspondientes:

```bash
cd ../frontend
pnpm install
```

Configura las variables de entorno para apuntar a la URL del backend local creando un archivo .env:

```bash
VITE_API_URL=http://localhost:8000
```

Ejecuta el servidor de desarrollo para el frontend:

```bash
pnpm dev
```

### 🔍 Origen de Datos y Diseño

Para el desarrollo, alimentación del sistema y conceptualización visual de la plataforma, se han combinado diferentes técnicas y fuentes externas:

* **Obtención de Datos (Dataset)**: El conjunto de datos utilizado para el entrenamiento de los modelos predictivos se ha consolidado mediante la combinación de un dataset público obtenido de Kaggle y la extracción automatizada de datos en tiempo real del mercado español a través de técnicas de Web Scraping.

* **Diseño e Interfaz de Usuario**: El apartado visual y la experiencia de usuario (UX/UI) han contado con una fase experimental de prototipado y diseño asistido por Inteligencia Artificial utilizando Google Stitch, sirviendo como prueba de concepto para optimizar los flujos de maquetación web.

### 📊 Modelos de Machine Learning

Los modelos de regresión supervisada han sido previamente entrenados y evaluados con métricas estándar de regresión como el Coeficiente de Determinación (R2) y el Error Absoluto Medio (MAE). El regresor optimizado se almacena de forma serializada en el backend para generar respuestas inmediatas a las peticiones del frontend.

### 🎓 Propósito Académico

El desarrollo de IberiaDriveInsights sirve como evidencia práctica de la integración sinérgica de dos disciplinas tecnológicas de alta demanda: el procesamiento de datos masivos, entrenamiento de algoritmos supervisados e implementación de servicios de inferencia predictiva en producción (competencias del CE de IA y Big Data), junto con el diseño, maquetación e integración de servicios del lado del cliente y servidor (competencias de DAW).
