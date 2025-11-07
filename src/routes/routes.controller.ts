import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  // ✅ Live info para “Rota em andamento”
  @Get(':id/live')
  live(@Param('id') id: string) {
    return this.routesService.liveRoute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }

  // ✅ Iniciar rota
  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.routesService.startRoute(id);
  }

  // ✅ Encerrar rota
  @Patch(':id/finish')
  finish(@Param('id') id: string) {
    return this.routesService.finishRoute(id);
  }
}
