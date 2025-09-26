# Podcast Feeds Deployment & Health Checker

## Overview
This repository contains all the work completed for the podcast feeds project. It includes structured channel information, feed submission details, health checker scripts, and instructions for managing credentials securely. 

The goal of this setup is to provide a central, organized location to manage all podcast feeds, verify their accessibility, and deliver proof of operational status to clients.

---

## Contents

### 1. Feeds Data
- `feeds.json` – JSON list of all channels and associated platforms.
- `channels.xlsx` – Excel file summarizing each channel with:
  - Name
  - Platforms
  - RSS feed URLs
  - Current verification status (manual verification for some platforms like TuneIn)

### 2. Health Checker
- `check_feeds.py` – Python script that:
  - Parses all feeds in `feeds.json`
  - Checks live status for each feed
  - Generates `statuses.json` with HTTP status codes or error messages
- `statuses.json` – Output generated after running the health checker.
- Works on both Mac and Windows (instructions below).

### 3. Credentials
- Credentials for all platforms are stored securely in a separate `.env` file.
- The `.env` file is **not committed** to this repository for security.
- Access to credentials should be via a secure vault or encrypted ZIP shared privately.

### 4. Proof of Verification
- Screenshots and example XML feed views (if included in `docs/screenshots`) serve as visual proof of feeds being reachable.
- Podchaser feeds have been added and verified where applicable.

---

## How to Use

### 1. Local Health Check
1. Ensure Python 3 is installed.
2. Install dependencies:
   ```bash
   pip install requests feedparser python-dotenv
