import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StopStatus } from '@prisma/client';

@Injectable()
export class StopsService {
  constructor(private prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const stop = await this.prisma.stop.findUnique({ where: { id } });
    if (!stop) throw new NotFoundException('Stop not found');
    return stop;
  }

  async arrive(id: string) {
    await this.ensureExists(id);
    return this.prisma.stop.update({
      where: { id },
      data: {
        status: StopStatus.ARRIVED,
        arrivedAt: new Date(),
      },
    });
  }

  async complete(id: string) {
    await this.ensureExists(id);
    return this.prisma.stop.update({
      where: { id },
      data: {
        status: StopStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }
}
