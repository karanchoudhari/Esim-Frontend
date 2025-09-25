import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ qrCodeData,userName }) => {
  // console.log("QRCodeDisplay rendered with data:", qrCodeData ? qrCodeData.substring(0, 50) + "..." : "NULL");
  
  if (!qrCodeData) {
    return (
      <div style={{
        padding: '10px',
        margin: '10px 0',
        border: '2px dashed #ccc',
        borderRadius: '5px'
      }}>
        No QR code data available
      </div>
    );
  }

  // Check if it's a base64 image or text data
  const isBase64Image = qrCodeData.startsWith('data:image/');
  
  // Create personalized message
  const personalizedMessage = `Thank you ${userName}! Your eSIM has been activated successfully. Scan to install and enjoy seamless connectivity.`;


  return (
    <div style={{
      padding: '15px',
      margin: '15px 0',
      border: '2px solid #4ecdc4',
      borderRadius: '8px',
      backgroundColor: '#f7f7f7',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Your eSIM is Ready!</h4>
      
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #4caf50'
      }}>
        <p style={{ margin: 0, color: '#2e7d32', fontWeight: '500' }}>
          {personalizedMessage}
        </p>
      </div>
      
      {isBase64Image ? (
        // Display as image if it's base64
        <img
          src={qrCodeData} 
          alt="eSIM QR Code"
          style={{ 
            width: '200px', 
            height: '200px',
            border: '2px solid #4ecdc4',
            borderRadius: '5px',
            display: 'block',
            margin: '0 auto',
            backgroundColor: 'white'
          }}
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.style.display = 'none';
          }}
          // onLoad={() => console.log("QR Code image loaded successfully")}
        />
      ) : (
        // Generate QR code from text if it's not an image
        <div>
          <QRCodeSVG 
            value={qrCodeData}
            size={200}
            level="H"
            includeMargin={true}
            style={{
              border: '2px solid #4ecdc4',
              borderRadius: '5px',
              backgroundColor: 'white'
            }}
          />
        </div>
      )}
      
      <p style={{
        margin: '15px 0 0 0',
        color: '#666',
        fontSize: '14px'
      }}>
        Scan this QR code with your device's camera to install the eSIM profile.
      </p>
    </div>
  );
};

export default QRCodeDisplay;