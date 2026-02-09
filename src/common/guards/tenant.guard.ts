import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

/**
 * TenantGuard ensures that every request has a valid tenantId from the authenticated user.
 * This is CRITICAL for multi-tenant data isolation.
 */
@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.tenantId) {
            throw new UnauthorizedException('Tenant not found in user context');
        }

        // Inject tenantId into request for easy access in controllers/services
        request.tenantId = user.tenantId;

        return true;
    }
}
