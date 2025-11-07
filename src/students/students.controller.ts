import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    create(@Body() data: CreateStudentDto) {
        return this.studentsService.create(data);
    }

    @Get()
    async findAll(
        @Query('search') search?: string,
        @Query('school') school?: string,
        @Query('route') route?: string,
        @Query('status') status?: string
    ) {
        return this.studentsService.findAll({ search, school, route, status });
    }


    @Get('stats')
    getStats() {
        return this.studentsService.getStats();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: UpdateStudentDto) {
        return this.studentsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }


}
