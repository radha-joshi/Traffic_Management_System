# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
# Removed default-libmysqlclient-dev as we are using SQLite
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Copy built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create a non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# No EXPOSE needed for Render, but good for local doc
EXPOSE 5000

# Run the application
CMD ["python", "server.py"]