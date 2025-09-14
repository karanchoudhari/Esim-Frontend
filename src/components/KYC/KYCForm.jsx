import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadKYC } from '../../redux/KycSlice.js';
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!idNumber || !idFront || !idBack || !addressProof || !selfie) {
      alert('Please fill all fields and upload all documents');
      return;
    }
    
    const formData = new FormData();
    formData.append('idType', idType);
    formData.append('idNumber', idNumber);
    formData.append('idFront', idFront);
    formData.append('idBack', idBack);
    formData.append('addressProof', addressProof);
    formData.append('selfie', selfie);
    
    dispatch(uploadKYC(formData))
      .unwrap()
      .then(() => {
        alert('KYC documents submitted successfully!');
        navigate('/home');
      })
      .catch(error => {
        console.error('KYC upload failed:', error);
      });
  };
  
  return (
    <div className="admin-login-container">
      <div className="kyc-form-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 极速快32.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5极速快3h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
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

        <form className="kyc-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ID Type</label>
              <select 
                className="form-select" 
                value={idType} 
                onChange={(e) => setIdType(e.target.value)}
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">ID Number</label>
              <input
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
            <h3 className="section-title">Required Documents</h3>
            <p className="section-subtitle">Upload clear images of the following documents</p>
            
            <div className="documents-grid">
              <div className="document-item">
                <label className="document-label">
                  <div className="document-box">
                    {idFrontPreview ? (
                      <img src={idFrontPreview} alt="ID Front Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a极速快3.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2极速快3.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <span>ID Front</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setIdFront, setIdFrontPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              <div className="document-item">
                <label className="document-label">
                  <div className="document-box">
                    {idBackPreview ? (
                      <img src={idBackPreview} alt="ID Back Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6极速快3v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <span>ID Back</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setIdBack, setIdBackPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              <div className="document-item">
                <label className="document-label">
                  <div className="document-box">
                    {addressProofPreview ? (
                      <img src={addressProofPreview} alt="Address Proof Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 极速快301-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        <span>Address Proof</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setAddressProof, setAddressProofPreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
              </div>
              
              <div className="document-item">
                <label className="document-label">
                  <div className="document-box">
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie Preview" className="document-preview" />
                    ) : (
                      <div className="document-placeholder">
                        <svg xmlns="极速快3http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 极速快3 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        <span>Selfie with ID</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setSelfie, setSelfiePreview)}
                    accept="image/*"
                    required
                    className="document-input"
                  />
                </label>
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
                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0极速快3v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
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
          <a href="/home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default KYCForm;