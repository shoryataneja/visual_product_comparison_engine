import React, { useRef, useState, useEffect } from 'react';
import { PiImageDuotone, PiScanDuotone, PiSpinnerGapDuotone } from 'react-icons/pi';

const ImageUploader = ({ onImageUpload, isProcessing, setQueryImageLocal }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const [processStage, setProcessStage] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isProcessing) {
            setProcessStage(0);
            interval = setInterval(() => {
                setProcessStage(prev => Math.min(prev + 1, 3));
            }, 600);
        }
        return () => clearInterval(interval);
    }, [isProcessing]);

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const processFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        if (setQueryImageLocal) setQueryImageLocal(objectUrl);
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const cancelImage = () => {
        setPreview(null);
        if (setQueryImageLocal) setQueryImageLocal(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const doScan = (e) => {
        e.stopPropagation();
        if (!preview) {
            inputRef.current?.click();
            return;
        }
        const imgElement = new Image();
        imgElement.src = preview;
        imgElement.crossOrigin = 'anonymous';
        imgElement.onload = () => {
            onImageUpload(imgElement);
        };
    };

    if (isProcessing && preview) {
        const stages = ["Extracting Features...", "Computing Similarity...", "Ranking Models...", "Finalizing..."];
        const progress = Math.min((processStage + 1) * 25, 95);

        return (
            <div className="upload-container scanning-state">
                <img src={preview} alt="Scanning" className="uploaded-preview-img" />
                <div className="scan-line"></div>
                <div className="process-overlay">
                    <div className="process-text">
                        <PiSpinnerGapDuotone style={{ animation: 'spin 1.5s linear infinite' }} size={18} />
                        {stages[Math.min(processStage, 3)]}
                    </div>
                    <div className="process-bar-bg">
                        <div className="process-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (preview) {
        return (
            <div className="upload-container uploaded-preview-container">
                <img src={preview} alt="Preview" className="uploaded-preview-img" />
                <button className="preview-overlay-btn" onClick={cancelImage}>
                    <span>✕</span> Clear Scan
                </button>
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' }}>
                    <button className="btn-yellow" onClick={doScan}>
                        <PiScanDuotone size={20} /> Scan Product
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-container">
            <div
                className={`drop-zone-outlined ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                <div className="icon-box-yellow">
                    <img src="/image-icon.png" alt="Upload Image" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                </div>
                <div className="drop-text">Drop product image to scan</div>
                <button className="btn-yellow" onClick={doScan}>
                    <PiScanDuotone size={20} /> Select Product
                </button>
            </div>
        </div>
    );
};

export default ImageUploader;
