import { useState } from 'react';
import { extractEmbedding } from './ai';

const ecommerceImages = import.meta.glob('/public/pictures for ecommerce/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });

function RegenerateCatalog() {
  const [progress, setProgress] = useState('');
  const [catalog, setCatalog] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateCatalog = async () => {
    setProgress('Starting...');
    const products = [];

    const allImages = Object.entries(ecommerceImages).map(([path, url]) => ({ path, url }));

    for (let i = 0; i < allImages.length; i++) {
      const { path, url } = allImages[i];
      const filename = path.split('/').pop();

      setProgress(`Processing ${i + 1}/${allImages.length}: ${filename}`);

      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        const embedding = await extractEmbedding(img);

        const imagePath = `/pictures for ecommerce/${filename}`;

        const lowerName = filename.toLowerCase();
        let category = 'Product';
        if (lowerName.includes('shoe') || lowerName.includes('sandal') || lowerName.includes('chappal') || lowerName.includes('jutti') || lowerName.includes('mojari') || lowerName.includes('khusa') || lowerName.includes('nagra') || lowerName.includes('kolhapuri')) {
          category = 'Footwear';
        } else if (lowerName.includes('kurta') || lowerName.includes('saree') || lowerName.includes('dress') || lowerName.includes('shirt') || lowerName.includes('pant')) {
          category = 'Clothing';
        } else if (lowerName.includes('honey') || lowerName.includes('oil') || lowerName.includes('spice') || lowerName.includes('tea') || lowerName.includes('pickle') || lowerName.includes('powder')) {
          category = 'Food & Spices';
        } else if (lowerName.includes('jewelry') || lowerName.includes('necklace') || lowerName.includes('earring') || lowerName.includes('bracelet') || lowerName.includes('anklet') || lowerName.includes('ring')) {
          category = 'Jewelry';
        } else if (lowerName.includes('lamp') || lowerName.includes('mat') || lowerName.includes('basket') || lowerName.includes('steamer') || lowerName.includes('furniture')) {
          category = 'Home & Decor';
        }

        products.push({
          id: `product_${String(i + 1).padStart(3, '0')}`,
          name: filename.replace(/\.[^/.]+$/, ''),
          category: category,
          brand: 'Various',
          image: imagePath,
          embedding: embedding
        });

      } catch (error) {
        console.error(`Failed ${filename}:`, error);
      }
    }

    const catalogData = { products };
    setCatalog(JSON.stringify(catalogData, null, 2));
    setProgress(`Done! Generated ${products.length} products. Go to localhost:5173/regenerate to regenerate with categories.`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(catalog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCatalog = () => {
    const blob = new Blob([catalog], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Regenerate Catalog</h1>
      <button onClick={generateCatalog} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }}>
        Generate Catalog with All Images
      </button>
      <p style={{ color: progress.includes('Done') ? 'green' : 'black' }}>{progress}</p>
      {catalog && (
        <div>
          <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={copyToClipboard} style={{ padding: '10px 20px', fontSize: '14px', background: copied ? '#4CAF50' : '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
            <button onClick={downloadCatalog} style={{ padding: '10px 20px', fontSize: '14px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              💾 Download catalog.json
            </button>
          </div>
          <textarea
            value={catalog}
            readOnly
            style={{ width: '100%', height: '400px', fontFamily: 'monospace', fontSize: '12px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
            💡 After downloading, replace <code>public/catalog.json</code> with the downloaded file
          </p>
        </div>
      )}
    </div>
  );
}

export default RegenerateCatalog;
