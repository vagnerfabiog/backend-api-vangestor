import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { RoutesModule } from './routes/routes.module';
import { StopsModule } from './stops/stops.module';
import { SchoolsModule } from './schools/schools.module';
import { UploadModule } from './upload/upload.module';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lê .env
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    RoutesModule,
    StopsModule,
    SchoolsModule,
    UploadModule,
    DriversModule,
  ],
})
export class AppModule { }
