import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, gcalEventId?: string): Promise<Appointment> {
    return this.prisma.appointment.create({
      data: {
        name: createAppointmentDto.name,
        email: createAppointmentDto.email,
        date: new Date(createAppointmentDto.date),
        notes: createAppointmentDto.notes,
        gcalEventId,
      },
    });
  }

  async findAll(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: number): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }
}
