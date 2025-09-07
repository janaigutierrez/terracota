// create-admin.js
require('dotenv').config();

const { supabaseAdmin } = require('./src/config/supabase');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        console.log('🔍 Debug variables d\'entorn:');
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Carregada' : '❌ No trobada');
        console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Carregada' : '❌ No trobada');
        console.log('');

        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
            console.error('❌ Variables d\'entorn mancants!');
            return;
        }

        console.log('🔑 Generant password hash...');

        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Hash generat:', hashedPassword);

        // Esborrar admin anterior si existeix
        const { error: deleteError } = await supabaseAdmin
            .from('admins')
            .delete()
            .eq('email', 'admin@terracotta.cat');

        if (deleteError && deleteError.code !== 'PGRST116') {
            console.log('⚠️ Error esborrant admin anterior:', deleteError);
        } else {
            console.log('🗑️ Admin anterior esborrat (o no existia)');
        }

        // Crear nou admin
        const { data, error } = await supabaseAdmin
            .from('admins')
            .insert([{
                email: 'admin@terracotta.cat',
                password: hashedPassword,
                name: 'Admin Terracotta'
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creant admin:', error);
            return;
        }

        console.log('✅ Admin creat correctament!');
        console.log('📧 Email: admin@terracotta.cat');
        console.log('🔑 Password: admin123');
        console.log('🆔 ID:', data.id);

    } catch (error) {
        console.error('💥 Error:', error);
    }
}

createAdmin();