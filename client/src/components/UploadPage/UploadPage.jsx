import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            const BASE_URL= process.env.REACT_APP_API_BASE_URL;
            const {data} = await axios.post(`${BASE_URL}/api/v1/analyzer/upload-workbook/`, formData, {
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
                <div className="alert alert-danger mb-0">
                    <strong>{file}</strong>
                    <ul className="mb-0">
                    {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                    </ul>
                </div>,
                { autoClose: false }
                );
            } else {
                toast.success(
                <div className="alert alert-success mb-0">
                    {file} {new_upload ? "uploaded" : "re-uploaded"} successfully.
                </div>,
                { autoClose: false }
                );
            }
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(
                 <div className="alert alert-danger mb-0">
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
        <div className="container py-5">
            <div className="card shadow-sm">
                <div className="card-body">
                <h1 className="h4 text-center mb-3">Upload Attendance Data</h1>
                <p className="text-muted text-center">
                    Upload Excel files containing church attendance data. Supported
                    formats: <code>.xls</code>, <code>.xlsx</code>. Required columns:
                    Archdeaconry, Parish, Congregation, Sunday School, Adults, Youth,
                    Disabled, Collected, Banked, Unbank, Sunday Date.
                </p>

                {/* Drop Zone */}
                <div
                    className={`border border-2 rounded p-5 text-center mb-4 ${
                    isDragging ? "border-success bg-light" : "border-primary bg-light"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    style={{ cursor: "pointer" }}
                >
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept=".xls,.xlsx"
                    hidden
                    />
                    <div className="mb-2 text-primary">
                    <i className="bi bi-cloud-upload display-5"></i>
                    </div>
                    <p className="fw-semibold mb-1">
                    {isDragging ? "Drop files here" : "Click or drag files to upload"}
                    </p>
                    <small className="text-muted">
                    Supports multiple Excel files (.xls, .xlsx)
                    </small>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mb-4">
                    <h5>Selected Files ({files.length})</h5>
                    <ul className="list-group">
                        {files.map((file, index) => (
                        <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                            <i className="bi bi-file-earmark-excel text-success me-2"></i>
                            <strong>{file.name}</strong>{" "}
                            <small className="text-muted">
                                ({formatFileSize(file.size)})
                            </small>
                            </div>
                            <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                            >
                            <i className="bi bi-x-lg"></i>
                            </button>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}

                {/* Upload Controls */}
                <div className="d-flex flex-column align-items-center">
                    <button
                    className="btn btn-primary px-4"
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                    >
                    {isUploading ? "Uploading..." : "Upload Files"}
                    </button>

                    {isUploading && (
                    <div className="progress w-100 mt-3" style={{ height: "25px" }}>
                        <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        >
                        {progress > 5 ? `${progress}%` : ""}
                        </div>
                    </div>
                    )}
                </div>
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
