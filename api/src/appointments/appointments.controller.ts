import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CalendarService } from '../calendar/calendar.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly calendarService: CalendarService,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto) {
    const eventId = await this.calendarService.createEvent(
      `Appointment with ${createAppointmentDto.name}`,
      createAppointmentDto.notes || 'No additional notes',
      new Date(createAppointmentDto.date),
      createAppointmentDto.email,
    );

    // Save appointment to database
    return this.appointmentsService.create(createAppointmentDto, eventId || undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }
}
