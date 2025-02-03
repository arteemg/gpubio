import { useState, useEffect } from 'react';
import * as $3Dmol from '3dmol';
import './Main.css'

export default function HumanProteomePage() {
  return (
    <div className='py-14 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className=' mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <span className='text-yellow-500'>Human</span> Proteome PDBs
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          Binding Sites in the Human Proteome Identified by <a href="https://www.biorxiv.org/content/10.1101/2023.10.15.562410v1" target="_blank" className="text-blue-500">AF2BIND*</a>
        </p>
        <p className="text-center text-xs text-gray-500 dark:text-white mt-2">
          *AF2BIND: Predicting ligand-binding sites using the pair representation of AlphaFold2. Artem Gazizov, Anna Lian, Casper Goverde, Sergey Ovchinnikov, Nicholas F. Polizzi.
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPdbId, setSelectedPdbId] = useState('');
  const [pdbData, setPdbData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [residueData, setResidueData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [downloadType, setDownloadType] = useState('cluster'); // New state for download type

  // Search for PDB IDs
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowResults(true);

    try {
      const response = await fetch(`https://api.gpubio.xyz/search/?q=${searchQuery}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch PDB Data when a result is selected
  useEffect(() => {
    if (!selectedPdbId) {
      setPdbData(null);
      setResidueData([]);
      return;
    }

    setShowResults(false); // Hide results when selection is made

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch PDB data
        const pdbResponse = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${selectedPdbId}`);
        if (!pdbResponse.ok) throw new Error('UNIPROT ID not found');
        const pdbDataResult = await pdbResponse.json();
        setPdbData(pdbDataResult[0]);

        // Fetch residue data
        const residueResponse = await fetch(`https://api.gpubio.xyz/file/${selectedPdbId}/json`);
        if (!residueResponse.ok) throw new Error('Failed to fetch residue data');
        const residueDataResult = await residueResponse.json();
        setResidueData(residueDataResult);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setPdbData(null);
        setResidueData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPdbId]);

  const downloadPdbFile = async () => {
    if (!selectedPdbId) {
      alert("No PDB data available for download.");
      return;
    }

    try {
      const url = downloadType === 'cluster'
        ? `https://api.gpubio.xyz/file/${selectedPdbId}/pdb`
        : `https://api.gpubio.xyz/file/${selectedPdbId}/pdb/vanilla`;

      const response = await fetch(url, {
        headers: { 'Accept': 'text/plain' },
      });
      if (!response.ok) throw new Error('Failed to fetch PDB file');
      const pdbText = await response.text();

      const blob = new Blob([pdbText], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${selectedPdbId}.pdb`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading PDB file:', err);
      alert("Failed to download PDB file.");
    }
  };

  const setPdbId = (id) => {
    setSelectedPdbId(id);
    setSearchQuery(id);
  };

  const layoutClass = window.innerWidth <= 950 ? 'MOBILE' : 'PC';

  if (layoutClass === 'MOBILE') {
    return (
      <div className='pdb-container'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='text-sm text-gray-600 w-[400px] rounded-md border border-gray-200 bg-[#f5f0ff] shadow-md focus:outline-none'
              placeholder='Search Uniprot ID or description'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              type='button'
              onClick={handleSearch}
              className='min-w-[7rem] font-medium text-gray-800/90 bg-yellow-50 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-yellow-100 duration-200 ease-in-out'
            >
              Search
            </button>
          </div>

          <div className='flex items-center gap-1 mb-5'>
            <span className='text-sm text-gray-500'>e.g., </span>
            <button
              type='button'
              className='text-sm text-blue-500 underline hover:text-blue-700'
              onClick={() => setPdbId('P35367')}
            >
              Histamine H1 receptor
            </button>
          </div>
        </div>

        {showResults && searchResults.length > 0 && (
          <div className='mt-4 mb-5 bg-white rounded-md shadow-sm'>
            {searchResults.map((result) => (
              <button
                key={result.pdbId}
                onClick={() => setSelectedPdbId(result.pdbId)}
                className='w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100'
              >
                <div className='font-medium'>{result.pdbId}</div>
                <div className='text-sm text-gray-600'>{result.description}</div>
              </button>
            ))}
          </div>
        )}

        {isLoading && <div>Loading...</div>}
        {error && <div className='text-red-600'>{error}</div>}

        {selectedPdbId && pdbData && (
          <div className='space-y-10'>
            <div className='bg-gray-100 p-4 rounded-lg shadow'>
              <h3 className='text-xl font-bold text-gray-900'>UNIPROT ID: {pdbData.entryId || 'Not available'}</h3>
              <p><strong>Title:</strong> {pdbData.uniprotDescription || 'No title available'}</p>
            </div>
            <div className='relative'>
              <div className='pdb-structure-viewer-container'>
                <PDBStructureViewer pdbId={selectedPdbId} width="300px" height="600px" downloadType={downloadType} />
                <div className='absolute top-0 right-0 mt-4 mr-4 flex flex-col gap-2'>
                  <div className='flex items-center justify-end gap-2 mb-2'>
                    <select
                      value={downloadType}
                      onChange={(e) => setDownloadType(e.target.value)}
                      className='text-sm rounded-md border border-gray-200 bg-white shadow-md focus:outline-none'
                    >
                      <option value="cluster">Cluster</option>
                      <option value="raw">Raw</option>
                    </select>
                    <button
                      onClick={downloadPdbFile}
                      className='min-w-[7rem] font-medium text-white bg-blue-500 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-blue-600 duration-200 ease-in-out'
                    >
                      Download PDB
                    </button>
                  </div>
                </div>
                <ColorLegend topN="top-100" />
              </div>
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ResID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ResType</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">p(bind)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {residueData.map((residue) => (
                      <tr key={residue.resid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.resid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.restype}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.pbind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className='flex flex-col w-full max-w-2xl'>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='text-sm text-gray-600 flex-1 rounded-md border border-gray-200 bg-[#f5f0ff] shadow-md focus:outline-none mb-2'
              placeholder='Search Uniprot ID or description'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              type='button'
              onClick={handleSearch}
              className='min-w-[7rem] font-medium text-gray-800/90 bg-yellow-50 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-yellow-100 duration-200 ease-in-out'
            >
              Search
            </button>
          </div>

          <div className='flex items-center gap-1 mb-5'>
            <span className='text-sm text-gray-500'>e.g., </span>
            <button
              type='button'
              className='text-sm text-blue-500 underline hover:text-blue-700'
              onClick={() => setPdbId('P35367')}
            >
              Histamine H1 receptor
            </button>
          </div>
        </div>

        {showResults && searchResults.length > 0 && (
          <div className='mt-4 mb-5 bg-white rounded-md shadow-sm'>
            {searchResults.map((result) => (
              <button
                key={result.pdbId}
                onClick={() => setSelectedPdbId(result.pdbId)}
                className='w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100'
              >
                <div className='font-medium'>{result.pdbId}</div>
                <div className='text-sm text-gray-600'>{result.description}</div>
              </button>
            ))}
          </div>
        )}

        {isLoading && <div>Loading...</div>}
        {error && <div className='text-red-600'>{error}</div>}

        {selectedPdbId && pdbData && (
          <div className='space-y-10'>
            <div className='bg-gray-100 p-4 rounded-lg shadow'>
              <h3 className='text-xl font-bold text-gray-900'>{pdbData.entryId || 'Not available'}</h3>
              <p><strong>Title:</strong> {pdbData.uniprotDescription || 'No title available'}</p>
            </div>
            <div className='relative'>
              <PDBStructureViewer pdbId={selectedPdbId} downloadType={downloadType} />
              <div className='absolute top-0 right-0 mt-4 mr-4 flex items-center gap-2'>
                <select
                  value={downloadType}
                  onChange={(e) => setDownloadType(e.target.value)}
                  className='text-sm rounded-md border border-gray-200 bg-white shadow-md focus:outline-none'
                >

                  <option value="cluster">Filtered Predictions</option>
                  <option value="raw">Raw Predictions</option>

                </select>
                <button
                  onClick={downloadPdbFile}
                  className='min-w-[7rem] font-medium text-white bg-blue-500 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-blue-600 duration-200 ease-in-out'
                >
                  Download PDB
                </button>
              </div>
              <ColorLegend />
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ResID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ResType</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">p(bind)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {residueData.map((residue) => (
                      <tr key={residue.resid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.resid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.restype}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{residue.pbind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function ColorLegend({ topN = "top-0" }) {
  return (
    <div className={`absolute ${topN} left-0 mt-4 ml-4`}>
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

export function PDBStructureViewer({ pdbId, width = '800px', height = '600px', downloadType = 'cluster' }) {
  useEffect(() => {
    if (!pdbId) return;

    const viewerContainer = document.getElementById("pdb-viewer");
    if (!viewerContainer) return;

    // Clear the existing viewer if there's any
    viewerContainer.innerHTML = ''; // Clears previous viewer content

    const viewer = $3Dmol.createViewer(viewerContainer, {
      backgroundColor: 'white',
    });

    viewerContainer.style.width = width; // Fixed width
    viewerContainer.style.height = height; // Fixed height

    const url = downloadType === 'cluster'
      ? `https://api.gpubio.xyz/file/${pdbId}/pdb`
      : `https://api.gpubio.xyz/file/${pdbId}/pdb/vanilla`;

    fetch(url, {
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

        const getColorByAtomType = atom => {
          const atomColors = {
            'C': '#909090', // Gray for Carbon
            'O': '#FF0D0D', // Red for Oxygen
            'N': '##00FF00', // Green for Nitrogen
            'H': '#FFFFFF', // White for Hydrogen
            'S': '#FFFF30', // Yellow for Sulfur
          };
          return atomColors[atom.elem] ?? '#000000';
        };

        model.setStyle({}, {
          cartoon: {
            colorfunc: atom => gradient.valueToHex(atom.b ?? Math.min(...bFactors)),
          },
          stick: {
            colorfunc: atom => getColorByAtomType(atom),
            opacity: 0.1
          },
        });

        viewer.zoomTo();
        viewer.render();
      })
      .catch(error => console.error("Failed to load PDB structure:", error));
  }, [pdbId, downloadType]);

  return (
    <div
      id="pdb-viewer"
      className="mx-auto my-8"
      style={{ height: '600px', width: '800px', position: 'relative' }}
    ></div>
  );
}