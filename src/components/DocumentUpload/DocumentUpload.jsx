// ============================================
// DOCUMENT UPLOAD COMPONENT
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';

/**
 * Document upload component for database documentation
 * Allows uploading PDF, Word, or text files to enhance AI context
 */
const DocumentUpload = ({ isConnected }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Check for existing documentation on mount
  useEffect(() => {
    checkDocumentationStatus();
  }, [isConnected]);

  /**
   * Check if documentation is already uploaded
   */
  const checkDocumentationStatus = async () => {
    if (!isConnected) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/documentation/status`);
      if (response.data.has_documentation) {
        setUploadedDoc(response.data.metadata);
      }
    } catch (error) {
      console.error('Failed to check documentation status:', error);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      setUploadError('Please upload a PDF, Word, or text document');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/api/upload-documentation`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadedDoc(response.data.metadata);
      setShowUploadModal(false);
    } catch (error) {
      setUploadError(error.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Delete uploaded documentation
   */
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/documentation`);
      setUploadedDoc(null);
      setUploadError(null);
    } catch (error) {
      console.error('Failed to delete documentation:', error);
    }
  };

  // Don't show if not connected
  if (!isConnected) return null;

  return (
    <>
      {/* Upload button */}
      <div className="relative">
        <button
          onClick={() => setShowUploadModal(true)}
          className={`p-2 rounded-lg transition-colors ${
            uploadedDoc
              ? 'bg-green-100 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={uploadedDoc ? 'Documentation uploaded' : 'Upload database documentation'}
        >
          {uploadedDoc ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </button>

        {/* Indicator badge */}
        {uploadedDoc && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Upload Documentation</h3>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  Upload database documentation to help the AI understand your schema better. 
                  Supported formats: <strong>PDF, Word, Text</strong>
                </p>
              </div>

              {/* Current document status */}
              {uploadedDoc && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800">
                          Current Document
                        </p>
                        <p className="text-xs text-green-700 mt-1 truncate">
                          {uploadedDoc.filename}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {uploadedDoc.word_count} words • Uploaded {new Date(uploadedDoc.upload_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title="Remove documentation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {uploading ? (
                  <div className="space-y-3">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-gray-600">Uploading and processing...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Drop your document here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      Maximum file size: 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Error message */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{uploadError}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t space-x-2">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentUpload;
