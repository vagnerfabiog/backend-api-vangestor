import { PrismaClient, Responsible } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de exemplo
const firstNames = [
    'Ana', 'João', 'Maria', 'Pedro', 'Lucas', 'Julia', 'Gabriel', 'Beatriz',
    'Rafael', 'Larissa', 'Felipe', 'Camila', 'Matheus', 'Isabella', 'Bruno',
    'Sophia', 'Gustavo', 'Valentina', 'Vitor', 'Manuela', 'Diego', 'Laura',
    'Henrique', 'Alice', 'Thiago', 'Helena', 'Rodrigo', 'Luiza', 'Leonardo', 'Giovanna'
];

const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
    'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
    'Rocha', 'Almeida', 'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Cardoso',
    'Correia', 'Dias', 'Fernandes', 'Freitas', 'Monteiro', 'Mendes', 'Barros'
];

const schools = [
    'Colégio Monte Azul',
    'Escola Municipal João Paulo II',
    'Colégio Adventista',
    'Escola Estadual Pedro Álvares Cabral',
    'Colégio Santa Maria',
    'Escola Municipal Dom Bosco',
    'Colégio Objetivo',
    'Escola Estadual Paulo Freire'
];

const routes = [
    'Rota 1 - Manhã',
    'Rota 2 - Manhã',
    'Rota 1 - Tarde',
    'Rota 2 - Tarde',
    'Rota 3 - Manhã',
    null // Alguns sem rota
];

const shifts = ['Manhã', 'Tarde', 'Noite'];

const grades = [
    '1º Ano A', '1º Ano B', '2º Ano A', '2º Ano B', '3º Ano A', '3º Ano B',
    '4º Ano A', '4º Ano B', '5º Ano A', '5º Ano B', '6º Ano', '7º Ano',
    '8º Ano', '9º Ano'
];

const neighborhoods = [
    'Jardim das Flores', 'Vila Nova', 'Centro', 'Jardim Paulista',
    'Vila Industrial', 'Parque das Árvores', 'Jardim América', 'Vila São João',
    'Jardim Europa', 'Parque Residencial', 'Vila Santa Rita', 'Jardim Bela Vista'
];

const relations = ['Mãe', 'Pai', 'Avó', 'Avô', 'Tia', 'Tio'];

function randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomName(): string {
    return `${randomItem(firstNames)} ${randomItem(lastNames)} ${randomItem(lastNames)}`;
}

function randomPhone(): string {
    const ddd = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];
    const prefix = Math.random() > 0.5 ? '9' : ''; // Mobile or landline
    const number = Math.floor(10000000 + Math.random() * 90000000);
    return `+55${randomItem(ddd)}${prefix}${number}`;
}

function randomEmail(name: string): string {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    return `${cleanName}@${randomItem(domains)}`;
}

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAge(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('🌱 Starting seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.studentResponsible.deleteMany();
    await prisma.student.deleteMany();
    await prisma.responsible.deleteMany();
    await prisma.route.deleteMany();
    await prisma.driverVehicle.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.driver.deleteMany();
    console.log('✅ Data cleared\n');

    // Create responsibles (parents)
    console.log('👨‍👩‍👧‍👦 Creating responsibles...');

    // Get or create default tenant
    const defaultTenant = await prisma.tenant.upsert({
        where: { slug: 'default' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Default Company',
            slug: 'default',
        },
    });

    // Create drivers first
    console.log('🚗 Creating drivers...');
    const user1 = await prisma.user.upsert({
        where: { email: 'joao.silva@example.com' },
        update: {
            name: 'João Silva',
            phone: '+5511999991111',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
        create: {
            name: 'João Silva',
            phone: '+5511999991111',
            email: 'joao.silva@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
    });
    const driver1 = await prisma.driver.create({
        data: {
            userId: user1.id,
            cnh: '98765432101',
            cnhCategory: 'D',
            cnhExpiration: new Date(2026, 11, 31),
            active: true,
            tenantId: defaultTenant.id,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'aline.mendes@example.com' },
        update: {
            name: 'Aline Mendes',
            phone: '+5511977774444',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
        create: {
            name: 'Aline Mendes',
            phone: '+5511977774444',
            email: 'aline.mendes@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
    });
    const driver2 = await prisma.driver.create({
        data: {
            userId: user2.id,
            cnh: '97777-4444',
            cnhCategory: 'D',
            cnhExpiration: new Date(2026, 1, 20),
            active: true,
            tenantId: defaultTenant.id,
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: 'ricardo.costa@example.com' },
        update: {
            name: 'Ricardo Costa',
            phone: '+5511988887777',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
        create: {
            name: 'Ricardo Costa',
            phone: '+5511988887777',
            email: 'ricardo.costa@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
            role: 'DRIVER',
            tenantId: defaultTenant.id,
        },
    });
    const driver3 = await prisma.driver.create({
        data: {
            userId: user3.id,
            cnh: '12345678901',
            cnhCategory: 'D',
            cnhExpiration: new Date(2027, 5, 15),
            active: false,
            tenantId: defaultTenant.id,
        },
    });
    console.log(`  ✓ ${user1.name} - CNH: ${driver1.cnh}`);
    console.log(`  ✓ ${user2.name} - CNH: ${driver2.cnh}`);
    console.log(`  ✓ ${user3.name} - CNH: ${driver3.cnh} (Inativo)`);
    console.log('✅ Created 3 drivers\n');

    // Create vehicles
    console.log('🚐 Creating vehicles...');
    const vehicle1 = await prisma.vehicle.create({
        data: {
            plate: 'ABC-1234',
            model: 'Van 001',
            capacity: 15,
            color: 'Branca',
            tenantId: defaultTenant.id,
            ownerId: user1.id, // João Silva owns this vehicle (using User.id)
        },
    });

    const vehicle2 = await prisma.vehicle.create({
        data: {
            plate: 'KKK-5555',
            model: 'Van 002',
            capacity: 12,
            color: 'Prata',
            tenantId: defaultTenant.id,
            ownerId: user2.id, // Aline Mendes owns this vehicle (using User.id)
        },
    });

    const vehicle3 = await prisma.vehicle.create({
        data: {
            plate: 'XYZ-9876',
            model: 'Van 005',
            capacity: 10,
            color: 'Azul',
            tenantId: defaultTenant.id,
            ownerId: user3.id, // Ricardo Costa owns this vehicle (using User.id)
        },
    });
    console.log('✅ Created 3 vehicles\n');

    // Link drivers to vehicles
    console.log('🔗 Linking drivers to vehicles...');
    await prisma.driverVehicle.create({
        data: {
            driverId: driver1.id,
            vehicleId: vehicle1.id,
        },
    });
    await prisma.driverVehicle.create({
        data: {
            driverId: driver2.id,
            vehicleId: vehicle2.id,
        },
    });
    await prisma.driverVehicle.create({
        data: {
            driverId: driver3.id,
            vehicleId: vehicle3.id,
        },
    });
    console.log('✅ Linked drivers to vehicles\n');

    // Create routes for drivers
    console.log('🗺️  Creating routes...');
    await prisma.route.create({
        data: {
            name: 'Rota 1 - Manhã',
            period: 'Manhã',
            startTime: '07:00',
            status: 'IN_PROGRESS',
            driverId: driver1.id,
            vehicleId: vehicle1.id,
            tenantId: defaultTenant.id,
        },
    });
    await prisma.route.create({
        data: {
            name: 'Rota 2 - Manhã',
            period: 'Manhã',
            startTime: '07:30',
            status: 'IN_PROGRESS',
            driverId: driver1.id,
            vehicleId: vehicle1.id,
            tenantId: defaultTenant.id,
        },
    });
    await prisma.route.create({
        data: {
            name: 'Rota 1 - Tarde',
            period: 'Tarde',
            startTime: '13:00',
            status: 'IN_PROGRESS',
            driverId: driver2.id,
            vehicleId: vehicle2.id,
            tenantId: defaultTenant.id,
        },
    });
    console.log('✅ Created 3 routes\n');

    const responsibles: Responsible[] = [];
    for (let i = 0; i < 20; i++) {
        const name = randomName();
        const responsible = await prisma.responsible.create({
            data: {
                name,
                phone: randomPhone(),
                email: randomEmail(name),
                invited: Math.random() > 0.7,
                accepted: Math.random() > 0.8,
                tenantId: defaultTenant.id, // Multi-tenant
            },
        });
        responsibles.push(responsible);
        console.log(`  ✓ ${responsible.name}`);
    }
    console.log(`✅ Created ${responsibles.length} responsibles\n`);

    // Create students
    console.log('👶 Creating students...');
    const students = [];
    for (let i = 0; i < 30; i++) {
        const birthYear = new Date().getFullYear() - randomAge(6, 15);
        const birthDate = randomDate(
            new Date(birthYear, 0, 1),
            new Date(birthYear, 11, 31)
        );
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const shift = randomItem(shifts);
        const school = randomItem(schools);
        const route = randomItem(routes);

        const student = await prisma.student.create({
            data: {
                name: randomName(),
                birthDate,
                grade: randomItem(grades),
                school,
                address: `Rua ${randomItem(lastNames)}, ${Math.floor(Math.random() * 1000) + 1}`,
                neighborhood: randomItem(neighborhoods),
                city: 'Indaiatuba',
                zipCode: `133${Math.floor(Math.random() * 90) + 10}-000`,
                route,
                shift,
                monthlyFee: [350, 400, 450, 500, 550][Math.floor(Math.random() * 5)],
                paymentDay: [5, 10, 15, 20][Math.floor(Math.random() * 4)],
                paymentMethod: randomItem(['PIX', 'Dinheiro', 'Cartão', 'Transferência']),
                contractStart: new Date(2025, 0, 1),
                contractEnd: new Date(2025, 11, 31),
                active: Math.random() > 0.1, // 90% active
                generalNotes: Math.random() > 0.7 ? 'Aluno pontual e educado.' : null,
                tenantId: defaultTenant.id,
            },
        });
        students.push(student);
        console.log(`  ✓ ${student.name} - ${age} anos - ${school}`);
    }
    console.log(`✅ Created ${students.length} students\\n`);

    // Create student-responsible relationships
    console.log('🔗 Creating relationships...');
    let relationshipCount = 0;

    for (const student of students) {
        // Each student has 1-3 responsibles
        const numResponsibles = Math.floor(Math.random() * 3) + 1;
        const studentResponsibles: string[] = [];

        // Select random responsibles for this student
        const selectedResponsibles: Responsible[] = [];
        while (selectedResponsibles.length < numResponsibles) {
            const responsible = randomItem(responsibles);
            if (!selectedResponsibles.includes(responsible)) {
                selectedResponsibles.push(responsible);
            }
        }

        // Create relationships
        for (let i = 0; i < selectedResponsibles.length; i++) {
            const responsible = selectedResponsibles[i];
            const isPrimary = i === 0; // First one is primary

            await prisma.studentResponsible.create({
                data: {
                    studentId: student.id,
                    responsibleId: responsible.id,
                    relation: randomItem(relations),
                    isPrimary,
                },
            });

            studentResponsibles.push(responsible.name);
            relationshipCount++;
        }

        console.log(`  ✓ ${student.name} → ${studentResponsibles.join(', ')}`);
    }

    console.log(`✅ Created ${relationshipCount} relationships\n`);

    // Summary
    console.log('📊 Summary:');
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({ where: { active: true } });
    const totalResponsibles = await prisma.responsible.count();
    const totalRelationships = await prisma.studentResponsible.count();

    console.log(`  Students: ${totalStudents} (${activeStudents} active)`);
    console.log(`  Responsibles: ${totalResponsibles}`);
    console.log(`  Relationships: ${totalRelationships}`);
    console.log(`  Avg responsibles per student: ${(totalRelationships / totalStudents).toFixed(1)}`);

    console.log('\n✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
