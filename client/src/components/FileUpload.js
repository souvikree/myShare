import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShareAlt } from '@fortawesome/free-solid-svg-icons';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true);
      const startTime = new Date().getTime();
      const response = await axios.post('https://myshare-92im.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progressPercentage = Math.round((loaded * 100) / total);
          const elapsedTime = (new Date().getTime() - startTime) / 1000;
          const speed = loaded / elapsedTime;
          const remainingTime = (total - loaded) / speed;

          setUploadProgress(progressPercentage);
          setUploadSpeed((speed / 1024).toFixed(2));
          setEstimatedTime(remainingTime.toFixed(2));
        },
      });
      console.log('Response:', response.data);
      setFileUrl(response.data.fileUrl);
      showAlertMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      showAlertMessage('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileUrl);
    showAlertMessage('Link copied to clipboard!');
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this file!',
        text: 'I wanted to share this file with you.',
        url: fileUrl,
      })
      .then(() => showAlertMessage('File shared successfully!'))
      .catch((error) => showAlertMessage('Error sharing file: ' + error));
    } else {
      showAlertMessage('Sharing is not supported in this browser.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-2xl md:text-3xl mb-4">Drag & Drop. It's online.</h2>
        <div
          className={`p-4 md:p-6 border-2 border-dashed rounded-lg cursor-pointer ${dragActive ? 'border-blue-500' : 'border-gray-600'}`}
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
              className={`mt-2 px-4 py-2 rounded ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
        {uploadProgress > 0 && (
          <div className="mt-4 text-center">
            <p>Upload Progress: {uploadProgress}%</p>
            <p>Upload Speed: {uploadSpeed} KB/s</p>
            <p>Estimated Time Remaining: {estimatedTime} s</p>
          </div>
        )}
        {fileUrl && (
          <div className="mt-4 text-center">
            <div className="bg-gray-900 bg-opacity-75 p-4 rounded-full inline-flex items-center">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-white mr-2 no-underline break-all">
                {fileUrl}
              </a>
              <span className="text-white mx-2">|</span>
              <FontAwesomeIcon
                icon={faCopy}
                className="text-white cursor-pointer mx-2"
                onClick={copyToClipboard}
              />
              <span className="text-white mx-2">|</span>
              <FontAwesomeIcon
                icon={faShareAlt}
                className="text-white cursor-pointer mx-2"
                onClick={handleShare}
              />
            </div>
          </div>
        )}
      </div>
      {showAlert && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-25 text-white px-4 py-2 rounded-full shadow-lg">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
