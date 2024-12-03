import { useState, useEffect } from 'react';
import * as $3Dmol from '3dmol';
import './Main.css'

export default function DemoAppPage() {
  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <span className='text-yellow-500'>Human</span> Proteome PDBs
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          {/* All the binding sites for the human proteome */}
        </p>
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <PDBSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PDBSearchForm() {
  const [pdbId, setPdbId] = useState('');
  const [pdbData, setPdbData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch PDB Data whenever pdbId changes
  useEffect(() => {
    if (!pdbId.trim()) {
      setPdbData(null); // Clear previous data when pdbId is empty
      return;
    }

    const fetchPdbData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${pdbId}`);
        if (!response.ok) throw new Error('PDB ID not found');
        const data = await response.json();
        setPdbData(data[0]); // Since response is an array, take the first item
      } catch (err) {
        setError(err.message || 'Failed to fetch PDB data');
        setPdbData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdbData();
  }, [pdbId]); // Re-run this effect whenever pdbId changes

  const handleSubmit = () => {
    if (pdbId.trim()) {
      // Directly set pdbId to trigger the useEffect
      setPdbId(pdbId);
    }
  };

  const downloadPdbFile = async () => {
    if (!pdbId) {
      alert("No PDB data available for download.");
      return;
    }

    try {
      const response = await fetch(`http://50.19.247.110:5002/pdb/${pdbId}`, {
        //const response = await fetch(`https://gpubio.xyz/pdb/${pdbId}`, {
        headers: { 'Accept': 'text/plain' },
      });
      if (!response.ok) throw new Error('Failed to fetch PDB file');
      const pdbText = await response.text();

      const blob = new Blob([pdbText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdbId}.pdb`; // Use PDB ID as filename
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDB file:', err);
      alert("Failed to download PDB file.");
    }
  };

  return (
    <div className='flex flex-col justify-center items-center gap-10'>
      <div className='flex items-center justify-between gap-3'>
        <input
          type='text'
          id='pdbId'
          className='text-sm text-gray-600 w-[400px] rounded-md border border-gray-200 bg-[#f5f0ff] shadow-md focus:outline-none'
          placeholder='Enter PDB ID (e.g., A0A0A0MS14)'
          value={pdbId}
          onChange={(e) => setPdbId(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button
          type='button'
          onClick={handleSubmit}
          className='min-w-[7rem] font-medium text-gray-800/90 bg-yellow-50 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-yellow-100 duration-200 ease-in-out'
        >
          Search
        </button>
      </div>

      {/* Only render the PDB data and viewer if pdbId is not empty */}
      {pdbId.trim() && (
        <div className='space-y-10'>
          {isLoading && <div>Loading...</div>}
          {error && <div className='text-red-600'>{error}</div>}
          {pdbData && (
            <>
              <div className='bg-gray-100 p-4 rounded-lg shadow'>
                <h3 className='text-xl font-bold text-gray-900'>PDB ID: {pdbData.entryId || 'Not available'}</h3>
                <p><strong>Title:</strong> {pdbData.uniprotDescription || 'No title available'}</p>
              </div>

              {/* Wrapper div for PDB Structure Viewer and Download Button */}
              <div className='relative'>
                <PDBStructureViewer pdbId={pdbId} />

                {/* Download PDB Button */}
                <button
                  onClick={downloadPdbFile}
                  className='absolute top-0 right-0 mt-4 mr-4 min-w-[7rem] font-medium text-white bg-blue-500 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-blue-600 duration-200 ease-in-out'
                >
                  Download PDB
                </button>

                {/* Add the legend here */}
                <ColorLegend />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ColorLegend() {
  return (
    <div className="absolute top-0 left-0 mt-4 ml-4">
      <h4 className="text-center">Binding Probability</h4>
      <div className="flex justify-center">
        <div style={{ width: '200px', height: '10px', background: 'linear-gradient(to right, white, blue)' }}></div>
      </div>
      <div className="text-center" style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export function PDBStructureViewer({ pdbId }) {
  useEffect(() => {
    if (!pdbId) return;

    const viewerContainer = document.getElementById("pdb-viewer");
    if (!viewerContainer) return;

    // Clear the existing viewer if there's any
    viewerContainer.innerHTML = ''; // Clears previous viewer content

    const viewer = $3Dmol.createViewer(viewerContainer, {
      backgroundColor: 'white',
    });

    viewerContainer.style.width = '800px'; // Fixed width
    viewerContainer.style.height = '600px'; // Fixed height

    //fetch(`http://localhost:5002/pdb/${pdbId}`, {
    fetch(`http:///50.19.247.110:5002/pdb/${pdbId}`, {
      headers: { 'Accept': 'text/plain' },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch PDB file');
        return response.text();  // Read the PDB file as plain text
      })
      .then(pdbText => {
        const model = viewer.addModel(pdbText, "pdb");

        const atoms = model.selectedAtoms({});
        const bFactors = atoms.map(atom => atom.b).filter(b => b !== undefined);

        if (bFactors.length === 0) {
          console.warn("No valid B-factor data found");
          return;
        }

        const gradient = new $3Dmol.Gradient.CustomLinear(0, 100, ['white', 'blue']);

        model.setStyle({}, {
          cartoon: {
            colorfunc: atom => gradient.valueToHex(atom.b ?? Math.min(...bFactors)),
          },
          stick: {
            colorfunc: atom => gradient.valueToHex(atom.b ?? Math.min(...bFactors)),
          },
        });

        viewer.zoomTo();
        viewer.render();
      })
      .catch(error => console.error("Failed to load PDB structure:", error));
  }, [pdbId]); // Re-run when pdbId changes

  return (
    <div
      id="pdb-viewer"
      className="mx-auto my-8" // This ensures the viewer is horizontally centered
      style={{ height: '600px', width: '800px', position: 'relative' }} // Fixed width and height
    ></div>
  );
}
