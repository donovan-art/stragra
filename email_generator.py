import argparse
import csv
import os
from datetime import datetime


def parse_args():
    parser = argparse.ArgumentParser(description="Generate cold emails from scraped job leads")
    parser.add_argument("--input", default="./output/latest.csv", help="Input CSV file from scraper")
    parser.add_argument("--output", default="./output/emails.csv", help="Output CSV file for emails")
    parser.add_argument("--sender-name", default="Don", help="Sender first name")
    parser.add_argument("--company-name", default="StragraVet", help="Your company name")
    return parser.parse_args()


def generate_email_template(clinic_name, sender_name="Don", company_name="StragraVet"):
    """Generate a cold email for a veterinary clinic."""
    
    subject = f"Saw you're hiring a receptionist at {clinic_name}"
    
    body = f"""Hi there,

I noticed {clinic_name} is currently looking for a veterinary receptionist. I wanted to reach out because I think our AI phone agent could help your clinic handle call overflow and after-hours inquiries—without adding to your team's workload.

Our system answers calls 24/7, schedules appointments, answers common questions, and escalates emergencies to your on-call staff. Most clinics see a 40% reduction in missed calls within the first month.

Would you be open to a quick 10-minute chat to see if it might be a fit for {clinic_name}?

Best,
{sender_name}, {company_name}
---
P.S. No setup fees, and you can try it free for 14 days."""
    
    return subject, body


def generate_emails(input_csv, output_csv, sender_name="Don", company_name="StragraVet"):
    """Generate cold emails from scraped leads."""
    
    if not os.path.exists(input_csv):
        print(f"Error: Input file not found: {input_csv}")
        print("Run scraper.py first to generate leads.")
        return
    
    emails = []
    
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        leads = list(reader)
    
    print(f"Generating emails for {len(leads)} leads...")
    
    for lead in leads:
        clinic_name = lead.get('clinic_name', 'Unknown Clinic')
        job_title = lead.get('job_title', '')
        location = lead.get('location', '')
        job_url = lead.get('job_url', '')
        
        subject, body = generate_email_template(clinic_name, sender_name, company_name)
        
        email = {
            "clinic_name": clinic_name,
            "job_title": job_title,
            "location": location,
            "job_url": job_url,
            "subject": subject,
            "body": body,
            "generated_at": datetime.now().isoformat()
        }
        
        emails.append(email)
        print(f"  ✓ Generated email for: {clinic_name}")
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_csv) or '.', exist_ok=True)
    
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=emails[0].keys())
        writer.writeheader()
        writer.writerows(emails)
    
    print(f"\nSaved {len(emails)} emails to: {output_csv}")
    
    # Also save as individual text files for easy copy/paste
    emails_dir = os.path.join(os.path.dirname(output_csv) or '.', 'emails_individual')
    os.makedirs(emails_dir, exist_ok=True)
    
    for email in emails:
        safe_name = "".join(c if c.isalnum() or c in (' ', '-') else '_' for c in email['clinic_name'])
        filename = f"{safe_name.replace(' ', '_')}.txt"
        filepath = os.path.join(emails_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"To: {email['clinic_name']}\n")
            f.write(f"Subject: {email['subject']}\n")
            f.write(f"\n{email['body']}\n")
    
    print(f"Saved individual email files to: {emails_dir}")


def main():
    args = parse_args()
    
    print(f"Email Generator")
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Sender: {args.sender_name}, {args.company_name}")
    print("-" * 50)
    
    generate_emails(args.input, args.output, args.sender_name, args.company_name)


if __name__ == "__main__":
    main()
