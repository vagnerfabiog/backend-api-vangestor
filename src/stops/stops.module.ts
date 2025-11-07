import { Module } from '@nestjs/common';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StopsController],
  providers: [StopsService, PrismaService],
})
export class StopsModule {}
