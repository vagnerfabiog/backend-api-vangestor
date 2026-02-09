import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    private capitalizeName(name: string | undefined): string | undefined {
        if (!name || !name.trim()) return name;
        return name
            .trim()
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    async create(tenantId: string, data: CreateStudentDto) {
        return this.prisma.student.create({
            data: {
                // Step 1: Basic Info
                name: this.capitalizeName(data.name) || data.name,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                grade: data.grade,
                school: data.school,
                shift: data.shift,
                photoUri: data.photoUri,
                entryTime: data.entryTime,
                exitTime: data.exitTime,
                vanPickupTime: data.vanPickupTime,

                // Home address
                address: data.address,
                neighborhood: data.neighborhood,
                city: data.city,
                zipCode: data.zipCode,

                // Step 3: Logistics
                weekDays: data.weekDays || [],
                pickupAddress: data.pickupAddress ? data.pickupAddress as any : undefined,
                dropoffAddress: data.dropoffAddress ? data.dropoffAddress as any : undefined,
                canGoAlone: data.canGoAlone ?? false,
                authorizedPerson: data.authorizedPerson ? {
                    ...data.authorizedPerson,
                    name: this.capitalizeName(data.authorizedPerson.name) || data.authorizedPerson.name
                } as any : undefined,

                // Step 4: Financial
                monthlyFee: data.monthlyValue,
                paymentDay: data.paymentDay,
                paymentMethod: data.paymentMethod,
                contractStart: data.billingStartDate ? new Date(data.billingStartDate) : null,
                financialNotes: data.financialObservations,
                active: data.active ?? true,

                // Step 5: Health
                medicalRestrictions: data.medicalRestrictions || [],
                healthPlan: data.healthPlan,
                emergencyContact: data.emergencyContact ? {
                    ...data.emergencyContact,
                    name: this.capitalizeName(data.emergencyContact.name) || data.emergencyContact.name
                } as any : undefined,
                generalNotes: data.observations,
                contractUri: data.contractUri,

                // Multi-tenant
                tenantId,

                // Legacy/optional fields
                route: data.route,
                driverId: data.driverId,
                vehicleId: data.vehicleId,

                // Step 2: Responsibles (N:N relationship)
                responsibles: {
                    create: data.responsibles.map((r) => ({
                        relation: r.relation,
                        isPrimary: r.isPrimary ?? false,
                        responsible: {
                            create: {
                                name: this.capitalizeName(r.name) || r.name,
                                phone: r.phone,
                                email: r.email,
                                tenantId, // Responsible also needs tenantId
                            },
                        },
                    })),
                },
            },
            include: {
                responsibles: {
                    include: {
                        responsible: true,
                    },
                },
            },
        });
    }

    async findAll(tenantId: string, filters: any) {
        return this.prisma.student.findMany({
            where: {
                tenantId, // CRITICAL: Filter by tenant
                AND: [
                    filters.search ? {
                        OR: [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { school: { contains: filters.search, mode: 'insensitive' } },
                            { responsibles: { some: { responsible: { name: { contains: filters.search, mode: 'insensitive' } } } } },
                        ],
                    } : {},
                    filters.school ? { school: { equals: filters.school } } : {},
                    filters.route ? (
                        filters.route === 'Com Rota'
                            ? { route: { not: null } }
                            : filters.route === 'Sem Rota'
                                ? { route: null }
                                : { route: { equals: filters.route } }
                    ) : {},
                    filters.status ? { active: filters.status === 'ativo' } : {},
                ],
            },
            include: {
                responsibles: {
                    include: {
                        responsible: true,
                    },
                    orderBy: {
                        isPrimary: 'desc', // Primary contacts first
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }


    async findOne(tenantId: string, id: string) {
        const student = await this.prisma.student.findFirst({
            where: {
                id,
                tenantId, // CRITICAL: Filter by tenant
            },
            include: {
                responsibles: {
                    include: {
                        responsible: true,
                    },
                    orderBy: {
                        isPrimary: 'desc',
                    },
                },
            },
        });

        if (!student) throw new NotFoundException('Student not found');
        return student;
    }

    async update(tenantId: string, id: string, data: UpdateStudentDto) {
        await this.findOne(tenantId, id); // valida existência e tenant

        // Prepare update data
        const updateData: any = {
            // Step 1: Basic Info
            name: this.capitalizeName(data.name) || data.name,
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            grade: data.grade,
            school: data.school,
            shift: data.shift,
            photoUri: data.photoUri,
            entryTime: data.entryTime,
            exitTime: data.exitTime,
            vanPickupTime: data.vanPickupTime,

            // Home address
            address: data.address,
            neighborhood: data.neighborhood,
            city: data.city,
            zipCode: data.zipCode,

            // Step 3: Logistics
            weekDays: data.weekDays,
            pickupAddress: data.pickupAddress,
            dropoffAddress: data.dropoffAddress,
            canGoAlone: data.canGoAlone,
            authorizedPerson: data.authorizedPerson ? {
                ...data.authorizedPerson,
                name: this.capitalizeName(data.authorizedPerson.name) || data.authorizedPerson.name
            } : data.authorizedPerson,

            // Step 4: Financial
            monthlyFee: data.monthlyValue,
            paymentDay: data.paymentDay,
            paymentMethod: data.paymentMethod,
            contractStart: data.billingStartDate ? new Date(data.billingStartDate) : undefined,
            financialNotes: data.financialObservations,
            active: data.active,

            // Step 5: Health
            medicalRestrictions: data.medicalRestrictions,
            healthPlan: data.healthPlan,
            emergencyContact: data.emergencyContact ? {
                ...data.emergencyContact,
                name: this.capitalizeName(data.emergencyContact.name) || data.emergencyContact.name
            } : data.emergencyContact,
            generalNotes: data.observations,
            contractUri: data.contractUri,

            // Legacy/optional
            route: data.route,
            driverId: data.driverId,
            vehicleId: data.vehicleId,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Handle responsibles separately if provided
        if (data.responsibles) {
            updateData.responsibles = {
                deleteMany: {}, // Remove old relationships
                create: data.responsibles.map((r) => ({
                    relation: r.relation,
                    isPrimary: r.isPrimary ?? false,
                    responsible: {
                        create: {
                            name: r.name,
                            phone: r.phone,
                            email: r.email,
                            tenantId, // Responsible also needs tenantId
                        },
                    },
                })),
            };
        }

        return this.prisma.student.update({
            where: { id },
            data: updateData,
            include: {
                responsibles: {
                    include: {
                        responsible: true,
                    },
                },
            },
        });
    }

    async getStats(tenantId: string) {
        const total = await this.prisma.student.count({ where: { tenantId } });
        const ativos = await this.prisma.student.count({ where: { tenantId, active: true } });
        const comRota = await this.prisma.student.count({
            where: { tenantId, route: { not: null } },
        });
        const semRota = await this.prisma.student.count({
            where: { tenantId, route: null },
        });

        return { total, ativos, comRota, semRota };
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id); // valida existência e tenant

        // Cascade delete will handle StudentResponsible junction table
        return this.prisma.student.delete({ where: { id } });
    }
}
