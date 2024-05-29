require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/grocery-mart-api',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@grocery-mart.com',
    password: process.env.ADMIN_PASSWORD || 'admin@12345',
    fullname: process.env.ADMIN_NAME || 'Admin Grocery Mart',
  },
  jwt: {
    secretAccess: process.env.JWT_SECRET_ACCESS || 'secret-access',
    expiresAccessToken: process.env.JWT_EXPIRES_ACCESS_MINUTES + 'm' || '100m',
    secretRefresh: process.env.JWT_SECRET_REFRESH || 'secret-refresh',
    expiresRefreshToken: process.env.JWT_EXPIRES_REFRESH_MINUTES + 'm' || '1000m',
  },
};
 
module.exports = env;
