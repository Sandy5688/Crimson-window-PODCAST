#!/usr/bin/env python3
import json
import requests
from datetime import datetime

def check_feed_status(url):
    """Check if RSS feed is accessible"""
    try:
        response = requests.get(url, timeout=10)
        return "ok" if response.status_code == 200 else "error"
    except:
        return "error"

def main():
    # Read feeds.json
    with open('feeds.json', 'r') as f:
        feeds = json.load(f)
    
    statuses = []
    checked_channels = set()
    
    print("Checking feed statuses...")
    
    for feed in feeds:
        channel = feed['channel']
        
        # Only check each channel once (first occurrence)
        if channel in checked_channels:
            continue
        
        checked_channels.add(channel)
        
        # Check first URL from the channel
        if feed['url'] and len(feed['url']) > 0:
            status = check_feed_status(feed['url'][0])
        else:
            status = "error"
        
        statuses.append({
            "channel": channel,
            "status": status,
            "checked_at": datetime.now().isoformat()
        })
        
        print(f"  ✓ Channel {channel}: {status}")
    
    # Write statuses.json
    with open('statuses.json', 'w') as f:
        json.dump(statuses, f, indent=2)
    
    print(f"\n✅ Status check complete! {len(statuses)} channels checked")
    print("📝 Results saved to statuses.json")

if __name__ == "__main__":
    main()
