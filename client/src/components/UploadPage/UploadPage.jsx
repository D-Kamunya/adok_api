import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadPage.css';

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        const excelFiles = droppedFiles.filter(file => 
        file.type === 'application/vnd.ms-excel' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xls') || 
        file.name.endsWith('.xlsx')
        );
        
        addFiles(excelFiles);
    };

    const addFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => 
        file.type === 'application/vnd.ms-excel' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xls') || 
        file.name.endsWith('.xlsx')
        );
        
        if (validFiles.length === 0) {
            toast.error('Please select valid Excel files (.xls, .xlsx)');
            return;
        }
        
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Please select at least one file to upload');
            return;
        }
        
        setIsUploading(true);
        setProgress(0);
        
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        
        try {
            const {data} = await axios.post('http://localhost:8080/api/v1/analyzer/upload-workbook/', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            
            setFiles([]); // clear selected files
            setProgress(100);
            
            // Show a toast per file
            data.forEach(item => {
            const { file, new_upload, processed, errors } = item;

            if (errors && errors.length) {
                toast.error(
                <div className="toast-body-overflow">
                    <strong>{file}</strong><br/>
                    {errors.map((err, i) => <div key={i}>• {err}</div>)}
                </div>,
                { autoClose: false }
                );
            } else {
                toast.success(
                <div className="toast-body-overflow">
                    {file} {new_upload ? 'uploaded' : 're-uploaded'} successfully.`
                </div>,
                { autoClose: false }
                );
            }
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(
                <div className="toast-body-overflow">
                    Upload failed: {error.message}
                </div>, { autoClose: false });
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <h1>Upload Attendance Data</h1>
                <p className="instructions">
                Upload Excel files containing church attendance data. Supported formats: .xls, .xlsx.
                Files should contain columns: Archdeaconry, Parish, Congregation, Sunday School, Adults, Youth, Disabled, Collected, Banked, Unbank, Sunday Date.
                </p>
                
                <div 
                className={`drop-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                >
                <div className="drop-content">
                    <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    multiple 
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style={{ display: 'none' }}
                    />
                    <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    </div>
                    <p className="drop-text">
                    {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
                    </p>
                    <p className="drop-subtext">Supports multiple Excel files (.xls, .xlsx)</p>
                </div>
                </div>
                
                {files.length > 0 && (
                <div className="file-list">
                    <h3>Selected Files ({files.length})</h3>
                    <ul>
                    {files.map((file, index) => (
                        <li key={index} className="file-item">
                        <div className="file-info">
                            <span className="file-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            </span>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">({formatFileSize(file.size)})</span>
                        </div>
                        <button 
                            className="remove-btn"
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                        >
                            ×
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
                
                <div className="upload-controls">
                <button 
                    className="upload-btn"
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                >
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                </button>
                
                {isUploading && (
                    <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        {progress > 5 ? `${progress}%` : ''}
                    </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

export default UploadPage;
