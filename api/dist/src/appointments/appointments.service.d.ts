import { PrismaService } from '../prisma/prisma.service';
import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, gcalEventId?: string): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findOne(id: number): Promise<Appointment | null>;
}
