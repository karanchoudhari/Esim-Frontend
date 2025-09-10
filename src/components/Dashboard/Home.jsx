import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkKYCStatus } from "../../redux/KycSlice";

import { activeEsim } from "../../redux/esimSlice";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { User, isLoading } = useSelector((state) => state.Auth);
  const { kycStatus } = useSelector((state) => state.kyc);
  const { esim } = useSelector((state) => state.esim);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Only fetch KYC status and eSIM data if user is logged in
    if (User) {
      Promise.all([
        dispatch(checkKYCStatus()),
        dispatch(activeEsim())
      ]).finally(() => {
        setIsPageLoading(false);
      });
    } else {
      setIsPageLoading(false);
    }
  }, [User, dispatch]);

  const HandleSignup = () => {
    navigate('/signup');
  };

  const HandleKYC = () => {
    navigate('/kyc');
  };

  const HandleESIM = () => {
    navigate('/esimrequest');
  };

  // Calculate counts from eSIM data
  const userEsims = esim?.data || [];
  const activeEsimCount = userEsims.filter(e => e.status === 'activated').length;
  const pendingRequestsCount = userEsims.filter(e => e.status === 'pending').length;

  if (isLoading || isPageLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-container" style={{margin:'5% 0'}}>
      {User ? (
        <div className="dashboard">
          <div className="welcome-header">
            <div className="welcome-avatar">
              {User.name ? User.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="welcome-text">
              <h2>Welcome back, {User.name}! 👋</h2>
              <p>You are successfully logged in to your eSIM dashboard</p>
            </div>
          </div>
          
          <div className="dashboard-actions">
            {kycStatus !== 'approved' ? (
              <div className="dashboard-card kyc-card">
                <div className="card-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="card-content">
                  <h3>Complete KYC Verification</h3>
                  <p>Verify your identity to request an eSIM and access all features</p>
                  <button onClick={HandleKYC} className="btn-primary">
                    <span>Start KYC Verification</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: kycStatus === 'pending' ? '50%' : '0%'}}></div>
                  </div>
                  <span className="progress-text">
                    {kycStatus === 'pending' ? 'Under Review' : 'Not Started'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="dashboard-card esim-card">
                <div className="card-icon">
                  <i className="fas fa-sim-card"></i>
                </div>
                <div className="card-content">
                  <h3>Request eSIM</h3>
                  <p>Get your digital SIM card instantly delivered to your device</p>
                  <button onClick={HandleESIM} className="btn-primary">
                    <span>Request eSIM Now</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <div className="card-badge">
                  <span>Verified</span>
                </div>
              </div>
            )}
            
            <div className="dashboard-card status-card">
              <div className="card-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="card-content">
                <h3>Check Status</h3>
                <p>View your eSIM activation status and manage your requests</p>
                <button onClick={() => navigate('/status')} className="btn-secondary">
                  <span>View Status</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              <div className="card-stats">
                <div className="stat-badge active">{activeEsimCount} Active</div>
                <div className="stat-badge pending">{pendingRequestsCount} Pending</div>
              </div>
            </div>
          </div>
          
          <div className="account-overview">
            <h3>Your Account Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-sim-card"></i>
                </div>
                <div className="stat-value">{activeEsimCount}</div>
                <div className="stat-label">Active eSIMs</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="stat-value">{kycStatus === 'approved' ? 'Verified' : 'Pending'}</div>
                <div className="stat-label">KYC Status</div>
                {kycStatus === 'approved' && <div className="verified-badge"><i className="fas fa-check"></i></div>}
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-value">{pendingRequestsCount}</div>
                <div className="stat-label">Pending Requests</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="stat-value">24h</div>
                <div className="stat-label">Avg. Activation</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="not-logged-in">
          <div className="access-card">
            <div className="access-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h2>Access Required</h2>
            <p>Please login to access your eSIM dashboard and manage your account</p>
            <div className="access-actions">
              <button onClick={HandleSignup} className="btn-primary">
                Sign Up / Login
              </button>
              <button onClick={() => navigate('/about')} className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;