import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteStatus, StopStatus } from '@prisma/client';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRouteDto) {
    return this.prisma.route.create({
      data: {
        name: data.name,
        period: data.period,
        startTime: data.startTime,
        description: data.description,
        active: data.active ?? true,
        driverId: data.driverId || null,
        vehicleId: data.vehicleId || null,
        stops: {
          create: data.stops?.map((s, i) => ({
            type: s.type,
            name: s.name,
            address: s.address,
            radius: s.radius ?? 50,
            order: s.order ?? i + 1,
            studentId: s.studentId ?? null,
          })),
        },
      },
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
          include: { student: true },
        },
      },
    });
  }

  findAll() {
    return this.prisma.route.findMany({
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
          include: { student: true },
        },
      },
    });

    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async update(id: string, data: UpdateRouteDto) {
    await this.findOne(id);

    return this.prisma.route.update({
      where: { id },
      data: {
        name: data.name,
        period: data.period,
        startTime: data.startTime,
        description: data.description,
        active: data.active,
        driverId: data.driverId,
        vehicleId: data.vehicleId,
        stops: data.stops
          ? {
              deleteMany: {}, // recria paradas
              create: data.stops.map((s, i) => ({
                type: s.type,
                name: s.name,
                address: s.address,
                radius: s.radius ?? 50,
                order: s.order ?? i + 1,
                studentId: s.studentId ?? null,
              })),
            }
          : undefined,
      },
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
          include: { student: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.stop.deleteMany({ where: { routeId: id } });
    return this.prisma.route.delete({ where: { id } });
  }

  // ✅ INICIAR ROTA
  async startRoute(id: string) {
    await this.findOne(id);

    return this.prisma.route.update({
      where: { id },
      data: {
        status: RouteStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
          include: { student: true },
        },
      },
    });
  }

  // ✅ ENCERRAR ROTA
  async finishRoute(id: string) {
    await this.findOne(id);

    // marca paradas pendentes como SKIPPED
    await this.prisma.stop.updateMany({
      where: {
        routeId: id,
        status: StopStatus.PENDING,
      },
      data: {
        status: StopStatus.SKIPPED,
      },
    });

    return this.prisma.route.update({
      where: { id },
      data: {
        status: RouteStatus.COMPLETED,
        endedAt: new Date(),
      },
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
          include: { student: true },
        },
      },
    });
  }

  // ✅ DADOS PARA TELA "EM ANDAMENTO"
  async liveRoute(id: string) {
    return this.findOne(id); // por enquanto reusa o findOne; depois podemos incluir posição GPS
  }
}
