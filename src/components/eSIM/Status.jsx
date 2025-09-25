import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QRCodeDisplay from '../eSIM/QRCodeDisplay ';
import AxiosInstance from '../../../Axiosinstance';
import './Status.css';

const Status = () => {
  const [esims, setEsims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { User } = useSelector(state => state.Auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!User) {
      navigate('/login');
      return;
    }
    
    const fetchEsims = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await AxiosInstance.get('/esim/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // console.log('Full API response:', response.data);
        
        if (response.data && response.data.data) {
          setEsims(response.data.data);
        } else {
          console.error('No eSIM data found in response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching eSIMs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEsims();
  }, [User, navigate]);

  const filteredEsims = esims.filter(esim => {
    if (filter === 'all') return true;
    return esim.status === filter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'activated':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'failed':
        return 'fas fa-exclamation-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  // const getStatusColor = (status) => {
  //   switch(status) {
  //     case 'activated':
  //       return '#10b981';
  //     case 'pending':
  //       return '#f59e0b';
  //     case 'failed':
  //       return '#ef4444';
  //     default:
  //       return '#6b7280';
  //   }
  // };
  
  if (loading) {
    return (
      <div className="status-loading">
        <div className="loading-spinner"></div>
        <p>Loading your eSIM status...</p>
      </div>
    );
  }
  
  return (
    <div className="status-container" >
      <div className="status-header"  style={{margin:'5% 0'}}>
        <h2>Your eSIM Status</h2>
        <p>Manage and track your eSIM profiles</p>
      </div>
      
      {esims.length === 0 ? (
        <div className="no-esims">
          <div className="no-esims-icon">
            <i className="fas fa-sim-card"></i>
          </div>
          <h3>No eSIMs Yet</h3>
          <p>You haven't requested any eSIMs yet. Get started by requesting your first eSIM.</p>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/esimrequest')}
          >
            Request Your First eSIM
          </button>
        </div>
      ) : (
        <>
          <div className="status-filters">
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('all')}
              >
                All eSIMs ({esims.length})
              </button>
              <button 
                className={filter === 'activated' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('activated')}
              >
                <i className="fas fa-check-circle"></i> Activated ({esims.filter(e => e.status === 'activated').length})
              </button>
              <button 
                className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('pending')}
              >
                <i className="fas fa-clock"></i> Pending ({esims.filter(e => e.status === 'pending').length})
              </button>
              <button 
                className={filter === 'failed' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('failed')}
              >
                <i className="fas fa-exclamation-circle"></i> Failed ({esims.filter(e => e.status === 'failed').length})
              </button>
            </div>
          </div>

          <div className="esim-stats">
            <div className="stat-card">
              <div className="stat-icon activated">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{esims.filter(e => e.status === 'activated').length}</h3>
                <p>Activated eSIMs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{esims.filter(e => e.status === 'pending').length}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon failed">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{esims.filter(e => e.status === 'failed').length}</h3>
                <p>Failed Activations</p>
              </div>
            </div>
          </div>

          <div className="esim-list">
            {filteredEsims.map(esim => (
              <div key={esim._id} className="esim-card">
                <div className="esim-card-header">
                  <div className="esim-title">
                    <h3>eSIM Profile</h3>
                    <p className="esim-id">{esim.iccid || 'No ICCID'}</p>
                  </div>
                  <div className={`status-badge ${esim.status}`}>
                    <i className={getStatusIcon(esim.status)}></i>
                    <span>{esim.status.charAt(0).toUpperCase() + esim.status.slice(1)}</span>
                  </div>
                </div>
                
                <div className="esim-details">
                  <div className="detail-item">
                    <i className="fas fa-calendar-plus"></i>
                    <div>
                      <label>Request Date</label>
                      <p>{new Date(esim.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  {/* Show activation date if activated */}
                  {esim.status === 'activated' && esim.activationDate && (
                    <div className="detail-item">
                      <i className="fas fa-bolt"></i>
                      <div>
                        <label>Activated On</label>
                        <p>{new Date(esim.activationDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Show QR code ONLY for activated status */}
                {esim.status === 'activated' && esim.qrCodeData ? (
                  <div className="qr-section">
                    <div className="qr-header">
                      <h4>Your eSIM QR Code</h4>
                      <p>Scan this code to activate your eSIM on your device</p>
                    </div>
                    <div className="qr-content">
                      <div className="qr-code-wrapper">
                        <QRCodeDisplay 
                          qrCodeData={esim.qrCodeData} 
                          userName={User.name} 
                        />
                      </div>
                      <div className="qr-actions">
                        <button className="btn-secondary">
                          <i className="fas fa-download"></i> Download QR Code
                        </button>
                        <button className="btn-secondary">
                          <i className="fas fa-share-alt"></i> Share
                        </button>
                      </div>
                    </div>
                  </div>
                ) : esim.status === 'pending' ? (
                  <div className="status-message pending">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h4>Pending Approval</h4>
                      <p>Your eSIM request is pending admin approval. QR code will be generated after approval.</p>
                    </div>
                  </div>
                ) : esim.status === 'failed' ? (
                  <div className="status-message failed">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                      <h4>Activation Failed</h4>
                      <p>Your eSIM activation failed. Please try requesting a new eSIM.</p>
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/esimrequest')}
                    >
                      Request New eSIM
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Status;