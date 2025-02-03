import os
import re
import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

def extract_pdbid_from_folder(folder_name):
    """Extract the PDB ID from the folder name."""
    match = re.search(r'AF-(\w+)-', folder_name)
    if match:
        return match.group(1)
    return None

def fetch_uniprot_description(pdbid):
    """Fetch the uniprotDescription from the AlphaFold API."""
    url = f"https://alphafold.ebi.ac.uk/api/prediction/{pdbid}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, list) and "uniprotDescription" in data[0]:
                return pdbid, data[0]["uniprotDescription"]
    except Exception as e:
        print(f"Error fetching data for PDB ID {pdbid}: {e}")
    return pdbid, None

def process_folder(folder_path, folder_name):
    """Process a single folder to extract the PDB ID and fetch its description."""
    folder_full_path = os.path.join(folder_path, folder_name)

    # Ensure it's a directory
    if os.path.isdir(folder_full_path):
        pdbid = extract_pdbid_from_folder(folder_name)

        if pdbid:
            print(f"Processing PDB ID: {pdbid}")
            return fetch_uniprot_description(pdbid)
    return None, None

def main():
    # Define the folder path
    folder_path = "/home/ubuntu/structs/preds/"

    # Initialize an empty dictionary to store the results
    results = {}

    # Scan the folder and get all subfolder names
    if os.path.exists(folder_path):
        subfolders = os.listdir(folder_path)

        # Use ThreadPoolExecutor for concurrent processing
        with ThreadPoolExecutor(max_workers=150) as executor:  # Adjust max_workers as needed
            future_to_folder = {
                executor.submit(process_folder, folder_path, folder_name): folder_name
                for folder_name in subfolders
            }

            for future in as_completed(future_to_folder):
                pdbid, uniprot_description = future.result()

                if pdbid and uniprot_description:
                    results[pdbid] = uniprot_description

        # Save the results to a JSON file
        output_file = "/home/ubuntu/structs/pdbid_uniprot_descriptions.json"
        with open(output_file, "w") as f:
            json.dump(results, f, indent=4)

        print(f"Results saved to {output_file}")

if __name__ == "__main__":
    main()
