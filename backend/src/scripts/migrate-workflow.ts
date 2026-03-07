import prisma from '../utils/prisma.js';

async function main() {
    console.log('Starting workflow migration...');

    // 1. Create default departments
    const departments = [
        { name: 'Cardiology', description: 'Heart and vascular care' },
        { name: 'Neurology', description: 'Brain and nervous system' },
        { name: 'Oncology', description: 'Cancer treatment and research' },
        { name: 'Gastroenterology', description: 'Digestive system care' },
        { name: 'Endocrinology', description: 'Hormonal and metabolic health' },
        { name: 'Pediatrics', description: 'Child and adolescent healthcare' },
        { name: 'Ophthalmology', description: 'Eye and vision care' },
        { name: 'Laboratory', description: 'Diagnostic testing and analysis' },
        { name: 'Pharmacy', description: 'Medication management' },
        { name: 'General Medicine', description: 'Primary care and triage' }
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept
        });
    }

    console.log('Departments created/verified.');

    // 2. Assign existing Doctors and Lab Technicians to departments
    const doctors = await prisma.user.findMany({
        where: { role: { name: 'DOCTOR' } },
        include: { doctorProfile: true }
    });

    for (const doctor of doctors) {
        if (doctor.doctorProfile?.specialization) {
            const dept = await prisma.department.findFirst({
                where: { name: { contains: doctor.doctorProfile.specialization, mode: 'insensitive' } }
            });

            if (dept) {
                await prisma.user.update({
                    where: { id: doctor.id },
                    data: { departmentId: dept.id }
                });
                console.log(`Assigned Dr. ${doctor.email} to ${dept.name}`);
            }
        }
    }

    const technicians = await prisma.user.findMany({
        where: { role: { name: 'LAB_TECHNICIAN' } }
    });

    const labDept = await prisma.department.findUnique({ where: { name: 'Laboratory' } });
    if (labDept) {
        for (const tech of technicians) {
            await prisma.user.update({
                where: { id: tech.id },
                data: { departmentId: labDept.id }
            });
            console.log(`Assigned Tech ${tech.email} to Laboratory`);
        }
    }

    console.log('Migration complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
