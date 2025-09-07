require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Terracotta Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    process.exit(0);
});