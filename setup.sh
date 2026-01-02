#!/bin/bash
# Setup script for Traffic Management System (Local Development)

echo "🚦 Smart Traffic Management System Setup"
echo "========================================"
echo ""
echo "Note: For easier deployment, consider using Docker:"
echo "  docker-compose up --build"
echo ""
echo "Continuing with local setup..."
echo ""

# Check if MySQL is running
echo "Checking MySQL status..."
if ! pgrep mysqld > /dev/null; then
    echo "⚠️  MySQL doesn't appear to be running."
    echo "Please start MySQL service and run this script again."
    echo "On macOS: brew services start mysql"
    echo "On Ubuntu: sudo service mysql start"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Setup database
echo "Setting up database..."
echo "Please enter your MySQL root password when prompted:"
mysql -u root -p < traffic_sys.sql

if [ $? -eq 0 ]; then
    echo "✓ Database setup complete"
else
    echo "✗ Database setup failed"
    exit 1
fi

# Install React dependencies and build
echo "Setting up React frontend..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✓ React build complete"
else
    echo "✗ React build failed"
    exit 1
fi

cd ..

# Run tests
echo "Running system tests..."
python test_system.py

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "To start the system:"
    echo "  source .venv/bin/activate"
    echo "  python server.py"
    echo ""
    echo "Then open http://localhost:5000 in your browser"
else
    echo "❌ Tests failed. Please check the errors above."
    exit 1
fi