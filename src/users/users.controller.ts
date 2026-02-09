import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() body: CreateUserDto) {
    // ⚠️ Public endpoint - no authentication required for first user registration
    // User must provide tenantId in the request body or we use default
    const tenantId = body.tenantId || '00000000-0000-0000-0000-000000000001';
    return this.usersService.create(tenantId, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard) // Protected - requires authentication
  list(@TenantId() tenantId: string) {
    return this.usersService.findAll(tenantId);
  }
}
