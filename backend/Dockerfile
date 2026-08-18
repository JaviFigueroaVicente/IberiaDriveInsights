# Use the Python 3 alpine official image
# https://hub.docker.com/_/python
FROM python:3.13.14-slim

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY . .

# Install project dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
EXPOSE 8080

# Run the web service on container startup.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]