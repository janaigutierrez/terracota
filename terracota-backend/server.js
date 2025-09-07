require('dotenv').config();
const app = require('./src/app'); // ⬅️ CANVI AQUÍ

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Terracotta Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    process.exit(0);
});