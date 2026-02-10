import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';

const ImageUploader = ({ images, onImagesChange, maxImages = 3 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((files) => {
    const newImages = Array.from(files)
      .slice(0, maxImages - images.length)
      .map(file => {
        // Validate file size (max 200kb)
        if (file.size > 200 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 200KB.`);
          return null;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image.`);
          return null;
        }
        
        return {
          id: Date.now() + Math.random(),
          file,
          preview: URL.createObjectURL(file),
          name: file.name
        };
      })
      .filter(Boolean);

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, onImagesChange, maxImages]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-180 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop images here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Max {maxImages} images, 200KB each
        </p>
        
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium"
        >
          <FaPlus className="inline mr-2" />
          Choose Images
        </label>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-180 hover:bg-red-600"
                aria-label="Remove image"
              >
                <FaTrash size={14} />
              </button>
              
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {image.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Image Counter */}
      <div className="text-sm text-gray-500 text-center">
        {images.length} of {maxImages} images uploaded
        {images.length >= maxImages && (
          <span className="text-red-500 ml-2">Maximum reached</span>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;