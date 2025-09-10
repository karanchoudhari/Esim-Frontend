import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      title: "Instant Activation",
      description: "Get your eSIM activated within minutes, not days. No waiting for shipping or visiting stores.",
      icon: "⚡",
      color: "feature-icon-yellow"
    },
    {
      title: "Global Coverage",
      description: "Connect in 190+ countries with our partner networks. Stay connected wherever you travel.",
      icon: "🌎",
      color: "feature-icon-blue"
    },
    {
      title: "No Physical SIM",
      description: "Download your digital SIM and stay connected instantly. Switch plans with a tap.",
      icon: "📲",
      color: "feature-icon-green"
    },
    {
      title: "Secure & Reliable",
      description: "Military-grade encryption and 99.9% uptime guarantee for all your connections.",
      icon: "🔒",
      color: "feature-icon-purple"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="welcome-container">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Navigation */}
      {/* <nav className="welcome-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo" onClick={() => navigate('/')}>
              <span className="logo-icon">📶</span>
              <span className="logo-text">eSIMPro</span>
            </div>
            <div className="nav-links">
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
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Digital SIM for a <span className="text-accent">Connected World</span>
              </h1>
              <p className="hero-subtitle">
                Get your eSIM instantly, avoid shipping delays, and stay connected in over 190 countries with our secure digital SIM cards.
              </p>
              
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('/signup')}
                  className="btn btn-primary"
                >
                  <span>Get Started Now</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 12H4.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  onClick={() => document.getElementById('comparison').scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-secondary"
                >
                  <span>See Comparison</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 9L12 2L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
                <div className="stat">
                  <div className="stat-number">190+</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="screen-content">
                    <div className="signal-bars">
                      <div className="bar bar-1"></div>
                      <div className="bar bar-2"></div>
                      <div className="bar bar-3"></div>
                      <div className="bar bar-4"></div>
                    </div>
                    <div className="network-name">eSIMPro Network</div>
                    <div className="data-usage">
                      <div className="usage-progress">
                        <div className="progress-fill"></div>
                      </div>
                      <div className="usage-text">Data: 12.5GB/20GB</div>
                    </div>
                    <div className="connection-status">
                      <div className="status-dot"></div>
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => document.getElementById('comparison').scrollIntoView({ behavior: 'smooth' })}
          className="scroll-button"
        >
          <svg className="scroll-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Get your eSIM in three simple steps</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-visual">
                <div className="step-icon">👤</div>
                <div className="step-number">1</div>
              </div>
              <h3 className="step-title">Sign Up</h3>
              <p className="step-description">Create your account in less than a minute with just your email</p>
            </div>
            
            <div className="process-connector"></div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-icon">📋</div>
                <div className="step-number">2</div>
              </div>
              <h3 className="step-title">Complete KYC</h3>
              <p className="step-description">Verify your identity quickly and securely with our automated system</p>
            </div>
            
            <div className="process-connector"></div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-icon">📲</div>
                <div className="step-number">3</div>
              </div>
              <h3 className="step-title">Get eSIM</h3>
              <p className="step-description">Receive and activate your digital SIM instantly on any compatible device</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why choose our eSIM?</h2>
            <p className="section-subtitle">Experience the future of mobile connectivity with our secure digital SIM solution</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${index === currentFeature ? 'active' : ''}`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="feature-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`indicator ${index === currentFeature ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="comparison-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Compare with traditional SIMs</h2>
            <p className="section-subtitle">See why our eSIM is the better choice for modern connectivity needs</p>
          </div>
          
          <div className="comparison-cards">
            <div className="comparison-card">
              <div className="card-header">
                <h3 className="card-title">Traditional SIM</h3>
              </div>
              <ul className="card-list">
                <li className="list-item">
                  <div className="item-icon negative">✗</div>
                  <p className="item-text">Physical delivery required (1-5 days)</p>
                </li>
                <li className="list-item">
                  <div className="item-icon negative">✗</div>
                  <p className="item-text">Limited to one network at a time</p>
                </li>
                <li className="list-item">
                  <div className="item-icon negative">✗</div>
                  <p className="item-text">Physical swapping needed to change carriers</p>
                </li>
                <li className="list-item">
                  <div className="item-icon negative">✗</div>
                  <p className="item-text">Easily lost or damaged</p>
                </li>
                <li className="list-item">
                  <div className="item-icon negative">✗</div>
                  <p className="item-text">Not eco-friendly (plastic waste)</p>
                </li>
              </ul>
              <div className="card-footer">
                <button className="btn btn-outline">Learn More</button>
              </div>
            </div>
            
            <div className="comparison-card recommended">
              <div className="recommended-badge">Recommended</div>
              <div className="card-header">
                <h3 className="card-title accent">eSIMPro Digital SIM</h3>
              </div>
              <ul className="card-list">
                <li className="list-item">
                  <div className="item-icon positive">✓</div>
                  <p className="item-text">Instant delivery (within minutes)</p>
                </li>
                <li className="list-item">
                  <div className="item-icon positive">✓</div>
                  <p className="item-text">Multiple profiles on one device</p>
                </li>
                <li className="list-item">
                  <div className="item-icon positive">✓</div>
                  <p className="item-text">Switch carriers with a few taps</p>
                </li>
                <li className="list-item">
                  <div className="item-icon positive">✓</div>
                  <p className="item-text">Cannot be lost or physically damaged</p>
                </li>
                <li className="list-item">
                  <div className="item-icon positive">✓</div>
                  <p className="item-text">Eco-friendly (no plastic waste)</p>
                </li>
              </ul>
              <div className="card-footer">
                <button 
                  onClick={() => navigate('/signup')}
                  className="btn btn-outline"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trusted by users worldwide</h2>
            <p className="section-subtitle">Join thousands of satisfied customers who have made the switch</p>
          </div>
          
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <div className="rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"The process was incredibly smooth. I got my eSIM within minutes of signing up and was connected right away during my trip to Europe."</p>
              <p className="testimonial-author">Sarah Johnson</p>
              <p className="testimonial-role">Frequent Traveler</p>
            </div>
            
            <div className="testimonial-card">
              <div className="rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"No more hunting for local SIM cards when I travel. eSIMPro has made international travel so much easier with their instant connectivity."</p>
              <p className="testimonial-author">Michael Chen</p>
              <p className="testimonial-role">Business Executive</p>
            </div>
            
            <div className="testimonial-card">
              <div className="rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"The KYC process was quick and the approval was faster than I expected. Love having my work and personal numbers on one device now!"</p>
              <p className="testimonial-author">Jessica Williams</p>
              <p className="testimonial-role">Digital Nomad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section mt-5">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to experience the future of connectivity?</h2>
            <p className="cta-subtitle">Join thousands of users who have made the switch to eSIMPro</p>
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-large"
            >
              Get Your eSIM Now
            </button>
          </div>
        </div>
      </section>

   {/* Footer */}
<footer className="footer">
  <div className="footer-container">
    <div className="footer-content">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="logo-icon">📶</span>
          <span className="logo-text">eSIMPro</span>
        </div>
        <p className="footer-description">
          The world's leading digital SIM provider, connecting you to what matters most.
        </p>
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div className="footer-links-grid">
        <div className="link-group">
          <h4 className="link-title">Company</h4>
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Careers</a>
          <a href="#" className="footer-link">Press</a>
          <a href="#" className="footer-link">Blog</a>
        </div>
        
        <div className="link-group">
          <h4 className="link-title">Support</h4>
          <a href="#" className="footer-link">Help Center</a>
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Coverage Map</a>
          <a href="#" className="footer-link">Contact Us</a>
        </div>
        
        <div className="link-group">
          <h4 className="link-title">Legal</h4>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Cookie Policy</a>
          <a href="#" className="footer-link">GDPR</a>
        </div>

        <div className="link-group">
          <h4 className="link-title">Admin</h4>
          <button 
            onClick={() => navigate('/admin/login')}
            className="footer-link admin-btn"
          >
            Admin Login
          </button>
          <a href="#" className="footer-link">Partner Portal</a>
          <a href="#" className="footer-link">Developer API</a>
          <a href="#" className="footer-link">Status</a>
        </div>
      </div>
    </div>
    
    <div className="footer-bottom">
      <div className="footer-bottom-content">
        <p className="copyright">© 2023 eSIMPro. All rights reserved.</p>
        <div className="footer-badges">
          <div className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z"/>
            </svg>
            <span>Trusted Partner</span>
          </div>
          <div className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z"/>
            </svg>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    .footer {
      background: linear-gradient(135deg, var(--dark) 0%, #1a1a2e 100%);
      color: var(--white);
      padding: 60px 0 20px;
      margin-top: auto;
      position: relative;
      overflow: hidden;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary), transparent);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 1;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    @media (min-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr 2fr;
      }
    }

    .footer-brand {
      max-width: 300px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .logo-icon {
      margin-right: 0.5rem;
      font-size: 2rem;
    }

    .footer-description {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      transition: var(--transition);
    }

    .social-link:hover {
      background: var(--primary);
      color: var(--white);
      transform: translateY(-2px);
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @media (min-width: 992px) {
      .footer-links-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .link-group {
      display: flex;
      flex-direction: column;
    }

    .link-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1.2rem;
      color: var(--white);
      position: relative;
      padding-bottom: 0.5rem;
    }

    .link-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--primary);
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      margin-bottom: 0.8rem;
      transition: var(--transition);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .footer-link:hover {
      color: var(--primary);
      transform: translateX(5px);
    }

    .admin-btn {
      color: var(--primary);
      font-weight: 500;
    }

    .admin-btn:hover {
      color: var(--accent);
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .footer-bottom-content {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .copyright {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    .footer-badges {
      display: flex;
      gap: 1rem;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
    }

    .badge svg {
      color: var(--primary);
    }
  `}</style>
</footer>
    </div>
  );
};

export default Welcome;