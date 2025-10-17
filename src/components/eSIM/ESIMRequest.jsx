import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestESIM } from '../../redux/esimSlice';
import { checkKYCStatus } from '../../redux/KycSlice.js';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "../../../Axiosinstance"

const ESIMRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.esim);
  const { kycStatus } = useSelector(state => state.kyc);
  const { User } = useSelector(state => state.Auth);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'request'
  const [emailOtpError, setEmailOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [existingEsimWarning, setExistingEsimWarning] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (User) {
      dispatch(checkKYCStatus());
    }
  }, [User, dispatch]);
  
  useEffect(() => {
    if (kycStatus === 'pending') {
      showNotification('Please complete KYC verification first', 'error');
      navigate('/kyc');
    } else if (kycStatus === 'rejected') {
      showNotification('Your KYC was rejected. Please contact support.', 'error');
      navigate('/home');
    }
  }, [kycStatus, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const validatePhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits
    if (cleanedPhone.length !== 10) {
      return false;
    }
    
    // More flexible validation - allow any 10 digit number
    if (!/^\d{10}$/.test(cleanedPhone)) {
      return false;
    }
    
    return cleanedPhone;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setEmailOtpError('');
    
    const validatedPhone = validatePhoneNumber(phone);
    if (!validatedPhone) {
      showNotification('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    setIsSendingOTP(true);

    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.post('/esim/send-email-otp', 
        { phone: validatedPhone },
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      if (response.data.warning) {
        setExistingEsimWarning(true);
        showNotification(response.data.message, 'warning');
      } else {
        setExistingEsimWarning(false);
        showNotification('OTP sent to your registered email!', 'success');
      }

      setStep('otp');
      setCountdown(60); // 60 seconds countdown for resend
      localStorage.removeItem('otpErrorCount');
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Enhanced error handling
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        showNotification('Network error. Please check your connection.', 'error');
      } else if (error.response?.status === 500) {
        showNotification('Server error. Please try again later.', 'error');
      } else if (error.response?.data?.code === 'EMAIL_SERVICE_ERROR') {
        showNotification('Email service temporarily unavailable. Please try again in few minutes.', 'error');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
        showNotification(errorMessage, 'error');
      }
      
      setEmailOtpError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setEmailOtpError('');
    
    if (!otp || otp.length !== 6) {
      showNotification('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.post('/esim/verify-email-otp', 
        { otp, phone },
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000
        }
      );

      if (response.data.success) {
        setStep('request');
        localStorage.removeItem('otpErrorCount');
        showNotification('OTP verified successfully!', 'success');
        
        if (response.data.deactivatedExisting) {
          showNotification('Your previous eSIM has been deactivated.', 'info');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      if (error.response?.status === 400) {
        const errorCount = parseInt(localStorage.getItem('otpErrorCount') || '0') + 1;
        localStorage.setItem('otpErrorCount', errorCount.toString());
        
        if (errorCount >= 3) {
          setEmailOtpError('Too many failed attempts. Redirecting to home...');
          showNotification('Too many failed attempts. Redirecting to home...', 'error');
          setTimeout(() => {
            localStorage.removeItem('otpErrorCount');
            navigate('/');
          }, 2000);
          return;
        }
        
        const errorMessage = `Invalid OTP. ${3 - errorCount} attempts remaining.`;
        setEmailOtpError(errorMessage);
        showNotification(errorMessage, 'error');
      } else if (error.response?.status === 410) {
        setEmailOtpError('OTP has expired. Please request a new one.');
        showNotification('OTP has expired. Please request a new one.', 'error');
      } else {
        const errorMessage = error.response?.data?.message || 'Error verifying OTP. Please try again.';
        setEmailOtpError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setEmailOtpError('');
    setOtp('');
    
    try {
      const token = localStorage.getItem('token');
      const validatedPhone = validatePhoneNumber(phone);
      
      const response = await AxiosInstance.post('/esim/resend-email-otp', 
        { phone: validatedPhone },
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000
        }
      );

      setCountdown(60);
      showNotification('OTP resent successfully!', 'success');
    } catch (error) {
      console.error('Error resending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      showNotification(errorMessage, 'error');
    }
  };

  const handleRequest = () => {
    dispatch(requestESIM())
      .unwrap()
      .then((response) => {
        showNotification('eSIM requested successfully!', 'success');
        localStorage.removeItem('otpErrorCount');
        navigate('/status');
      })
      .catch(error => {
        console.error('eSIM request failed:', error);
        showNotification(error || 'Failed to request eSIM. Please try again.', 'error');
      });
  };

  const handleCancel = () => {
    localStorage.removeItem('otpErrorCount');
    navigate('/');
  };

  if (kycStatus !== 'approved') {
    return <div className="loading">Checking KYC status...</div>;
  }

  return (
    <div className="form-container" style={{marginTop:"5%"}}>
      {/* Compact Professional Notification */}
      {notification.show && (
        <div className="notification-wrapper">
          <div className={`notification-toast notification-${notification.type}`}>
            <div className="notification-icon">
              {notification.type === 'success' && (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              )}
              {notification.type === 'info' && (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              )}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="notification-progress"></div>
          </div>
        </div>
      )}
      
      <h2>Request New eSIM</h2>
      
      {step === 'phone' && (
        <>
          <p>We need to verify your phone number before processing your eSIM request.</p>
          
          {emailOtpError && <div className="error-message">{emailOtpError}</div>}
          
          <form onSubmit={handlePhoneSubmit}>
            <div>
              <input
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength="10"
                required
              />
            </div>
            
            <div className="button-group">
              <button type="submit" disabled={isSendingOTP}>
                {isSendingOTP ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <p>We've sent a 6-digit OTP to your registered email address</p>
          
          {existingEsimWarning && (
            <div className="warning-message">
              <strong>Note:</strong> Requesting a new eSIM will deactivate your current eSIM.
            </div>
          )}
          
          {emailOtpError && <div className="error-message">{emailOtpError}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleOTPSubmit}>
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                required
              />
            </div>
            
            <div className="button-group-vertical">
              <button type="submit">
                Verify OTP
              </button>
              <button 
                type="button" 
                onClick={handleResendOTP} 
                disabled={countdown > 0}
                className={countdown > 0 ? 'btn-disabled' : 'btn-resend'}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {step === 'request' && (
        <>
          <p>Your phone number has been verified successfully. Click the button below to generate a new eSIM profile.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button onClick={handleRequest} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Request eSIM'}
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Enhanced CSS styles */}
      <style>
        {`
          .form-container {
            max-width: 400px;
            margin: 40px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
          }
          
          .form-container h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 24px;
          }
          
          .form-container p {
            margin-bottom: 20px;
            color: #7f8c8d;
            text-align: center;
            line-height: 1.5;
          }
          
          .form-container input {
            width: 100%;
            padding: 14px;
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.3s, box-shadow 0.3s;
          }
          
          .form-container input:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          }
          
          .button-group {
            display: flex;
            gap: 12px;
          }
          
          .button-group-vertical {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .form-container button {
            padding: 14px 20px;
            border: none;
            border-radius: 8px;
            color: white;
            background-color: #3498db;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            flex: 1;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .form-container button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }
          
          .form-container button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .form-container button:disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .btn-resend {
            background-color: #2ecc71 !important;
          }
          
          .btn-disabled {
            background-color: #95a5a6 !important;
            cursor: not-allowed !important;
          }
          
          .btn-cancel {
            background-color: #e74c3c !important;
          }
          
          .loading {
            text-align: center;
            padding: 40px;
            font-size: 18px;
            color: #7f8c8d;
          }
          
          .error-message {
            color: #c0392b;
            background-color: #f9ebea;
            padding: 12px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #c0392b;
            font-size: 14px;
          }
          
          .warning-message {
            color: #d35400;
            background-color: #fef5e7;
            padding: 12px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #d35400;
            font-size: 14px;
          }
          
          /* Compact Notification Styles */
          .notification-wrapper {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 320px;
          }
          
          .notification-toast {
            background: white;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
            animation: slideIn 0.3s ease forwards;
            border-left: 3px solid;
          }
          
          .notification-success {
            border-left-color: #27ae60;
          }
          
          .notification-error {
            border-left-color: #e74c3c;
          }
          
          .notification-warning {
            border-left-color: #f39c12;
          }
          
          .notification-info {
            border-left-color: #3498db;
          }
          
          .notification-icon {
            display: flex;
            align-items: center;
            margin-right: 12px;
            flex-shrink: 0;
          }
          
          .notification-success .notification-icon {
            color: #27ae60;
          }
          
          .notification-error .notification-icon {
            color: #e74c3c;
          }
          
          .notification-warning .notification-icon {
            color: #f39c12;
          }
          
          .notification-info .notification-icon {
            color: #3498db;
          }
          
          .notification-content {
            flex: 1;
            margin-right: 8px;
          }
          
          .notification-message {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
            color: #2c3e50;
          }
          
          .notification-close {
            background: none;
            border: none;
            color: #95a5a6;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.2s;
          }
          
          .notification-close:hover {
            background: #f8f9fa;
            color: #7f8c8d;
          }
          
          .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: rgba(0, 0, 0, 0.1);
            transform-origin: left;
            animation: progress 5s linear forwards;
          }
          
          .notification-success .notification-progress {
            background: #27ae60;
          }
          
          .notification-error .notification-progress {
            background: #e74c3c;
          }
          
          .notification-warning .notification-progress {
            background: #f39c12;
          }
          
          .notification-info .notification-progress {
            background: #3498db;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes progress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ESIMRequest;