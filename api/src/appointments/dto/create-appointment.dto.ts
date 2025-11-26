import { IsEmail, IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
