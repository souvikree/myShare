import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://myshare-92im.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      setFileUrl(response.data.fileUrl);
      alert(`File uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Drag & Drop. It's online.</h2>
        <div
          className={`p-6 border-2 border-dashed rounded-lg cursor-pointer ${dragActive ? 'border-blue-500' : 'border-gray-600'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="block text-center">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 mb-3 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10h14M5 14h14M7 18h10"
                ></path>
              </svg>
              <span className="block text-lg font-medium mb-2">Drag and drop your file here</span>
              <span className="text-sm text-gray-400">Or, <span className="text-blue-500 cursor-pointer">browse to upload</span></span>
            </div>
          </label>
        </div>
        {file && (
          <div className="mt-4 text-center">
            <p>Selected file: {file.name}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        )}
        {fileUrl && (
          <div className="mt-4 text-center">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {fileUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
