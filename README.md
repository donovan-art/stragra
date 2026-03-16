# StragraVet Lead Scraper

A Python-based lead generation tool for StragraVet that scrapes veterinary receptionist job postings from Indeed and generates personalized cold emails.

## Features

- **Automated Job Scraping**: Searches Indeed for "veterinary receptionist" positions
- **Smart Deduplication**: Automatically filters duplicate clinics by name
- **Data Export**: Saves results in both CSV and JSON formats
- **Cold Email Generation**: Creates personalized outreach emails for each lead
- **Configurable**: Customize location, search radius, and number of pages

## Quick Start

### 1. Setup

```bash
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
mkdir -p output
```

### 2. Run the Scraper

```bash
source venv/bin/activate
python scraper.py --location "Los Angeles, CA" --radius 25 --pages 10
```

### 3. Generate Cold Emails

```bash
python email_generator.py --input ./output/latest.csv
```

## Usage

### Scraper Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--location` | "Los Angeles, CA" | Job search location |
| `--radius` | 25 | Search radius in miles |
| `--pages` | 10 | Number of pages to scrape |
| `--no-headless` | - | Show browser window (for debugging) |

### Examples

```bash
# Search in San Francisco
python scraper.py --location "San Francisco, CA" --pages 5

# Search with 50 mile radius
python scraper.py --radius 50 --pages 20

# Debug mode (visible browser)
python scraper.py --no-headless --pages 2
```

## Output Files

All outputs are saved to the `./output/` directory:

- `jobs_YYYYMMDD_HHMMSS.json` - Raw scraped data
- `jobs_YYYYMMDD_HHMMSS.csv` - Scraped data in CSV format
- `latest.csv` - Most recent scrape (convenient for email generation)
- `emails.csv` - Generated cold emails
- `emails_individual/` - Individual `.txt` files for each email

## Email Template

The generated emails follow this structure:

```
Subject: Saw you're hiring a receptionist at {clinic_name}

Hi there,

I noticed {clinic_name} is currently looking for a veterinary receptionist. 
I wanted to reach out because I think our AI phone agent could help your clinic 
handle call overflow and after-hours inquiries—without adding to your team's workload.

[Pitch continues...]

Best,
Don, StragraVet
```

## Project Structure

```
.
├── scraper.py           # Indeed job scraper
├── email_generator.py   # Cold email generator
├── requirements.txt     # Python dependencies
├── setup.sh            # Setup script
├── README.md           # This file
└── output/             # Generated files (created at runtime)
```

## Requirements

- Python 3.8+
- Playwright
- Chromium browser (installed via Playwright)

## Notes

- Indeed may block automated scraping. If you encounter issues:
  - Reduce `--pages` to scrape fewer results at once
  - Use `--no-headless` to see what's happening
  - Add delays between requests if needed
- The scraper includes basic user-agent spoofing and popup handling
- Deduplication is based on clinic name (case-insensitive)

## License

Private - For StragraVet use only.
