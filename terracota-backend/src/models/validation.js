const validation = {
    // Validar email
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar telèfon espanyol
    phone: (phone) => {
        const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Validar data futura
    futureDate: (date) => {
        return new Date(date) > new Date();
    },

    // Validar hora vàlida
    validTime: (time) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    },

    // Validar preu positiu
    positivePrice: (price) => {
        return parseFloat(price) > 0;
    },

    // Validar que un valor està dins d'un array
    inArray: (value, allowedValues) => {
        return allowedValues.includes(value);
    }
};

module.exports = { validation };