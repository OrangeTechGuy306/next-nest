import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private calendar: any;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      const errorMessage = 'Google Calendar credentials are required. Please configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in your environment variables.';
      this.logger.error(errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    this.logger.log('Google Calendar API initialized successfully');
  }

  async createEvent(
    summary: string,
    description: string,
    startDateTime: Date,
    attendeeEmail: string,
  ): Promise<string> {
    try {
      const event = {
        summary,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(startDateTime.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
        attendees: [{ email: attendeeEmail }],
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
      });

      this.logger.log(`Created calendar event: ${response.data.id}`);
      return response.data.id;
    } catch (error) {
      this.logger.error(`Failed to create calendar event: ${error.message}`);
      throw new InternalServerErrorException(`Failed to create calendar event: ${error.message}`);
    }
  }
}
