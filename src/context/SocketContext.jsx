import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { User } = useSelector((state) => state.Auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && User) {
      const newSocket = io('http://localhost:4000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [User]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useSelector } from 'react-redux';

// const SocketContext = createContext();

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { User } = useSelector((state) => state.Auth);

//   useEffect(() => {
//     // Check if we have a token (for both users and admins)
//     const token = localStorage.getItem('token');
//     const isAdminRoute = window.location.pathname.startsWith('/admin');
    
//     console.log("🔄 SocketProvider - Token exists:", !!token, "Admin route:", isAdminRoute, "User from Redux:", User);
    
//     if (token) {
//       console.log("🔌 Creating socket connection...");
      
//       const newSocket = io('http://localhost:4000', {
//         auth: {
//           token: token
//         },
//         transports: ['websocket', 'polling'],
//         // Add reconnection options
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       newSocket.on('connect', () => {
//         console.log('✅ Socket connected successfully:', newSocket.id, 'for user:', User?.name || 'Admin');
//       });

//       newSocket.on('connect_error', (error) => {
//         console.error('❌ Socket connection error:', error.message);
//       });

//       newSocket.on('disconnect', (reason) => {
//         console.log('🔴 Socket disconnected:', reason);
//       });

//       // Add authentication confirmation event
//       newSocket.on('authenticated', () => {
//         console.log('🔐 Socket authenticated successfully');
//       });

//       newSocket.on('unauthorized', (error) => {
//         console.error('🔐 Socket authentication failed:', error);
//       });

//       setSocket(newSocket);

//       return () => {
//         console.log("🧹 Cleaning up socket connection");
//         newSocket.close();
//       };
//     } else {
//       console.log("❌ No token found - cannot create socket");
//       if (socket) {
//         socket.close();
//         setSocket(null);
//       }
//     }
//   }, [User]); // Re-run when User changes

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };