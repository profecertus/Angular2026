import { Injectable } from '@nestjs/common';
import { EmailValidationResponse } from './interfaces/email-validation-response.interface';

@Injectable()
export class EmailService {
  /**
   * Array "duro" de correos ya registrados.
   * Todo en minúsculas para comparar sin importar cómo lo escriba el usuario.
   */
  private readonly emailsRegistrados: readonly string[] = [
    'ebarrientos@gmail.com',
    'admin@auna.pe',
    'juan.perez@gmail.com',
    'maria.lopez@hotmail.com',
    'soporte@newhorizons.com',
    'test@test.com',
  ];

  validar(email: string): EmailValidationResponse {
    const normalizado = email.trim().toLowerCase();
    const existe = this.emailsRegistrados.includes(normalizado);

    return {
      email: normalizado,
      existe,
      mensaje: existe
        ? 'El correo ya se encuentra registrado'
        : 'El correo está disponible',
    };
  }

  listar(): readonly string[] {
    return this.emailsRegistrados;
  }
}
