import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../../utils/imageUtils';
import UploadIcon from '../icons/UploadIcon';
import TrashIcon from '../icons/TrashIcon';

interface ImageUploaderProps {
  onUpload: (fileData: { mimeType: string; data: string } | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file (PNG, JPG, etc).");
        return;
    }
    try {
      const { mimeType, data } = await fileToBase64(file);
      setPreview(URL.createObjectURL(file));
      onUpload({ mimeType, data });
    } catch (err) {
      setError("Failed to read the file.");
      console.error(err);
    }
  }, [onUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUpload(null);
    setError(null);
  };

  return (
    <div>
      <label className="block text-md font-semibold mb-2 text-black dark:text-white">🖼️ Upload a screenshot or mockup <span className="text-sm font-normal text-[#A6A6A6]">(optional)</span></label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-[#FF5308] bg-orange-50 dark:bg-orange-900/20' : 'border-[#A6A6A6] dark:border-gray-600'}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="object-contain h-full w-full rounded-md p-1" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-all"
              aria-label="Remove image"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-[#A6A6A6]">
            <UploadIcon className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold">Drag & drop or <span className="text-[#FF5308]">click to upload</span></p>
            <p className="text-xs">Helps AI understand where the message will appear.</p>
          </div>
        )}
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif, image/svg+xml"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
