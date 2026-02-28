import prisma from '../src/utils/prisma.js';

async function main() {
    console.log('Seeding initial anomaly logs...');

    const initialAnomalies = [
        {
            sensor: 'Auth Gateway',
            type: 'Credential Stuffing',
            riskScore: 94,
            status: 'BLOCKED',
            description: 'High-volume login attempts detected from a botnet targeting administrative accounts.'
        },
        {
            sensor: 'Data Lake API',
            type: 'Data Exfiltration',
            riskScore: 88,
            status: 'QUARANTINED',
            description: 'Unusual outbound data transfer volume detected from Doctor ID 5c19a6dd-f4f2.'
        },
        {
            sensor: 'WAF',
            type: 'Zero-Day Exploit Signature',
            riskScore: 99,
            status: 'BLOCKED',
            description: 'Identified payload matching newly discovered CVSS 9.8 vulnerability in request headers.'
        },
        {
            sensor: 'Network Monitor',
            type: 'Lateral Movement',
            riskScore: 72,
            status: 'MONITORING',
            description: 'Internal service attempting unusual RPC connections to legacy database instances.'
        },
        {
            sensor: 'Identity Provider',
            type: 'Impossible Travel',
            riskScore: 65,
            status: 'CHALLENGED',
            description: 'User patient@securecare.local logged in from New York and Tokyo within 2 hours.'
        }
    ];

    for (const anomaly of initialAnomalies) {
        await prisma.anomalyLog.create({
            data: anomaly
        });
    }

    console.log('Successfully seeded 5 anomaly logs.');
}

main()
    .catch((e) => {
        console.error('Error seeding anomaly logs:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
