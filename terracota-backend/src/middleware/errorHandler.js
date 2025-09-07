const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Default error
    let error = {
        message: err.message || 'Internal Server Error',
        status: err.status || 500
    };

    // Validation errors
    if (err.name === 'ValidationError') {
        error.status = 400;
        error.message = 'Validation Error';
        error.details = err.details;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.status = 401;
        error.message = 'Invalid token';
    }

    // Supabase errors
    if (err.code && err.message) {
        error.status = 400;
        error.message = err.message;
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && error.status === 500) {
        error.message = 'Internal Server Error';
    }

    res.status(error.status).json({
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        ...(error.details && { details: error.details })
    });
};

module.exports = errorHandler;