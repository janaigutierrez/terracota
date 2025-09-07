const crypto = require('crypto');

class Helpers {

    // Generar ID únic
    static generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(3).toString('hex');
        return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
    }

    // Formatear preu en euros
    static formatPrice(price) {
        return new Intl.NumberFormat('ca-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    // Formatear data catalana
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        };

        return new Intl.DateTimeFormat('ca-ES', defaultOptions).format(new Date(date));
    }

    // Formatear hora
    static formatTime(time) {
        if (typeof time === 'string' && time.includes(':')) {
            return time;
        }
        return new Date(time).toLocaleTimeString('ca-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Capitalitzar primera lletra
    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar telèfon espanyol
    static isValidSpanishPhone(phone) {
        const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Netejar telèfon (eliminar espais, guions, etc.)
    static cleanPhone(phone) {
        return phone.replace(/[\s\-\(\)]/g, '');
    }

    // Generar slug a partir de text
    static slugify(text) {
        return text
            .toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Calcular dies entre dates
    static daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);

        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }

    // Comprovar si una data és avui
    static isToday(date) {
        const today = new Date();
        const checkDate = new Date(date);

        return checkDate.toDateString() === today.toDateString();
    }

    // Comprovar si una data és demà
    static isTomorrow(date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const checkDate = new Date(date);

        return checkDate.toDateString() === tomorrow.toDateString();
    }

    // Obtenir dia de la setmana en català
    static getDayName(date) {
        const days = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];
        return days[new Date(date).getDay()];
    }

    // Generar codi de reserva
    static generateBookingCode() {
        return this.generateId('TER');
    }

    // Generar codi de lot de cocció
    static generateFiringBatch() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = crypto.randomBytes(2).toString('hex').toUpperCase();

        return `F${year}${month}${day}-${random}`;
    }

    // Sanititzar text (eliminar HTML, scripts, etc.)
    static sanitizeText(text) {
        if (!text) return '';

        return text
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '')
            .trim();
    }

    // Truncar text
    static truncate(text, length = 100, suffix = '...') {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + suffix;
    }

    // Calcular edat a partir de data de naixement
    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    // Obtenir range d'hores disponibles
    static getAvailableTimeSlots() {
        return [
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30'
        ];
    }

    // Comprovar si una hora està dins l'horari comercial
    static isBusinessHour(time, day) {
        const { BUSINESS_HOURS } = require('./constants');
        const dayName = day.toUpperCase();
        const businessDay = BUSINESS_HOURS[dayName];

        if (businessDay.closed) return false;

        return time >= businessDay.open && time <= businessDay.close;
    }
}

module.exports = Helpers;