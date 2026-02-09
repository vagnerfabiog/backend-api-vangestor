import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('schools')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) { }

  @Post()
  create(@TenantId() tenantId: string, @Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(tenantId, createSchoolDto);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.schoolsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(+id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(+id);
  }
}
