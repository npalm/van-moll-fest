#!/usr/bin/env python3
"""
Script to look up Untappd ratings for Van Moll Fest Winter Edition beers.
Uses web scraping to search Untappd for each beer.
"""

import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote_plus

# Beer data extracted from the PDF
BEERS = [
    # CRAK
    {"brewery": "CRAK", "beer": "Guerilla IPA", "style": "IPA", "abv": "5.8%"},
    {"brewery": "CRAK", "beer": "Calimax 2025", "style": "Coffee Stout", "abv": "6.5%"},
    {"brewery": "CRAK", "beer": "Loza Farms NEIPA", "style": "NEIPA", "abv": "6.5%"},
    {"brewery": "CRAK", "beer": "Pizzapils Freestyle", "style": "Extra Dry-Hopped Italian Pilsner", "abv": "4.7%"},
    
    # THE GARDEN
    {"brewery": "The Garden Brewery", "beer": "Triple IPA Superdelic & Nectaron", "style": "Triple IPA", "abv": "10.0%"},
    {"brewery": "The Garden Brewery", "beer": "Istrian Malvazije White Wine Sour", "style": "White Wine Sour", "abv": "5.4%"},
    {"brewery": "The Garden Brewery", "beer": "Imperial Slavonian Frankovka Red Wine Stout", "style": "Red Wine Stout", "abv": "8.5%"},
    {"brewery": "The Garden Brewery", "beer": "Croatian Imperial Stout", "style": "Imperial Stout", "abv": "10.3%"},
    
    # LOST
    {"brewery": "Lost Brewing", "beer": "Mango Cream Pie", "style": "Smoothie Sour", "abv": "6.0%"},
    {"brewery": "Lost Brewing", "beer": "Oblivion", "style": "Imperial Stout", "abv": "12.0%"},
    {"brewery": "Lost Brewing", "beer": "Stratasphere", "style": "Double NEIPA", "abv": "8.0%"},
    {"brewery": "Lost Brewing", "beer": "Amortentia", "style": "Double NEIPA", "abv": "8.0%"},
    
    # MAISEL
    {"brewery": "Maisel & Friends", "beer": "Bourbon Bock Barrel Aged 2025", "style": "Barrel Aged Bock", "abv": "8.3%"},
    {"brewery": "Maisel & Friends", "beer": "Twin Pils", "style": "Italian Pilsner", "abv": "5.0%"},
    {"brewery": "Maisel & Friends", "beer": "Urban IPA", "style": "IPA", "abv": "5.6%"},
    {"brewery": "Bayreuther", "beer": "Hell Unfiltered", "style": "Helles", "abv": "4.7%"},
    
    # MEDERIJ MARCUS
    {"brewery": "Mederij Marcus", "beer": "Blauwe Bes Mede", "style": "Mead – Melomel", "abv": "11.0%"},
    {"brewery": "Mederij Marcus", "beer": "Kersen Mede", "style": "Mead – Melomel", "abv": "11.0%"},
    {"brewery": "Mederij Marcus", "beer": "Bosvruchten Mede", "style": "Mead – Melomel", "abv": "10.0%"},
    {"brewery": "Mederij Marcus", "beer": "Naturel Mede", "style": "Mead – Traditional", "abv": "10.0%"},
    {"brewery": "Mederij Marcus", "beer": "Naturel Mede – Whisky BA", "style": "Mead – Traditional BA", "abv": "14.0%"},
    {"brewery": "Mederij Marcus", "beer": "Carnica", "style": "Mead – Braggot", "abv": "11.0%"},
    {"brewery": "Mederij Marcus", "beer": "Slechtvalk", "style": "Mead – Braggot", "abv": "13.0%"},
    {"brewery": "Mederij Marcus", "beer": "Slechtvalk Barrel Aged", "style": "Mead – Braggot BA", "abv": "14.0%"},
    
    # DE MOERSLEUTEL
    {"brewery": "De Moersleutel", "beer": "9 Years: Return To Ithaca", "style": "Belgian Quadrupel", "abv": "11.0%"},
    {"brewery": "De Moersleutel", "beer": "Blueprints: Suitcase", "style": "DIPA", "abv": "8.5%"},
    {"brewery": "De Moersleutel", "beer": "Blueprints: Microscope", "style": "Triple NEIPA", "abv": "9.0%"},
    {"brewery": "De Moersleutel", "beer": "Ancient Engineering: Biface", "style": "Triple-Mashed Tripel", "abv": "12.0%"},
    
    # VAN MOLL
    {"brewery": "Van Moll", "beer": "Quadrophenia", "style": "Quadrupel", "abv": "10.0%"},
    {"brewery": "Van Moll", "beer": "Toewijding", "style": "Belgian Blonde", "abv": "6.5%"},
    {"brewery": "Van Moll", "beer": "Stop Making Sense", "style": "Imperial Porter", "abv": "9.5%"},
    {"brewery": "Van Moll", "beer": "Adagio", "style": "Barrel-Aged Strong Ale", "abv": "11.5%"},
    {"brewery": "Van Moll", "beer": "Trekdrop", "style": "Imperial Liquorice Stout", "abv": "9.5%"},
    {"brewery": "Van Moll", "beer": "Summa", "style": "Rich Strong Ale", "abv": "10.5%"},
    {"brewery": "Van Moll", "beer": "Dreamcatcher", "style": "NEIPA", "abv": "6.0%"},
    {"brewery": "Van Moll", "beer": "The Aztec Mystic", "style": "Mexican Spiced Imperial Stout", "abv": "9.5%"},
    
    # MOON LARK
    {"brewery": "Moon Lark", "beer": "Marble. With Vanilla", "style": "Imperial Stout", "abv": "11.0%"},
    {"brewery": "Moon Lark", "beer": "Complete.", "style": "Hazy DIPA", "abv": "7.3%"},
    {"brewery": "Moon Lark", "beer": "Chimney.", "style": "Smoked Baltic Porter", "abv": "8.9%"},
    {"brewery": "Moon Lark", "beer": "Garden.", "style": "Hoppy Grodziskie", "abv": "3.3%"},
    
    # PRIZM
    {"brewery": "Prizm Brewing", "beer": "Breakfast Bowl", "style": "Oatmeal Smoothie Sour", "abv": "6.0%"},
    {"brewery": "Prizm Brewing", "beer": "The Way is Shut", "style": "Imperial Stout", "abv": "12.0%"},
    {"brewery": "Prizm Brewing", "beer": "To Arcadia", "style": "DDH TIPA", "abv": "9.0%"},
    {"brewery": "Prizm Brewing", "beer": "Bali", "style": "NEIPA", "abv": "5.7%"},
    
    # SALIKATT
    {"brewery": "Salikatt", "beer": "Green Living", "style": "West Coast IPA", "abv": "6.5%"},
    {"brewery": "Salikatt", "beer": "Pulp Fiction", "style": "Smoothie Sour", "abv": "6.0%"},
    {"brewery": "Salikatt", "beer": "Embla 2023", "style": "Bourbon BA Double Bock", "abv": "8.5%"},
    {"brewery": "Salikatt", "beer": "Buzzer Beater", "style": "Double NEIPA", "abv": "8.0%"},
    
    # SALT
    {"brewery": "Salt Beer Factory", "beer": "Banshee", "style": "NEIPA", "abv": "7.0%"},
    {"brewery": "Salt Beer Factory", "beer": "Tram", "style": "Double NEIPA", "abv": "8.0%"},
    {"brewery": "Salt Beer Factory", "beer": "Huckaback", "style": "NEIPA", "abv": "5.5%"},
    {"brewery": "Salt Beer Factory", "beer": "Pud Black Forest Gateau", "style": "Stout", "abv": "7.2%"},
    
    # SIBEERIA
    {"brewery": "Sibeeria", "beer": "Prague Tap Room 2nd Anniversary", "style": "Triple NEIPA", "abv": "9.2%"},
    {"brewery": "Sibeeria", "beer": "Timeless", "style": "Oak Aged Pale Lager", "abv": "5.6%"},
    {"brewery": "Sibeeria", "beer": "Blackcurrant Sorbet", "style": "Sour Ale", "abv": "3.9%"},
    {"brewery": "Sibeeria", "beer": "I Love the Smell of Peacherine in the Morning", "style": "NEIPA", "abv": "7.0%"},
    
    # SISTERS BREWERY
    {"brewery": "Sisters Brewery", "beer": "Smoker", "style": "Rauchbier", "abv": "5.4%"},
    {"brewery": "Sisters Brewery", "beer": "Hive", "style": "Wheat Ale", "abv": "5.3%"},
    {"brewery": "Sisters Brewery", "beer": "Mitsubachi", "style": "Blonde with Lemongrass", "abv": "5.8%"},
    {"brewery": "Sisters Brewery", "beer": "Meloponini 2025/2026", "style": "NEIPA", "abv": "6.2%"},
    {"brewery": "Sisters Brewery", "beer": "Queen Bee", "style": "DIPA", "abv": "7.7%"},
    {"brewery": "Sisters Brewery", "beer": "Honey", "style": "Blonde with Honey", "abv": "6.9%"},
    {"brewery": "Sisters Brewery", "beer": "Apis", "style": "Tripel with Grapefruit", "abv": "8.5%"},
    {"brewery": "Sisters Brewery", "beer": "Bzzz", "style": "Doppelbock", "abv": "8.0%"},
    {"brewery": "Sisters Brewery", "beer": "Osmia Barrel Aged Wild Ale Moerbei", "style": "BA Wild Ale", "abv": "5.0%"},
    {"brewery": "Sisters Brewery", "beer": "Osmia Barrel Aged Wild Ale Rabarber", "style": "BA Wild Ale", "abv": "5.0%"},
    {"brewery": "Sisters Brewery", "beer": "Osmia Barrel Aged Wild Ale Cognac 2024", "style": "BA Wild Ale", "abv": "5.7%"},
    {"brewery": "Sisters Brewery", "beer": "Brother Adam Wild Ale en Oranje wijn", "style": "Wild Ale / Orange Wine", "abv": "5.9%"},
    {"brewery": "Sisters Brewery", "beer": "Brother Adam Barrel Aged Wild Ale", "style": "BA Wild Ale", "abv": "5.9%"},
    {"brewery": "Sisters Brewery", "beer": "Brother Adam Barrel Aged Grape Ale Imperial Porter", "style": "BA Imperial Porter", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Batch 10 Black Madagascar Vanille", "style": "Imperial Milk Stout", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Pchela met Macadamia", "style": "Imperial Stout", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Pchela Special 2025 Vista Alegre", "style": "BA Imperial Stout", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Pchela Special 2025 Rutte", "style": "BA Imperial Stout", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Nectar", "style": "Barleywine", "abv": "10.5%"},
    {"brewery": "Sisters Brewery", "beer": "Wild Turkey Barrel Aged 2024 Nectar Special", "style": "BA Barleywine", "abv": "10.7%"},
    
    # STRUISE BROUWERS
    {"brewery": "Struise Brouwers", "beer": "Amaric Grand Cru Laphroaig", "style": "BA Dark Quad", "abv": "10.0%"},
    {"brewery": "Struise Brouwers", "beer": "Amaric Grand Cru Bourbon", "style": "BA Dark Quad", "abv": "10.0%"},
    {"brewery": "Struise Brouwers", "beer": "Black Albert Black Damnation 35", "style": "BA Imperial Stout", "abv": "13.0%"},
    
    # TOTENHOPFEN
    {"brewery": "Totenhopfen", "beer": "Crazy Train", "style": "DDH DIPA", "abv": "7.6%"},
    {"brewery": "Totenhopfen", "beer": "PoC#10 BA Porto Ruby Bloody Vlad", "style": "BA Fruited IPA", "abv": "6.7%"},
    {"brewery": "Totenhopfen", "beer": "Transatlantic Fusion", "style": "NEIPA with Guava", "abv": "6.6%"},
    {"brewery": "Totenhopfen", "beer": "Hot & Fancy", "style": "Mezcal Cucumber Sour", "abv": "4.2%"},
    
    # VOCATION
    {"brewery": "Vocation Brewery", "beer": "Full Roast", "style": "Coffee & Walnut Porter", "abv": "7.0%"},
    {"brewery": "Vocation Brewery", "beer": "Outer Limit", "style": "New World Pale", "abv": "5.4%"},
    {"brewery": "Vocation Brewery", "beer": "Birthday Cake", "style": "Chocolate Stout", "abv": "6.0%"},
    {"brewery": "Vocation Brewery", "beer": "Jamageddon", "style": "Pastry Stout", "abv": "8.0%"},
]


def search_untappd(brewery: str, beer: str) -> dict:
    """
    Search Untappd for a beer and return rating info.
    Returns dict with 'rating' and 'url' keys.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    # Try different search query combinations
    search_queries = [
        f"{brewery} {beer}",
        f"{beer} {brewery}",
        beer,
    ]
    
    for query in search_queries:
        try:
            search_url = f"https://untappd.com/search?q={quote_plus(query)}"
            response = requests.get(search_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for beer results
                beer_items = soup.select('.beer-item')
                
                if beer_items:
                    first_item = beer_items[0]
                    
                    # Get rating
                    rating_elem = first_item.select_one('.rating .num')
                    rating = rating_elem.text.strip() if rating_elem else None
                    
                    # Get beer URL
                    link_elem = first_item.select_one('a.label')
                    beer_url = f"https://untappd.com{link_elem['href']}" if link_elem else None
                    
                    # Get beer name to verify match
                    name_elem = first_item.select_one('.beer-details .name')
                    found_name = name_elem.text.strip() if name_elem else ""
                    
                    # Get brewery name
                    brewery_elem = first_item.select_one('.beer-details .brewery')
                    found_brewery = brewery_elem.text.strip() if brewery_elem else ""
                    
                    if rating:
                        return {
                            'rating': rating,
                            'url': beer_url,
                            'found_name': found_name,
                            'found_brewery': found_brewery
                        }
            
            time.sleep(1)  # Be respectful with rate limiting
            
        except Exception as e:
            print(f"Error searching for {brewery} - {beer}: {e}")
            continue
    
    return {'rating': 'N/A', 'url': None, 'found_name': None, 'found_brewery': None}


def generate_markdown(results: list) -> str:
    """Generate markdown output from results."""
    md = """# Van Moll Fest Winter Edition Beers - With Untappd Ratings

| Brewery | Beer | Style | ABV | Untappd Rating |
|---------|------|-------|-----|----------------|
"""
    
    current_brewery = None
    for item in results:
        brewery = item['brewery']
        beer = item['beer']
        style = item['style']
        abv = item['abv']
        rating = item.get('rating', 'N/A')
        url = item.get('url')
        
        # Add section header for new brewery
        if brewery != current_brewery:
            current_brewery = brewery
            md += f"| **{brewery}** | | | | |\n"
        
        # Format rating with link if available
        if url and rating != 'N/A':
            rating_display = f"[{rating}]({url})"
        else:
            rating_display = rating
        
        md += f"| | {beer} | {style} | {abv} | {rating_display} |\n"
    
    return md


def main():
    print("Looking up Untappd ratings for Van Moll Fest beers...")
    print(f"Total beers to look up: {len(BEERS)}")
    print("-" * 50)
    
    results = []
    
    for i, beer_info in enumerate(BEERS, 1):
        brewery = beer_info['brewery']
        beer = beer_info['beer']
        
        print(f"[{i}/{len(BEERS)}] Looking up: {brewery} - {beer}...", end=" ", flush=True)
        
        rating_info = search_untappd(brewery, beer)
        
        result = {**beer_info, **rating_info}
        results.append(result)
        
        if rating_info['rating'] != 'N/A':
            print(f"Found: {rating_info['rating']}")
        else:
            print("Not found")
        
        # Rate limiting
        time.sleep(1.5)
    
    # Generate markdown
    markdown_output = generate_markdown(results)
    
    # Save to file
    output_path = "van_moll_fest_beers_with_ratings.md"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown_output)
    
    print("-" * 50)
    print(f"Done! Results saved to: {output_path}")
    
    # Also print summary
    found = sum(1 for r in results if r.get('rating') != 'N/A')
    print(f"Found ratings for {found}/{len(BEERS)} beers")


if __name__ == "__main__":
    main()
