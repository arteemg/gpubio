import os
import json
from Bio.PDB import PDBParser

# Function to extract residues and B-factors from a PDB file
def extract_bfactors(pdb_path):
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure('structure', pdb_path)
    residues = []

    for model in structure:
        for chain in model:
            for residue in chain:
                if 'CA' in residue:  # Considering only alpha carbons
                    atom = residue['CA']
                    bfactor = atom.get_bfactor()
                    resid = residue.get_id()[1]
                    restype = residue.get_resname()
                    residues.append({"resid": resid, "restype": restype, "pbind": bfactor})

    return residues

# Function to process all PDB files in the directory structure
def process_pdb_files(base_dir):
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.pdb'):
                pdb_path = os.path.join(root, file)
                output_path = os.path.join(root, f"{os.path.splitext(file)[0]}.json")

                # Extract and sort residues by B-factor
                residues = extract_bfactors(pdb_path)
                sorted_residues = sorted(residues, key=lambda x: x['pbind'], reverse=True)[0:20]

                # Save to JSON file
                with open(output_path, 'w') as json_file:
                    json.dump(sorted_residues, json_file, indent=2)

                print(f"Processed: {pdb_path} -> {output_path}")

# Main execution
def main():
    base_dir = "/home/ubuntu/structs/preds_vanilla"

    if not os.path.isdir(base_dir):
        print("Invalid directory path.")
        return

    process_pdb_files(base_dir)

if __name__ == "__main__":
    main()