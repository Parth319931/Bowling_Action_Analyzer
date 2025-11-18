// src/components/analysis/VideoUpload.jsx
/**
 * VideoUpload Component
 * ---------------------
 * Drag-and-drop video upload interface with preview
 * 
 * Features:
 * - Drag and drop area
 * - File input fallback
 * - Video format validation
 * - File size validation (max 100MB)
 * - Upload progress indicator
 * - Video preview after selection
 * - Upload to backend API
 * 
 * Props:
 * - onUploadComplete: Callback with analysis ID after upload
 * - acceptedFormats: Array of accepted video formats
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { MdCloudUpload, MdVideoLibrary } from 'react-icons/md';
import Button from '../common/Button';
import Loader from '../common/Loader';

const UploadContainer = styled.div`
  width: 100%;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.isDragging ? 
    props.theme.colors.primary.main : 
    props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing['3xl']};
  text-align: center;
  background-color: ${props => props.isDragging ? 
    props.theme.colors.primary.main + '10' : 
    props.theme.colors.background.paper};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    background-color: ${props => props.theme.colors.primary.main + '10'};
  }
`;

const UploadIcon = styled.div`
  font-size: 64px;
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const UploadText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UploadHint = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const VideoPreview = styled.video`
  width: 100%;
  max-height: 400px;
  background-color: #000;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.md};
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.primary.main};
  width: ${props => props.progress}%;
  transition: width ${props => props.theme.transitions.normal};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const VideoUpload = ({ onUploadComplete, acceptedFormats = ['.mp4', '.avi', '.mov'] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return false;
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('view_type', 'front'); // or 'side'

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual API call
      // const response = await api.uploadVideo(formData, (progress) => {
      //   setUploadProgress(progress);
      // });

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock analysis ID
      const analysisId = 'analysis_' + Date.now();
      
      setTimeout(() => {
        onUploadComplete(analysisId);
      }, 500);

    } catch (err) {
      setError('Upload failed: ' + err.message);
      setIsUploading(false);
    }
  };

  return (
    <UploadContainer>
      {!selectedFile ? (
        <>
          <DropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon>
              <MdCloudUpload />
            </UploadIcon>
            <UploadText>Drag and drop your bowling video</UploadText>
            <UploadHint>or click to browse</UploadHint>
            <Button variant="outline">
              Select Video
            </Button>
          </DropZone>

          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleInputChange}
          />
        </>
      ) : (
        <>
          <PreviewContainer>
            <VideoPreview src={previewUrl} controls />
          </PreviewContainer>

          {isUploading ? (
            <>
              <Loader text={`Uploading... ${uploadProgress}%`} />
              <ProgressBar>
                <ProgressFill progress={uploadProgress} />
              </ProgressBar>
            </>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Button 
                variant="primary" 
                onClick={handleUpload}
                icon={<MdVideoLibrary />}
              >
                Analyze Video
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setError('');
                }}
              >
                Choose Different Video
              </Button>
            </div>
          )}
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadContainer>
  );
};

export default VideoUpload;
