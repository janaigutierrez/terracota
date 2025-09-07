const { supabase, supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');

class Admin {
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error findByEmail:', error);
            return null;
        }
        return data;
    }

    static async create(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabaseAdmin
            .from('admins')
            .insert([{
                email,
                password: hashedPassword,
                name,
                created_at: new Date()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Admin;