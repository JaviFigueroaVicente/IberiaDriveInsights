FROM python:3.13.11
WORKDIR /app
# Copiamos solo el contenido del backend
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]