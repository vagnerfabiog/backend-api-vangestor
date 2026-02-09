import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        const drivers = await this.prisma.driver.findMany({
            where: {
                tenantId,
            },
            include: {
                user: true, // Include user data (name, email, phone)
                vehicles: {
                    include: {
                        vehicle: true,
                    },
                },
                routes: {
                    where: {
                        status: 'IN_PROGRESS',
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        return drivers.map((driver) => ({
            id: driver.id,
            name: driver.user.name,
            email: driver.user.email,
            phone: driver.user.phone,
            cnh: driver.cnh,
            cnhCategory: driver.cnhCategory,
            cnhExpiration: driver.cnhExpiration,
            active: driver.active,
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt,
            vehicles: driver.vehicles.map((dv) => ({
                id: dv.vehicle.id,
                plate: dv.vehicle.plate,
                model: dv.vehicle.model,
                capacity: dv.vehicle.capacity,
                color: dv.vehicle.color,
            })),
            activeRoutesCount: driver.routes.length,
        }));
    }

    async findOne(id: string, tenantId: string) {
        const driver = await this.prisma.driver.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                user: true,
                vehicles: {
                    include: {
                        vehicle: true,
                    },
                },
                routes: {
                    include: {
                        vehicle: true,
                        stops: true,
                    },
                },
            },
        });

        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        return {
            id: driver.id,
            name: driver.user.name,
            email: driver.user.email,
            phone: driver.user.phone,
            cnh: driver.cnh,
            cnhCategory: driver.cnhCategory,
            cnhExpiration: driver.cnhExpiration,
            active: driver.active,
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt,
            vehicles: driver.vehicles.map((dv) => ({
                id: dv.vehicle.id,
                plate: dv.vehicle.plate,
                model: dv.vehicle.model,
                capacity: dv.vehicle.capacity,
                color: dv.vehicle.color,
            })),
            routes: driver.routes.map((route) => ({
                id: route.id,
                name: route.name,
                status: route.status,
                vehicle: route.vehicle ? {
                    id: route.vehicle.id,
                    plate: route.vehicle.plate,
                    model: route.vehicle.model,
                } : null,
                stopsCount: route.stops.length,
            })),
        };
    }

    async create(tenantId: string, createDriverDto: CreateDriverDto) {
        const hashedPassword = createDriverDto.password
            ? await bcrypt.hash(createDriverDto.password, 10)
            : null;

        // Create User first
        const user = await this.prisma.user.create({
            data: {
                name: createDriverDto.name,
                email: createDriverDto.email,
                phone: createDriverDto.phone,
                password: hashedPassword,
                role: 'DRIVER',
                tenantId,
            },
        });

        // Then create Driver record
        const driver = await this.prisma.driver.create({
            data: {
                userId: user.id,
                cnh: createDriverDto.cnh,
                cnhCategory: createDriverDto.cnhCategory,
                cnhExpiration: createDriverDto.cnhExpiration,
                active: createDriverDto.active ?? true,
                tenantId,
            },
            include: {
                user: true,
            },
        });

        return {
            id: driver.id,
            name: driver.user.name,
            email: driver.user.email,
            phone: driver.user.phone,
            cnh: driver.cnh,
            cnhCategory: driver.cnhCategory,
            cnhExpiration: driver.cnhExpiration,
            active: driver.active,
        };
    }

    async update(id: string, tenantId: string, updateDriverDto: UpdateDriverDto) {
        // Verify driver exists and belongs to tenant
        const existingDriver = await this.prisma.driver.findFirst({
            where: { id, tenantId },
            include: { user: true },
        });

        if (!existingDriver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        // Update User data if provided
        if (updateDriverDto.name || updateDriverDto.email || updateDriverDto.phone || updateDriverDto.password) {
            const userData: any = {};
            if (updateDriverDto.name) userData.name = updateDriverDto.name;
            if (updateDriverDto.email) userData.email = updateDriverDto.email;
            if (updateDriverDto.phone) userData.phone = updateDriverDto.phone;
            if (updateDriverDto.password) {
                userData.password = await bcrypt.hash(updateDriverDto.password, 10);
            }

            await this.prisma.user.update({
                where: { id: existingDriver.userId },
                data: userData,
            });
        }

        // Update Driver data
        const driverData: any = {};
        if (updateDriverDto.cnh) driverData.cnh = updateDriverDto.cnh;
        if (updateDriverDto.cnhCategory) driverData.cnhCategory = updateDriverDto.cnhCategory;
        if (updateDriverDto.cnhExpiration) driverData.cnhExpiration = updateDriverDto.cnhExpiration;
        if (updateDriverDto.active !== undefined) driverData.active = updateDriverDto.active;

        return this.prisma.driver.update({
            where: { id },
            data: driverData,
            include: {
                user: true,
            },
        });
    }

    async remove(id: string, tenantId: string) {
        // Verify driver exists and belongs to tenant
        await this.findOne(id, tenantId);

        // Soft delete: set active to false
        return this.prisma.driver.update({
            where: { id },
            data: { active: false },
        });
    }
}
