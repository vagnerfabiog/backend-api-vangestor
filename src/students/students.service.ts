import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateStudentDto) {
        return this.prisma.student.create({
            data: {
                name: data.name,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                grade: data.grade,
                school: data.school,
                address: data.address,
                neighborhood: data.neighborhood,
                city: data.city,
                zipCode: data.zipCode,
                route: data.route,
                shift: data.shift,
                monthlyFee: data.monthlyFee,
                paymentDay: data.paymentDay,
                paymentMethod: data.paymentMethod,
                contractStart: data.contractStart ? new Date(data.contractStart) : null,
                contractEnd: data.contractEnd ? new Date(data.contractEnd) : null,
                financialNotes: data.financialNotes,
                generalNotes: data.generalNotes,
                active: data.active ?? true,
                driverId: data.driverId,
                vehicleId: data.vehicleId,

                responsibles: {
                    create: data.responsibles.map((r) => ({
                        name: r.name,
                        phone: r.phone,
                        email: r.email,
                        relation: r.relation,
                    })),
                },
            },
            include: { responsibles: true },
        });
    }

    async findAll(filters: any) {
        return this.prisma.student.findMany({
            where: {
                AND: [
                    filters.search ? {
                        OR: [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { school: { contains: filters.search, mode: 'insensitive' } },
                            { responsibles: { some: { name: { contains: filters.search, mode: 'insensitive' } } } },
                        ],
                    } : {},
                    filters.school ? { school: { equals: filters.school } } : {},
                    filters.route ? { route: { equals: filters.route } } : {},
                    filters.status ? { active: filters.status === 'ativo' } : {},
                ],
            },
            include: { responsibles: true },
            orderBy: { name: 'asc' },
        });
    }


    async findOne(id: string) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: { responsibles: true },
        });

        if (!student) throw new NotFoundException('Student not found');
        return student;
    }

    async update(id: string, data: UpdateStudentDto) {
        await this.findOne(id); // valida existência

        return this.prisma.student.update({
            where: { id },
            data: {
                ...data,
                responsibles: data.responsibles
                    ? {
                        deleteMany: {}, // apaga os antigos
                        create: data.responsibles.map((r) => ({
                            name: r.name,
                            phone: r.phone,
                            email: r.email,
                            relation: r.relation,
                        })),
                    }
                    : undefined,
            },
            include: { responsibles: true },
        });
    }

    async getStats() {
        const total = await this.prisma.student.count();
        const ativos = await this.prisma.student.count({ where: { active: true } });
        const comRota = await this.prisma.student.count({
            where: { route: { not: null } }, // route é string
        });
        const semRota = await this.prisma.student.count({
            where: { route: null },
        });

        return { total, ativos, comRota, semRota };
    }

    async remove(id: string) {
        await this.findOne(id);

        // apaga os responsáveis primeiro
        await this.prisma.responsible.deleteMany({
            where: { studentId: id },
        });

        // depois apaga o aluno
        return this.prisma.student.delete({ where: { id } });
    }




}
