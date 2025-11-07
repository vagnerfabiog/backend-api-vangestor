import { Controller, Param, Patch } from '@nestjs/common';
import { StopsService } from './stops.service';

@Controller('stops')
export class StopsController {
    constructor(private readonly stopsService: StopsService) { }

    // ✅ motorista chegou na parada
    @Patch(':id/arrive')
    arrive(@Param('id') id: string) {
        return this.stopsService.arrive(id);
    }

    // ✅ motorista concluiu embarque/desembarque
    @Patch(':id/complete')
    complete(@Param('id') id: string) {
        return this.stopsService.complete(id);
    }
}
