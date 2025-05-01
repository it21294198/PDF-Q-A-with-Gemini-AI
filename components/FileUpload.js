"use client"

import { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess, setLoading, setError }) {
  const [dragActive, setDragActive] = useState(false);
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
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleClick = () => {
    inputRef.current.click();
  };
  
  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('pdf', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }
      
      onUploadSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div 
        className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 48 48"
        >
          <path 
            d="M24 8l-4 4h3v14h2V12h3l-4-4z"
            fill="currentColor"
          />
          <path 
            d="M37 16v20H11V16H8v20c0 1.66 1.34 3 3 3h26c1.66 0 3-1.34 3-3V16h-3z" 
            fill="currentColor"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your PDF here, or click to select file
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Only PDF files are supported
        </p>
      </div>
      <input 
        ref={inputRef}
        onChange={handleChange}
        type="file"
        id="file-upload"
        name="file-upload"
        className="hidden"
        accept="application/pdf"
      />
    </div>
  );
}