import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { EmailValidationResponse } from './interfaces/email-validation-response.interface';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * POST /api/email/validar
   * Body: { "email": "edwin@itera.com" }
   */
  @Post('validar')
  @HttpCode(HttpStatus.OK)
  validar(@Body() dto: ValidateEmailDto): EmailValidationResponse {
    return this.emailService.validar(dto.email);
  }

  /**
   * GET /api/email — solo para ver qué correos tiene cargados el array
   */
  @Get()
  listar(): { total: number; emails: readonly string[] } {
    const emails = this.emailService.listar();
    return { total: emails.length, emails };
  }
}
