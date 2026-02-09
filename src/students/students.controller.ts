import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, TenantGuard) // CRITICAL: Enforce authentication and tenant isolation
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() data: CreateStudentDto) {
        return this.studentsService.create(tenantId, data);
    }

    @Get()
    async findAll(
        @TenantId() tenantId: string,
        @Query('search') search?: string,
        @Query('school') school?: string,
        @Query('route') route?: string,
        @Query('status') status?: string
    ) {
        return this.studentsService.findAll(tenantId, { search, school, route, status });
    }


    @Get('stats')
    getStats(@TenantId() tenantId: string) {
        return this.studentsService.getStats(tenantId);
    }


    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.studentsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: UpdateStudentDto) {
        return this.studentsService.update(tenantId, id, data);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.studentsService.remove(tenantId, id);
    }


}
