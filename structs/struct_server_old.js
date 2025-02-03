const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS middleware

const app = express();

// Enable CORS for all domains (or configure as needed)
app.use(cors());

const PDB_DIRECTORY = "/home/ubuntu/structs/preds";
const PORT = "5002";

// Endpoint to serve either a .pdb or .json file
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
