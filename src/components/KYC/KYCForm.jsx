import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadKYC } from '../../redux/kycSlice';

const KYCForm = () => {
  const [idType, setIdType] = useState('passport');
  const [idNumber, setIdNumber] = useState('');
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [selfie, setSelfie] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.kyc);
  
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
    <div className="form-container">
      <h2>KYC Verification</h2>
      <p>Please submit the required documents for verification</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Type:</label>
          <select value={idType} onChange={(e) => setIdType(e.target.value)}>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>
        
        <div>
          <label>ID Number:</label>
          <input 
            type="text" 
            value={idNumber} 
            onChange={(e) => setIdNumber(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label>ID Front Image:</label>
          <input 
            type="file" 
            onChange={(e) => setIdFront(e.target.files[0])} 
            accept="image/*" 
            required 
          />
        </div>
        
        <div>
          <label>ID Back Image:</label>
          <input 
            type="file" 
            onChange={(e) => setIdBack(e.target.files[0])} 
            accept="image/*" 
            required 
          />
        </div>
        
        <div>
          <label>Address Proof:</label>
          <input 
            type="file" 
            onChange={(e) => setAddressProof(e.target.files[0])} 
            accept="image/*" 
            required 
          />
        </div>
        
        <div>
          <label>Selfie with ID:</label>
          <input 
            type="file" 
            onChange={(e) => setSelfie(e.target.files[0])} 
            accept="image/*" 
            required 
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;