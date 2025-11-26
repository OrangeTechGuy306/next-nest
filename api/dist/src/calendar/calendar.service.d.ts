import { ConfigService } from '@nestjs/config';
export declare class CalendarService {
    private configService;
    private readonly logger;
    private calendar;
    constructor(configService: ConfigService);
    createEvent(summary: string, description: string, startDateTime: Date, attendeeEmail: string): Promise<string>;
}
