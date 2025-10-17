import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { uploadKYC } from '../../redux/KycSlice.js';
import Webcam from 'react-webcam';
import "./KYCForm.css"

const KYCForm = () => {
  const [idType, setIdType] = useState('passport');
  const [idNumber, setIdNumber] = useState('');
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState(null);
  const [addressProofPreview, setAddressProofPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  
  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Modal state
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  
  const webcamRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.kyc);
  
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera functionality using react-webcam
  const openCamera = () => {
    setCameraError('');
    setShowCamera(true);
    setShowSelfieModal(false);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setCameraError('');
  };

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          setSelfie(file);
          setSelfiePreview(imageSrc);
          closeCamera();
        })
        .catch(err => {
          console.error('Error converting image:', err);
          setCameraError('Failed to capture photo');
        })
        .finally(() => {
          setIsCapturing(false);
        });
    } else {
      setCameraError('Unable to capture photo');
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const retakePhoto = () => {
    setSelfie(null);
    setSelfiePreview(null);
    openCamera();
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  // Handle selfie box click - open modal with options
  const handleSelfieClick = () => {
    if (!selfiePreview) {
      setShowSelfieModal(true);
    }
  };

  // Handle upload photo option
  const handleUploadPhoto = () => {
    // Trigger the hidden file input
    document.getElementById('selfieInput').click();
    setShowSelfieModal(false);
  };

  // Handle live photo option
  const handleLivePhoto = () => {
    openCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!idNumber.trim()) {
      alert('Please enter your ID number');
      return;
    }
    
    if (!idFront) {
      alert('Please upload ID front image');
      return;
    }
    
    if (!idBack) {
      alert('Please upload ID back image');
      return;
    }
    
    if (!addressProof) {
      alert('Please upload address proof');
      return;
    }
    
    if (!selfie) {
      alert('Please take a selfie with your ID');
      return;
    }
    
    const formData = new FormData();
    formData.append('idType', idType);
    formData.append('idNumber', idNumber.trim());
    formData.append('idFront', idFront);
    formData.append('idBack', idBack);
    formData.append('addressProof', addressProof);
    formData.append('selfie', selfie);
    
    try {
      await dispatch(uploadKYC(formData)).unwrap();
      alert('KYC documents submitted successfully!');
      navigate('/home');
    } catch (error) {
      console.error('KYC upload failed:', error);
    }
  };
  
  return (
    <div className="admin-login-container">
      {/* Selfie Options Modal */}
      {showSelfieModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md"
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '1.5rem',
              width: '91.666667%',
              maxWidth: '28rem'
            }}
          >
            <div 
              className="flex justify-between items-center mb-4"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
            >
              <h3 
                className="text-lg font-semibold"
                style={{ fontSize: '1.125rem', fontWeight: '600' }}
              >
                Add Selfie with ID
              </h3>
              <button 
                onClick={() => setShowSelfieModal(false)}
                className="text-gray-500 hover:text-gray-700"
                style={{ color: '#6B7280' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }}>
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <p 
              className="text-gray-600 mb-6"
              style={{ color: '#4B5563', marginBottom: '1.5rem' }}
            >
              Choose how you want to add your selfie with ID
            </p>
            
            <div 
              className="flex flex-col space-y-4"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <button
                onClick={handleLivePhoto}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <div 
                  className="flex items-center space-x-3"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600" style={{ width: '2rem', height: '2rem', color: '#2563EB' }}>
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div 
                    className="text-left"
                    style={{ textAlign: 'left' }}
                  >
                    <div 
                      className="font-medium text-gray-900"
                      style={{ fontWeight: '500', color: '#111827' }}
                    >
                      Live Photo
                    </div>
                    <div 
                      className="text-sm text-gray-500"
                      style={{ fontSize: '0.875rem', color: '#6B7280' }}
                    >
                      Take a photo using your camera
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={handleUploadPhoto}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <div 
                  className="flex items-center space-x-3"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600" style={{ width: '2rem', height: '2rem', color: '#059669' }}>
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                  <div 
                    className="text-left"
                    style={{ textAlign: 'left' }}
                  >
                    <div 
                      className="font-medium text-gray-900"
                      style={{ fontWeight: '500', color: '#111827' }}
                    >
                      Upload Photo
                    </div>
                    <div 
                      className="text-sm text-gray-500"
                      style={{ fontSize: '0.875rem', color: '#6B7280' }}
                    >
                      Upload an existing photo from your device
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-modal-content">
            <div className="camera-header">
              <h3>Take Selfie with ID</h3>
              <button 
                type="button" 
                className="close-camera"
                onClick={closeCamera}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="camera-preview">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={() => setCameraError('Unable to access camera. Please check permissions.')}
                className="camera-video"
              />
            </div>
            
            {cameraError && (
              <div className="camera-error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {cameraError}
              </div>
            )}
            
            <div className="camera-controls">
              <button 
                type="button" 
                className="capture-button"
                onClick={capturePhoto}
                disabled={isCapturing || cameraError}
              >
                {isCapturing ? (
                  <>
                    <svg className="button-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                    </svg>
                    Capturing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                      <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    Take Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="kyc-form-card" style={{marginTop:"5%"}}>
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
            </svg>
          </div>
          <h2>KYC Verification</h2>
          <p>Complete your identity verification process</p>
        </div>

        {error && (
          <div className="error-alert">
            <div className="error-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <h3>Verification Error</h3>
            </div>
            <p>{error}</p>
          </div>
        )}

        <form className="kyc-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idType" className="form-label">ID Type</label>
              <select 
                id="idType"
                className="form-select" 
                value={idType} 
                onChange={(e) => setIdType(e.target.value)}
                required
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="idNumber" className="form-label">ID Number</label>
              <input
                id="idNumber"
                className="form-input"
                type="text"
                placeholder="Enter ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="documents-section">
            <h3 className="section-title text-center">Required Documents</h3>
            <p className="section-subtitle text-center">Upload clear images of the following documents</p>
            
            <div className="documents-grid">
              {/* ID Front */}
              <div className="document-item">
                <label htmlFor="idFront" className="document-label">
                  <div className="document-box">
                    {idFrontPreview ? (
                      <img src={idFrontPreview} alt="ID Front Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <span>ID Front</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="idFront"
                    type="file"
                    onChange={(e) => handleFileChange(e, setIdFront, setIdFrontPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              {/* ID Back */}
              <div className="document-item">
                <label htmlFor="idBack" className="document-label">
                  <div className="document-box">
                    {idBackPreview ? (
                      <img src={idBackPreview} alt="ID Back Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <span>ID Back</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="idBack"
                    type="file"
                    onChange={(e) => handleFileChange(e, setIdBack, setIdBackPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              {/* Address Proof */}
              <div className="document-item">
                <label htmlFor="addressProof" className="document-label">
                  <div className="document-box">
                    {addressProofPreview ? (
                      <img src={addressProofPreview} alt="Address Proof Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        <span>Address Proof</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="addressProof"
                    type="file"
                    onChange={(e) => handleFileChange(e, setAddressProof, setAddressProofPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              {/* Selfie with ID - Separate from file input */}
              <div className="document-item">
                <div className="selfie-section">
                  <div className="document-label">
                    <div 
                      className={`document-box ${!selfiePreview ? 'selfie-clickable' : ''}`}
                      onClick={handleSelfieClick}
                    >
                      {selfiePreview ? (
                        <div className="selfie-preview-container">
                          <img src={selfiePreview} alt="Selfie Preview" className="document-preview" />
                          <div className="selfie-actions">
                            <button 
                              type="button" 
                              className="selfie-action-btn retake-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                retakePhoto();
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                              </svg>
                              Retake
                            </button>
                            <button 
                              type="button" 
                              className="selfie-action-btn submit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Photo is already set, no need to do anything
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                              </svg>
                              Photo Ready
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="document-placeholder selfie-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                          </svg>
                          <span>Selfie with ID</span>
                          <div className="selfie-instruction">
                            Click to add selfie with ID
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Hidden file input for form validation */}
                    <input
                      id="selfieInput"
                      type="file"
                      onChange={(e) => handleFileChange(e, setSelfie, setSelfiePreview)}
                      accept="image/*"
                      required
                      className="document-input"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'button-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="button-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Verification'
              )}
            </button>
          </div>
        </form>

        <div className="back-link">
          <Link href="/home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KYCForm;