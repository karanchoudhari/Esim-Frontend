import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../../Axiosinstance';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [esims, setEsims] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    pendingESIM: 0
  });
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [selectedESIM, setSelectedESIM] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showESIMModal, setShowESIMModal] = useState(false);
  const [editingKYC, setEditingKYC] = useState(false);
  const [editingESIM, setEditingESIM] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await AxiosInstance.get('/admin/users');
      const usersWithKYC = usersResponse.data.map(user => ({
        ...user,
        kycStatus: user.kycStatus || 'not_submitted'
      }));
      setUsers(usersWithKYC);
      
      // Fetch KYC submissions
      const kycResponse = await AxiosInstance.get('/admin/kyc-submissions');
      setKycSubmissions(kycResponse.data);
      
      // Fetch eSIM requests
      const esimsResponse = await AxiosInstance.get('/admin/esim-requests');
      setEsims(esimsResponse.data);
      
      // Calculate stats
      const pendingKYC = usersResponse.data.filter(kyc => kyc.kycStatus === 'pending').length;
      const pendingESIM = esimsResponse.data.filter(esim => esim.status === 'pending').length;
      
      setStats({
        totalUsers: usersWithKYC.length,
        pendingKYC:pendingKYC,
        pendingESIM
      });
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleKYCApproval = async (kycId, status, userName) => {
    try {
      await AxiosInstance.put(`/admin/kyc/${kycId}`, { status });
      
      // Show notification
      showNotification(`KYC for ${userName} has been ${status} successfully`, 'success');
      
      fetchData(); // Refresh all data
      setShowKYCModal(false);
      setEditingKYC(false);
    } catch (error) {
      console.error('Error updating KYC status:', error);
      showNotification('Error updating KYC status', 'error');
    }
  };
  
  const handleESIMStatus = async (esimId, status, userName) => {
    try {
      await AxiosInstance.put(`/admin/esim/${esimId}`, { status });
      
      // Show notification
      showNotification(`eSIM for ${userName} has been ${status} successfully`, 'success');
      
      fetchData();
      setShowESIMModal(false);
      setEditingESIM(false);
    } catch (error) {
      console.error('Error updating eSIM status:', error);
      showNotification('Error updating eSIM status', 'error');
    }
  };
  
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="notification-icon ${type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const viewKYCDetails = (user) => {
    const userKYC = kycSubmissions.find(kyc => kyc.userId && kyc.userId._id === user._id);
    if (userKYC) {
      setSelectedKYC({ user, kyc: userKYC });
      setShowKYCModal(true);
      setEditingKYC(false);
    }
  };

  const viewESIMDetails = (esim) => {
    setSelectedESIM(esim);
    setShowESIMModal(true);
    setEditingESIM(false);
  };

  // Helper function to find KYC submission for a user
  const findUserKYC = (userId) => {
    return kycSubmissions.find(kyc => kyc.userId && kyc.userId._id === userId);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'not_submitted': return 'status-not_submitted';
      case 'activated': return 'status-approved';
      case 'failed': return 'status-rejected';
      default: return 'status-not_submitted';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>
          <i className="fas fa-shield-alt"></i>
          Admin Dashboard
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{stats.totalUsers}</h3>
            </div>
            <div className="stat-icon users">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Pending KYC</p>
              <h3 className="stat-value">{stats.pendingKYC}</h3>
            </div>
            <div className="stat-icon kyc">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">eSIM Requests</p>
              <h3 className="stat-value">{stats.pendingESIM}</h3>
            </div>
            <div className="stat-icon esim">
              <i className="fas fa-wifi"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i>
          Users & KYC
        </button>
        <button 
          className={`admin-tab ${activeTab === 'esims' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('esims')}
        >
          <i className="fas fa-wifi"></i>
          eSIM Requests
        </button>
      </div>
      
      {/* Users & KYC Section */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Users & KYC Approvals</h3>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>KYC Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr className="loading-row">
                    <td colSpan="4" className="text-center">
                      {loading ? 'Loading users...' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  users.map(user => {
                    const userKYC = findUserKYC(user._id);
                    const kycStatus = userKYC ? userKYC.status : user.kycStatus;
                    
                    return (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-name">{user.name}</div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(kycStatus)}`}>
                            {kycStatus}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {userKYC && (
                              <button 
                                className="btn-info"
                                onClick={() => viewKYCDetails(user)}
                              >
                                <i className="fas fa-eye"></i> View Details
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* eSIM Requests Section */}
      {activeTab === 'esims' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>eSIM Requests</h3>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>ICCID</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {esims.length === 0 ? (
                  <tr className="loading-row">
                    <td colSpan="5" className="text-center">
                      {loading ? 'Loading eSIM requests...' : 'No eSIM requests found'}
                    </td>
                  </tr>
                ) : (
                  esims.map(esim => (
                    <tr key={esim._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-name">{esim.userId?.name || 'Unknown User'}</div>
                        </div>
                      </td>
                      <td className="esim-iccid">{esim.iccid || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(esim.status)}`}>
                          {esim.status}
                        </span>
                      </td>
                      <td>{new Date(esim.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-info"
                            onClick={() => viewESIMDetails(esim)}
                          >
                            <i className="fas fa-eye"></i> Details
                          </button>
                          {esim.status === 'pending' && (
                            <>
                              <button 
                                className="btn-success" 
                                onClick={() => handleESIMStatus(esim._id, 'activated', esim.userId?.name || 'user')}
                              >
                                <i className="fas fa-bolt"></i> Activate
                              </button>
                              <button 
                                className="btn-danger" 
                                onClick={() => handleESIMStatus(esim._id, 'failed', esim.userId?.name || 'user')}
                              >
                                <i className="fas fa-times"></i> Reject
                              </button>
                            </>
                          )}
                          {esim.status !== 'pending' && (
                            <span className="no-action">
                              Already {esim.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* KYC Modal */}
      {showKYCModal && selectedKYC && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>KYC Details</h3>
              <button className="modal-close" onClick={() => {
                setShowKYCModal(false);
                setEditingKYC(false);
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <h4>Full Name</h4>
                  <p>{selectedKYC.user.name}</p>
                </div>
                <div className="detail-item">
                  <h4>Email</h4>
                  <p>{selectedKYC.user.email}</p>
                </div>
                <div className="detail-item">
                  <h4>KYC Status</h4>
                  <p className={getStatusClass(selectedKYC.kyc.status)}>{selectedKYC.kyc.status}</p>
                </div>
                {selectedKYC.kyc.idType && (
                  <div className="detail-item">
                    <h4>ID Type</h4>
                    <p>{selectedKYC.kyc.idType}</p>
                  </div>
                )}
                {selectedKYC.kyc.idNumber && (
                  <div className="detail-item">
                    <h4>ID Number</h4>
                    <p>{selectedKYC.kyc.idNumber}</p>
                  </div>
                )}
              </div>
              
              <div className="document-section">
                <h4>ID Document Front</h4>
                {selectedKYC.kyc.idFront ? (
                  <div className="document-image">
                    <img src={`http://localhost:4000/uploads/${selectedKYC.kyc.idFront}`} alt="ID Front" />
                  </div>
                ) : (
                  <p>No document uploaded</p>
                )}
              </div>
              
              <div className="document-section">
                <h4>ID Document Back</h4>
                {selectedKYC.kyc.idBack ? (
                  <div className="document-image">
                    <img src={`http://localhost:4000/uploads/${selectedKYC.kyc.idBack}`} alt="ID Back" />
                  </div>
                ) : (
                  <p>No document uploaded</p>
                )}
              </div>
              
              <div className="document-section">
                <h4>Selfie with ID</h4>
                {selectedKYC.kyc.selfie ? (
                  <div className="document-image">
                    <img src={`http://localhost:4000/uploads/${selectedKYC.kyc.selfie}`} alt="Selfie with ID" />
                  </div>
                ) : (
                  <p>No selfie uploaded</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              {!editingKYC ? (
                <button 
                  className="btn-primary" 
                  onClick={() => setEditingKYC(true)}
                >
                  <i className="fas fa-edit"></i> Edit Status
                </button>
              ) : (
                <>
                  <button 
                    className="btn-success" 
                    onClick={() => handleKYCApproval(selectedKYC.kyc._id, 'approved', selectedKYC.user.name)}
                  >
                    <i className="fas fa-check"></i> Approve
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleKYCApproval(selectedKYC.kyc._id, 'rejected', selectedKYC.user.name)}
                  >
                    <i className="fas fa-times"></i> Reject
                  </button>
                </>
              )}
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setShowKYCModal(false);
                  setEditingKYC(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* eSIM Modal */}
      {showESIMModal && selectedESIM && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>eSIM Request Details</h3>
              <button className="modal-close" onClick={() => {
                setShowESIMModal(false);
                setEditingESIM(false);
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <h4>User Name</h4>
                  <p>{selectedESIM.userId?.name || 'Unknown User'}</p>
                </div>
                <div className="detail-item">
                  <h4>User Email</h4>
                  <p>{selectedESIM.userId?.email || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <h4>Status</h4>
                  <p className={getStatusClass(selectedESIM.status)}>{selectedESIM.status}</p>
                </div>
                <div className="detail-item">
                  <h4>ICCID</h4>
                  <p>{selectedESIM.iccid || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <h4>SM-DP+ Address</h4>
                  <p>{selectedESIM.smdpAddress || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <h4>Activation Code</h4>
                  <p>{selectedESIM.activationCode || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <h4>Matching ID</h4>
                  <p>{selectedESIM.matchingId || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <h4>Created At</h4>
                  <p>{new Date(selectedESIM.createdAt).toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <h4>Updated At</h4>
                  <p>{new Date(selectedESIM.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {!editingESIM ? (
                <button 
                  className="btn-primary" 
                  onClick={() => setEditingESIM(true)}
                >
                  <i className="fas fa-edit"></i> Edit Status
                </button>
              ) : (
                <>
                  <button 
                    className="btn-success" 
                    onClick={() => handleESIMStatus(selectedESIM._id, 'activated', selectedESIM.userId?.name || 'user')}
                  >
                    <i className="fas fa-check"></i> Activate
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleESIMStatus(selectedESIM._id, 'failed', selectedESIM.userId?.name || 'user')}
                  >
                    <i className="fas fa-times"></i> Reject
                  </button>
                </>
              )}
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setShowESIMModal(false);
                  setEditingESIM(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;