import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcrypt';

async function resetAdminUser() {
    try {
        const password = 'AdminSecurePassword123!';
        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.adminUser.update({
            where: { email: 'admin@securecare.local' },
            data: { password: hashedPassword }
        });

        // Also update regular user if admin is in there
        const user = await prisma.user.findUnique({ where: { email: 'admin@securecare.local' } });
        if (user) {
            await prisma.user.update({
                where: { email: 'admin@securecare.local' },
                data: { password: hashedPassword }
            });
        }

        console.log('Admin credentials reset to admin@securecare.local / AdminSecurePassword123!');
    } catch (err) {
        console.error('Failed to reset AdminUser:', err);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminUser();
