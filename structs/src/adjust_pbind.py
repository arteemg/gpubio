import os
import json

def remove_low_pbind(file_path):
    """Reads a JSON file, removes entries with 'low' pbind values, and writes the changes back."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Filter out entries with 'low' pbind values
        filtered_data = [entry for entry in data if entry.get('pbind') != "low"]

        # Write the filtered data back to the file
        with open(file_path, 'w') as f:
            json.dump(filtered_data, f, indent=4)

        print(f"Processed file (removed 'low' entries): {file_path}")
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")

def process_folders(base_folder):
    """Recursively processes all folders and JSON files."""
    for root, _, files in os.walk(base_folder):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                remove_low_pbind(file_path)

if __name__ == "__main__":
    # Specify the base folder containing subfolders with JSON files
    base_folder = "/home/ubuntu/structs/preds"
    process_folders(base_folder)
