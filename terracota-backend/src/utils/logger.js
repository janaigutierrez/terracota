const fs = require('fs').promises;
const path = require('path');

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../../logs');
        this.ensureLogsDirectory();
    }

    // Assegurar que existeix el directori de logs
    async ensureLogsDirectory() {
        try {
            await fs.access(this.logsDir);
        } catch {
            await fs.mkdir(this.logsDir, { recursive: true });
        }
    }

    // Obtenir nom d'arxiu per avui
    getLogFileName(type = 'app') {
        const today = new Date().toISOString().split('T')[0];
        return path.join(this.logsDir, `${type}-${today}.log`);
    }

    // Escriure log
    async writeLog(level, message, extra = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...extra
        };

        const logLine = JSON.stringify(logEntry) + '\n';

        try {
            // Log general
            await fs.appendFile(this.getLogFileName('app'), logLine);

            // Log específic per nivell si és error
            if (level === 'error') {
                await fs.appendFile(this.getLogFileName('error'), logLine);
            }

            // També mostrar per consola en desenvolupament
            if (process.env.NODE_ENV === 'development') {
                console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, extra);
            }
        } catch (error) {
            console.error('Error escrivint log:', error);
        }
    }

    // Mètodes de conveniència
    info(message, extra = {}) {
        return this.writeLog('info', message, extra);
    }

    warn(message, extra = {}) {
        return this.writeLog('warn', message, extra);
    }

    error(message, extra = {}) {
        return this.writeLog('error', message, extra);
    }

    debug(message, extra = {}) {
        return this.writeLog('debug', message, extra);
    }

    // Log específic per requests
    async logRequest(req, res, responseTime) {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`
        };

        await this.writeLog('info', 'HTTP Request', logData);
    }

    // Log específic per reserves
    async logBooking(action, bookingId, extra = {}) {
        await this.writeLog('info', `Booking ${action}`, {
            bookingId,
            action,
            ...extra
        });
    }

    // Log específic per errors de base de dades
    async logDatabaseError(operation, error, extra = {}) {
        await this.writeLog('error', `Database Error: ${operation}`, {
            error: error.message,
            stack: error.stack,
            operation,
            ...extra
        });
    }

    // Netejar logs antics (mantenir últims 30 dies)
    async cleanOldLogs() {
        try {
            const files = await fs.readdir(this.logsDir);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            for (const file of files) {
                if (file.endsWith('.log')) {
                    const filePath = path.join(this.logsDir, file);
                    const stats = await fs.stat(filePath);

                    if (stats.mtime < thirtyDaysAgo) {
                        await fs.unlink(filePath);
                        console.log(`Log file deleted: ${file}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning old logs:', error);
        }
    }
}

module.exports = new Logger();