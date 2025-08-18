// Configuration file for environment variables
export const config = {
  // WebSocket server URL
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000',
  
  // API base URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
