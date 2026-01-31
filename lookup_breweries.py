#!/usr/bin/env python3
"""
Script to look up Untappd brewery info (logo URLs) for Van Moll Fest breweries.
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import re
from urllib.parse import quote_plus

# Unique breweries from the beer list
BREWERIES = [
    "CRAK",
    "The Garden Brewery",
    "Lost Brewing",
    "Maisel & Friends",
    "Bayreuther",
    "Mederij Marcus",
    "De Moersleutel",
    "Van Moll",
    "Moon Lark",
    "Prizm Brewing",
    "Salikatt",
    "Salt Beer Factory",
    "Sibeeria",
    "Sisters Brewery",
    "Struise Brouwers",
    "Totenhopfen",
    "Vocation Brewery",
]


def search_brewery(brewery_name: str) -> dict:
    """
    Search Untappd for a brewery and return info.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        search_url = (
            f"https://untappd.com/search?q={quote_plus(brewery_name)}&type=brewery"
        )
        response = requests.get(search_url, headers=headers, timeout=10)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Look for brewery results
            brewery_items = soup.select(".brewery-item")

            if brewery_items:
                first_item = brewery_items[0]

                # Get brewery URL
                link_elem = first_item.select_one("a")
                brewery_url = (
                    f"https://untappd.com{link_elem['href']}" if link_elem else None
                )

                # Get logo image
                logo_elem = first_item.select_one(".label img")
                logo_url = logo_elem["src"] if logo_elem else None

                # Get brewery name
                name_elem = first_item.select_one(".brewery-details .name")
                found_name = name_elem.text.strip() if name_elem else ""

                return {
                    "name": brewery_name,
                    "found_name": found_name,
                    "url": brewery_url,
                    "logo": logo_url,
                }

    except Exception as e:
        print(f"Error searching for {brewery_name}: {e}")

    return {"name": brewery_name, "found_name": None, "url": None, "logo": None}


def main():
    print("Looking up Untappd brewery info...")
    print(f"Total breweries: {len(BREWERIES)}")
    print("-" * 50)

    results = {}

    for i, brewery in enumerate(BREWERIES, 1):
        print(f"[{i}/{len(BREWERIES)}] Looking up: {brewery}...", end=" ", flush=True)

        info = search_brewery(brewery)
        results[brewery] = info

        if info["logo"]:
            print(f"Found: {info['found_name']}")
        else:
            print("Not found")

        time.sleep(1.5)  # Rate limiting

    # Save results
    with open("breweries.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("-" * 50)
    print(f"Done! Results saved to: breweries.json")

    # Summary
    found = sum(1 for r in results.values() if r.get("logo"))
    print(f"Found logos for {found}/{len(BREWERIES)} breweries")


if __name__ == "__main__":
    main()
