import argparse
import csv
import json
import os
from datetime import datetime
from urllib.parse import quote_plus
from playwright.sync_api import sync_playwright


def parse_args():
    parser = argparse.ArgumentParser(description="Scrape Indeed for veterinary receptionist jobs")
    parser.add_argument("--location", default="Los Angeles, CA", help="Job location (default: Los Angeles, CA)")
    parser.add_argument("--radius", type=int, default=25, help="Search radius in miles (default: 25)")
    parser.add_argument("--pages", type=int, default=10, help="Number of pages to scrape (default: 10)")
    parser.add_argument("--headless", action="store_true", default=True, help="Run browser in headless mode")
    parser.add_argument("--no-headless", action="store_true", dest="headless_false", help="Show browser window")
    return parser.parse_args()


def scrape_indeed(location, radius, max_pages, headless=True):
    """Scrape Indeed for veterinary receptionist jobs."""
    jobs = []
    seen_clinics = set()
    
    base_url = "https://www.indeed.com/jobs"
    query = quote_plus("veterinary receptionist")
    location_encoded = quote_plus(location)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        
        for page_num in range(max_pages):
            start = page_num * 10
            url = f"{base_url}?q={query}&l={location_encoded}&radius={radius}&start={start}"
            
            print(f"Scraping page {page_num + 1}/{max_pages}: {url}")
            
            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)  # Let content load
                
                # Handle popups/cookies
                try:
                    cookie_btn = page.locator('button:has-text("Accept")').first
                    if cookie_btn.is_visible(timeout=3000):
                        cookie_btn.click()
                        page.wait_for_timeout(500)
                except:
                    pass
                
                # Find job cards
                job_cards = page.locator('[data-testid="jobTitle"]').all()
                
                if not job_cards:
                    # Try alternative selectors
                    job_cards = page.locator('.jobTitle, .jobTitle-color-purple, h2.jobTitle').all()
                
                print(f"Found {len(job_cards)} job cards on this page")
                
                for card in job_cards:
                    try:
                        # Get parent container
                        parent = card.locator('..').first
                        
                        # Extract job title
                        job_title = card.inner_text().strip()
                        
                        # Extract company name
                        company_elem = parent.locator('[data-testid="company-name"], .companyName, .company_name').first
                        if not company_elem.is_visible():
                            company_elem = page.locator(f'a[aria-label*="{job_title}"]').first.locator('xpath=../../..').locator('.companyName, [data-testid="company-name"]').first
                        
                        company_name = company_elem.inner_text().strip() if company_elem.is_visible() else "Unknown"
                        
                        # Skip if already seen
                        if company_name.lower() in seen_clinics:
                            continue
                        seen_clinics.add(company_name.lower())
                        
                        # Extract location
                        location_elem = parent.locator('[data-testid="job-location"], .companyLocation, .company_location').first
                        job_location = location_elem.inner_text().strip() if location_elem.is_visible() else location
                        
                        # Extract salary
                        salary_elem = parent.locator('[data-testid="job-salary"], .salary-snippet-container, .estimated-salary, .salary-snippet').first
                        salary = salary_elem.inner_text().strip() if salary_elem.is_visible() else "Not listed"
                        
                        # Extract posted date
                        date_elem = parent.locator('[data-testid="job-date"], .date, span[title*="ago"]').first
                        posted_date = date_elem.inner_text().strip() if date_elem.is_visible() else "Unknown"
                        
                        # Extract job URL
                        job_url = ""
                        try:
                            link_elem = card.locator('xpath=..').locator('a').first
                            href = link_elem.get_attribute('href')
                            job_url = f"https://www.indeed.com{href}" if href and href.startswith('/') else href or ""
                        except:
                            job_url = url
                        
                        job = {
                            "clinic_name": company_name,
                            "job_title": job_title,
                            "location": job_location,
                            "salary": salary,
                            "posted_date": posted_date,
                            "job_url": job_url,
                            "scraped_at": datetime.now().isoformat()
                        }
                        
                        jobs.append(job)
                        print(f"  ✓ {company_name} - {job_title}")
                        
                    except Exception as e:
                        print(f"  ✗ Error parsing job card: {e}")
                        continue
                
                # Check for next page
                try:
                    next_btn = page.locator('[data-testid="pagination-page-next"], a[aria-label="Next"]').first
                    if not next_btn.is_visible() or next_btn.is_disabled():
                        print("No more pages available")
                        break
                except:
                    pass
                    
            except Exception as e:
                print(f"Error on page {page_num + 1}: {e}")
                continue
        
        browser.close()
    
    return jobs


def save_outputs(jobs, output_dir="./output"):
    """Save jobs to CSV and JSON."""
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save JSON
    json_path = os.path.join(output_dir, f"jobs_{timestamp}.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, indent=2, ensure_ascii=False)
    print(f"Saved JSON: {json_path}")
    
    # Save CSV
    csv_path = os.path.join(output_dir, f"jobs_{timestamp}.csv")
    if jobs:
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=jobs[0].keys())
            writer.writeheader()
            writer.writerows(jobs)
        print(f"Saved CSV: {csv_path}")
    
    # Also save as latest.csv for easy access
    latest_csv = os.path.join(output_dir, "latest.csv")
    if jobs:
        with open(latest_csv, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=jobs[0].keys())
            writer.writeheader()
            writer.writerows(jobs)
        print(f"Saved latest CSV: {latest_csv}")
    
    return csv_path, json_path


def main():
    args = parse_args()
    
    if args.headless_false:
        args.headless = False
    
    print(f"Starting scraper...")
    print(f"Location: {args.location}")
    print(f"Radius: {args.radius} miles")
    print(f"Pages: {args.pages}")
    print(f"Headless: {args.headless}")
    print("-" * 50)
    
    jobs = scrape_indeed(args.location, args.radius, args.pages, args.headless)
    
    print("-" * 50)
    print(f"Total unique clinics found: {len(jobs)}")
    
    if jobs:
        csv_path, json_path = save_outputs(jobs)
        print(f"\nOutputs saved to ./output/")
        print(f"Run: python email_generator.py --input {csv_path}")
    else:
        print("\nNo jobs found. Try adjusting search parameters or check if Indeed layout has changed.")


if __name__ == "__main__":
    main()
