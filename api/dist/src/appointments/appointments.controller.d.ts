import { AppointmentsService } from './appointments.service';
import { CalendarService } from '../calendar/calendar.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    private readonly calendarService;
    constructor(appointmentsService: AppointmentsService, calendarService: CalendarService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        date: Date;
        notes: string | null;
        gcalEventId: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        date: Date;
        notes: string | null;
        gcalEventId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        date: Date;
        notes: string | null;
        gcalEventId: string | null;
    } | null>;
}
