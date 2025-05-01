"use client"

import { useState } from 'react';
import { ClipLoader } from "react-spinners";
import ChatInterface from '../components/ChatInterface';
import FileUpload from '../components/FileUpload';

export default function Home() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = () => {
    setPdfUploaded(true);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">PDF Q&A with Gemini AI</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!pdfUploaded ? (
          <FileUpload 
            onUploadSuccess={handleUploadSuccess} 
            setLoading={setLoading}
            setError={setError}
          />
        ) : (
          <ChatInterface />
        )}
        
        {loading && (
          <div className="flex justify-center mt-6">
          <ClipLoader
            color={"#000000"}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          </div>
        )}
      </div>
    </main>
  )
}
