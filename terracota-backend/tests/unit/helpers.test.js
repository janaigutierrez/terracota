const Helpers = require('../../src/utils/helpers');

describe('Helpers Utils', () => {

    describe('formatPrice', () => {
        test('should format price correctly in euros', () => {
            expect(Helpers.formatPrice(12.50)).toBe('12,50 €');
            expect(Helpers.formatPrice(0)).toBe('0,00 €');
            expect(Helpers.formatPrice(1000)).toBe('1.000,00 €');
        });
    });

    describe('isValidEmail', () => {
        test('should validate correct emails', () => {
            expect(Helpers.isValidEmail('test@example.com')).toBe(true);
            expect(Helpers.isValidEmail('user.name@domain.co.uk')).toBe(true);
        });

        test('should reject invalid emails', () => {
            expect(Helpers.isValidEmail('invalid-email')).toBe(false);
            expect(Helpers.isValidEmail('test@')).toBe(false);
            expect(Helpers.isValidEmail('@domain.com')).toBe(false);
        });
    });

    describe('isValidSpanishPhone', () => {
        test('should validate Spanish phone numbers', () => {
            expect(Helpers.isValidSpanishPhone('666123456')).toBe(true);
            expect(Helpers.isValidSpanishPhone('+34666123456')).toBe(true);
            expect(Helpers.isValidSpanishPhone('34 666 123 456')).toBe(true);
        });

        test('should reject invalid phone numbers', () => {
            expect(Helpers.isValidSpanishPhone('123456789')).toBe(false);
            expect(Helpers.isValidSpanishPhone('555123456')).toBe(false);
        });
    });

    describe('slugify', () => {
        test('should create valid slugs', () => {
            expect(Helpers.slugify('Hola Món')).toBe('hola-mon');
            expect(Helpers.slugify('Açai amb Ñ')).toBe('acai-amb-n');
            expect(Helpers.slugify('Test---Multiple---Dashes')).toBe('test-multiple-dashes');
        });
    });

    describe('generateBookingCode', () => {
        test('should generate unique booking codes', () => {
            const code1 = Helpers.generateBookingCode();
            const code2 = Helpers.generateBookingCode();

            expect(code1).toMatch(/^TER-/);
            expect(code2).toMatch(/^TER-/);
            expect(code1).not.toBe(code2);
        });
    });

    describe('daysBetween', () => {
        test('should calculate days between dates correctly', () => {
            const date1 = new Date('2025-01-01');
            const date2 = new Date('2025-01-10');

            expect(Helpers.daysBetween(date1, date2)).toBe(9);
        });
    });

    describe('calculateAge', () => {
        test('should calculate age correctly', () => {
            const birthDate = new Date('1990-01-01');
            const age = Helpers.calculateAge(birthDate);

            expect(age).toBeGreaterThan(30);
            expect(age).toBeLessThan(40);
        });
    });
});