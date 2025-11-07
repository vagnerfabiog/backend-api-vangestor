export class CreateRouteDto {
  name!: string;
  period!: string;
  startTime!: string;
  description?: string;
  active?: boolean;
  driverId?: string;
  vehicleId?: string;
  stops?: {
    type: string;
    name?: string;
    address?: string;
    radius?: number;
    order?: number;
    studentId?: string;
  }[];
}
