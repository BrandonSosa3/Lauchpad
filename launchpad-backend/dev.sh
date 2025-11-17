#!/bin/bash

echo "🚀 Starting Launchpad Development Environment..."

# Check Python version
python_version=$(python --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
if [[ "$python_version" != "3.11" ]] && [[ "$python_version" != "3.12" ]]; then
    echo "⚠️  Warning: Python 3.11 or 3.12 recommended (you have $python_version)"
fi

# Start Docker database
echo "📦 Starting PostgreSQL..."
docker-compose up -d db

# Wait for database
echo "⏳ Waiting for database..."
sleep 3

# Activate venv
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Set environment
export ENVIRONMENT=development

# Start FastAPI
echo "✅ Starting API server at http://localhost:8000"
uvicorn app.main:app --reload --port 8000
