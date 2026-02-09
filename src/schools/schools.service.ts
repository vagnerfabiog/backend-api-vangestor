import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, createSchoolDto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: {
        ...createSchoolDto,
        tenantId,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.school.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Optional: Add other methods if needed
  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
