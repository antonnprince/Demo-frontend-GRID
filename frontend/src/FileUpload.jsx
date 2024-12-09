import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError('No file selected');
      return;
    }

    // Validate file type
    if (file.type !== 'video/mp4') {
      setError('Please upload an MP4 file');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Optional: Validate file size (e.g., max 50MB)
    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Reset error and set file
    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Handle file upload (mock upload for demonstration)
  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    // Mock upload logic
    console.log('Uploading file:', selectedFile);
    alert(`File "${selectedFile.name}" uploaded successfully!`);
  };

  return (
    <div className="py-4  mx-auto my-auto text-white rounded-lg bg-neutral-700 w-[300px] md:w-1/2 lg:w-1/4 ">
      <h2 className="text-3xl p-4 font-bold mb-4 text-white">MP4 File Uploader</h2>

      <input
        type="file"
        accept="video/mp4"
        onChange={handleFileChange}
        className="mb-4"
      />

      {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

      {previewUrl && (
        <div className="mb-4">
          <h3 className="font-semibold">Video Preview:</h3>
          <video
            src={previewUrl}
            controls
            className="w-full h-auto rounded-md mt-2"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-[#2563EB] hover:bg-blue-600 w-1/2 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
