import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract tenantId from the request.
 * Use this in controllers to get the current user's tenantId.
 * 
 * Example:
 * @Get()
 * findAll(@TenantId() tenantId: string) {
 *   return this.service.findAll(tenantId);
 * }
 */
export const TenantId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.tenantId;
    },
);
