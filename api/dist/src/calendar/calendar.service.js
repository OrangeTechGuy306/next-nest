"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
let CalendarService = CalendarService_1 = class CalendarService {
    configService;
    logger = new common_1.Logger(CalendarService_1.name);
    calendar;
    constructor(configService) {
        this.configService = configService;
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
        if (!clientId || !clientSecret || !refreshToken) {
            const errorMessage = 'Google Calendar credentials are required. Please configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in your environment variables.';
            this.logger.error(errorMessage);
            throw new common_1.InternalServerErrorException(errorMessage);
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
        this.logger.log('Google Calendar API initialized successfully');
    }
    async createEvent(summary, description, startDateTime, attendeeEmail) {
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
        }
        catch (error) {
            this.logger.error(`Failed to create calendar event: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to create calendar event: ${error.message}`);
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = CalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map