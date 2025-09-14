import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/Createuser';
import './Navbar.css';

const Navbar = () => {
  const { User } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogoClick = () => {
    if (!User) {
      navigate('/');
    } else if (User.role === 'admin') {
      navigate('/admin/dashboard'); // Fixed: changed from '/admin-home' to '/admin/dashboard'
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={handleLogoClick}>
          <span className="logo-icon">📶</span>
          <span className="logo-text">eSIMPro</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          {User ? (
            <>
              {/* Dashboard (different path for admin / user) */}
              <button 
                onClick={() => navigate(User.role === 'admin' ? '/admin/dashboard' : '/home')}
                className={`nav-link ${
                  location.pathname === '/home' || location.pathname === '/admin/dashboard'
                    ? 'nav-link-active'
                    : ''
                }`}
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>

              {/* Admin-specific navigation items */}
              {User.role === 'admin' && (
                <>
                  <button 
                    onClick={() => navigate('/admin/users')}
                    className={`nav-link ${location.pathname === '/admin/users' ? 'nav-link-active' : ''}`}
                  >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Users
                  </button>
                  <button 
                    onClick={() => navigate('/admin/esims')}
                    className={`nav-link ${location.pathname === '/admin/esims' ? 'nav-link-active' : ''}`}
                  >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    eSIMs
                  </button>
                </>
              )}

              {/* Only normal user sees My eSIMs */}
              {User.role !== 'admin' && (
                <button 
                  onClick={() => navigate('/status')}
                  className={`nav-link ${location.pathname === '/status' ? 'nav-link-active' : ''}`}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  My eSIMs
                </button>
              )}

              <div className="nav-dropdown">
                <button 
                  className="nav-dropdown-toggle"
                  onClick={() => toggleDropdown('account')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Account</span>
                  <svg className={`dropdown-icon ${activeDropdown === 'account' ? 'dropdown-icon-open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`nav-dropdown-menu ${activeDropdown === 'account' ? 'nav-dropdown-menu-open' : ''}`}>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="nav-dropdown-item"
                  >
                    <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="nav-dropdown-item"
                  >
                    <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="nav-dropdown-item"
                  >
                    <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="nav-link"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="nav-signup"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'mobile-menu-button-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;