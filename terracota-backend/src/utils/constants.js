const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

const PIECE_STATUS = {
    PAINTING: 'painting',
    DRYING: 'drying',
    FIRING: 'firing',
    READY: 'ready',
    COLLECTED: 'collected'
};

const PIECE_TYPES = {
    TASSA: 'tassa',
    PLAT: 'plat',
    BOL: 'bol',
    GERRO: 'gerro',
    DECORATIVA: 'decorativa',
    GRUP: 'grup',
    ALTRE: 'altre'
};

const PAYMENT_STATUS = {
    PENDING: 'pending',
    PARTIAL: 'partial',
    PAID: 'paid',
    REFUNDED: 'refunded'
};

const PAYMENT_METHODS = {
    CASH: 'cash',
    CARD: 'card',
    ONLINE: 'online',
    BANK_TRANSFER: 'bank_transfer'
};

const CLIENT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned'
};

const CONTACT_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    REPLIED: 'replied',
    ARCHIVED: 'archived'
};

const CONTACT_PRIORITY = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
};

const INVENTORY_TYPES = {
    BISQUE_PIECE: 'bisque_piece',
    PAINT: 'paint',
    TOOL: 'tool',
    CONSUMABLE: 'consumable'
};

const BUSINESS_HOURS = {
    MONDAY: { open: null, close: null, closed: true },
    TUESDAY: { open: '10:00', close: '20:00', closed: false },
    WEDNESDAY: { open: '10:00', close: '20:00', closed: false },
    THURSDAY: { open: '10:00', close: '20:00', closed: false },
    FRIDAY: { open: '10:00', close: '21:00', closed: false },
    SATURDAY: { open: '09:00', close: '21:00', closed: false },
    SUNDAY: { open: '10:00', close: '19:00', closed: false }
};

const PRICING = {
    TASSA: 8,
    PLAT: 12,
    DECORATIVA: 18,
    GRUP: 80
};

const FIRING_TEMPERATURE = {
    BISQUE: 1000,
    GLAZE: 1280
};

module.exports = {
    BOOKING_STATUS,
    PIECE_STATUS,
    PIECE_TYPES,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    CLIENT_STATUS,
    CONTACT_STATUS,
    CONTACT_PRIORITY,
    INVENTORY_TYPES,
    BUSINESS_HOURS,
    PRICING,
    FIRING_TEMPERATURE
};
