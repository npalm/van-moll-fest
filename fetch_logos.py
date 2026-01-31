#!/usr/bin/env python3
"""
Script to fetch brewery logos from Untappd and save them locally.
"""

import requests
from bs4 import BeautifulSoup
import time
import os
import json
import re

# Brewery slugs (manually verified)
BREWERIES = {
    "CRAK": "CRAKBrewery",
    "The Garden Brewery": "TheGardenBrewery",
    "Lost Brewing": "LostBrewing",
    "Maisel & Friends": "MaiselAndFriends",
    "Bayreuther": "BayreutherBierbrauerei",
    "Mederij Marcus": "MederijMarcus",
    "De Moersleutel": "Moersleutel",
    "Van Moll": "VanMoll",
    "Moon Lark": "MoonLark",
    "Prizm Brewing": "PrizmBrewing",
    "Salikatt": "SalikattBryggeri",
    "Salt Beer Factory": "SaltBeerFactory",
    "Sibeeria": "sibeeria",
    "Sisters Brewery": "SistersBrouwerij",
    "Struise Brouwers": "StruiseBrouwers",
    "Totenhopfen": "totenhopfen",
    "Vocation Brewery": "VocationBrewery",
}


def fetch_brewery_logo(slug: str) -> str | None:
    """Fetch brewery page and extract logo URL."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }

    try:
        url = f"https://untappd.com/{slug}"
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Look for brewery logo in image src attributes
            for img in soup.select("img"):
                src = img.get("src", "")
                # Brewery logos are in the format: assets.untappd.com/site/brewery_logos/...
                if "brewery_logos" in src:
                    return src

    except Exception as e:
        print(f"Error: {e}")

    return None


def download_logo(url: str, filename: str, output_dir: str) -> bool:
    """Download logo image and save it."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "wb") as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Download error: {e}")
    return False


def main():
    output_dir = "vanmollfestwinter/public/logos"
    os.makedirs(output_dir, exist_ok=True)

    print("Fetching brewery logos from Untappd...")
    print("-" * 50)

    results = {}

    for name, slug in BREWERIES.items():
        print(f"Fetching {name} ({slug})...", end=" ", flush=True)

        logo_url = fetch_brewery_logo(slug)

        if logo_url:
            # Generate safe filename
            safe_name = re.sub(r"[^a-z0-9]", "_", name.lower())
            # Get extension from URL
            ext = logo_url.split(".")[-1].split("?")[0]
            if ext not in ["png", "jpg", "jpeg", "webp", "gif"]:
                ext = "jpeg"
            filename = f"{safe_name}.{ext}"

            if download_logo(logo_url, filename, output_dir):
                results[name] = {
                    "slug": slug,
                    "logo": f"/logos/{filename}",
                    "source": logo_url,
                }
                print(f"OK -> {filename}")
            else:
                print("Download failed")
                results[name] = {"slug": slug, "logo": None, "source": logo_url}
        else:
            print("Not found")
            results[name] = {"slug": slug, "logo": None, "source": None}

        time.sleep(1.5)  # Rate limiting

    # Save results
    with open("brewery_logos.json", "w") as f:
        json.dump(results, f, indent=2)

    print("-" * 50)
    found = sum(1 for r in results.values() if r.get("logo"))
    print(f"Downloaded {found}/{len(BREWERIES)} logos")
    print(f"Results saved to brewery_logos.json")


if __name__ == "__main__":
    main()
