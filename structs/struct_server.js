const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

const app = express();
const PORT = 5002;

// Enable CORS for all domains
app.use(cors());

// Path to the PDB data JSON file
const PDB_DATA_FILE = path.join('pdbid_uniprot_descriptions.json');

// Directory containing PDB files
const PDB_DIRECTORY = "/home/ubuntu/structs/preds";

// Search endpoint
app.get('/search', (req, res) => {
    const query = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 5; // Limit results, default to 5
    const page = parseInt(req.query.page, 10) || 1; // Pagination, default to page 1

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    fs.readFile(PDB_DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading PDB data file:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        let pdbData;
        try {
            pdbData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing PDB data file:', parseErr);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        // Prepare data for fuzzy search
        const fuse = new Fuse(Object.entries(pdbData).map(([pdbId, description]) => ({ pdbId, description })), {
            keys: ['description', 'pdbId'], // Fields to search in
            threshold: 0.3, // Lower is stricter, higher is looser
        });

        // Perform fuzzy search
        const results = fuse.search(query)
            .slice((page - 1) * limit, page * limit) // Apply pagination
            .map(result => result.item); // Map to original data structure

        res.json({ results, total: results.length });
    });
});

// Endpoint to serve vanilla PDB files
app.get('/file/:pdbId/pdb/vanilla', (req, res) => {
    const { pdbId } = req.params;

    // Construct the file path for the vanilla PDB file
    const filePath = path.join(
        PDB_DIRECTORY,
        `AF-${pdbId}-F1-model_v4`,
        `AF-${pdbId}_vanilla.pdb`
    );

    console.log(`Serving vanilla PDB file from: ${filePath}`); // Log the full path

    // Set content type for PDB files
    res.setHeader('Content-Type', 'text/plain');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving vanilla PDB file for ${pdbId}:`, err);
            res.status(404).send('Vanilla PDB file not found');
        }
    });
});

// Endpoint to serve other types of files
app.get('/file/:pdbId/:type', (req, res) => {
    const { pdbId, type } = req.params;

    // Check the requested file type and construct the appropriate file path
    const allowedTypes = ['pdb', 'json'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).send('Invalid file type requested');
    }

    const filePath = path.join(PDB_DIRECTORY, `AF-${pdbId}-F1-model_v4/AF-${pdbId}.${type}`);
    console.log(`Serving file from: ${filePath}`); // Log the full path

    // Set appropriate content type for the response
    const contentType = type === 'json' ? 'application/json' : 'text/plain';
    res.setHeader('Content-Type', contentType);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving ${type.toUpperCase()} file for ${pdbId}:`, err);
            res.status(404).send(`${type.toUpperCase()} file not found`);
        }
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
