import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('routes')
@UseGuards(JwtAuthGuard, TenantGuard) // CRITICAL: Enforce authentication and tenant isolation
export class RoutesController {
  constructor(private readonly routesService: RoutesService) { }

  @Post()
  create(@TenantId() tenantId: string, @Body() dto: CreateRouteDto) {
    return this.routesService.create(tenantId, dto);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.routesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.routesService.findOne(tenantId, id);
  }

  // ✅ Live info para "Rota em andamento"
  @Get(':id/live')
  live(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.routesService.liveRoute(tenantId, id);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.routesService.remove(tenantId, id);
  }

  // ✅ Iniciar rota
  @Patch(':id/start')
  start(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.routesService.startRoute(tenantId, id);
  }

  // ✅ Encerrar rota
  @Patch(':id/finish')
  finish(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.routesService.finishRoute(tenantId, id);
  }
}
