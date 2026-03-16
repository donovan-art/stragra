#!/bin/bash
set -e

echo "======================================"
echo "StragraVet Lead Scraper Setup"
echo "======================================"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright browsers
echo "Installing Playwright Chromium browser..."
playwright install chromium

# Create output directory
echo "Creating output directory..."
mkdir -p output

echo ""
echo "======================================"
echo "Setup complete!"
echo "======================================"
echo ""
echo "To run the scraper:"
echo "  source venv/bin/activate"
echo "  python scraper.py --location 'Los Angeles, CA' --pages 5"
echo ""
echo "To generate emails:"
echo "  python email_generator.py"
echo ""
