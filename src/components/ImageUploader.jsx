import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onImageUpload, isProcessing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const processFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Pass string path or image file up
        // However, the AI requires HTMLImageElement.
        // Create an image element
        const imgElement = new Image();
        imgElement.src = objectUrl;
        imgElement.crossOrigin = 'anonymous';
        imgElement.onload = () => {
            onImageUpload(imgElement);
        };
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="glass-panel uploader-card">
            <h3 style={{ alignSelf: 'flex-start', fontSize: '1.4rem' }}>Query Image</h3>

            <div
                className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                {preview ? (
                    <img src={preview} alt="Preview" className="preview-image" />
                ) : (
                    <>
                        <UploadCloud className="drop-zone-icon" />
                        <p style={{ fontWeight: 500 }}>Drag & Drop Image Here</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>or click to browse</p>
                    </>
                )}
            </div>

            <button
                className="btn-royal"
                onClick={() => inputRef.current?.click()}
                disabled={isProcessing}
            >
                <ImageIcon size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                {preview ? 'Change Image' : 'Select Product Image'}
            </button>

            {isProcessing && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <div className="loading-text">Extracting Visual Features...</div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
