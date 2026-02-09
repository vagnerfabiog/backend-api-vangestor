import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('drivers')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.driversService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.driversService.findOne(id, tenantId);
    }

    @Post()
    create(@TenantId() tenantId: string, @Body() createDriverDto: CreateDriverDto) {
        return this.driversService.create(tenantId, createDriverDto);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @TenantId() tenantId: string,
        @Body() updateDriverDto: UpdateDriverDto,
    ) {
        return this.driversService.update(id, tenantId, updateDriverDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.driversService.remove(id, tenantId);
    }
}
