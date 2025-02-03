import os
import shutil

# Define the base source and target directories
base_source_dir = "/home/ubuntu/structs/preds_vanilla"
base_target_dir = "/home/ubuntu/structs/preds"

# Walk through the source directory
for root, _, files in os.walk(base_source_dir):
    for file in files:
        if file.endswith(".pdb"):
            # Construct full source path
            source_path = os.path.join(root, file)
            
            # Modify the filename to add "_vanilla" before the extension
            base_name, ext = os.path.splitext(file)
            new_file_name = f"{base_name}_vanilla{ext}"
            
            # Determine the target directory and target file path
            relative_path = os.path.relpath(root, base_source_dir)
            target_dir = os.path.join(base_target_dir, relative_path)
            target_path = os.path.join(target_dir, new_file_name)
            
            # Create target directory if it doesn't exist
            os.makedirs(target_dir, exist_ok=True)
            
            # Copy the file with the modified name
            shutil.copy2(source_path, target_path)
            print(f"Copied: {source_path} -> {target_path}")

print("All PDB files have been copied successfully!")
