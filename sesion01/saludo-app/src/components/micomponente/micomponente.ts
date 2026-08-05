import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

// ─── Diálogo de Confirmación ────────────────────────────────────────────────
@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon class="success-icon">check_circle</mat-icon>
      </div>
      <h2 mat-dialog-title>¡Registro Exitoso!</h2>
      <mat-dialog-content>
        <p>Tu cuenta ha sido creada correctamente.</p>
        <p>Te hemos enviado un correo de verificación.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-raised-button color="primary" (click)="cerrar()">
          <mat-icon>login</mat-icon>
          Ir al Inicio
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
      padding: 16px;
    }
    .dialog-icon {
      margin-bottom: 8px;
    }
    .success-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
    }
    h2 {
      color: #333;
      margin-bottom: 8px;
    }
    p {
      color: #666;
      margin: 4px 0;
    }
  `]
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  cerrar(): void {
    this.dialogRef.close(true);
  }
}

// ─── Componente Principal: Formulario de Registro ───────────────────────────
@Component({
  selector: 'app-micomponente',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatStepperModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './micomponente.html',
  styleUrl: './micomponente.css'
})
export class Micomponente {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ocultarPassword = true;
  ocultarConfirmPassword = true;

  registroForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\d{7,15}$/)]],
    fechaNacimiento: [''],
    pais: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    aceptaTerminos: [false, Validators.requiredTrue]
  });

  passwordsNoCoinciden(): boolean {
    const pass = this.registroForm.get('password')?.value;
    const confirm = this.registroForm.get('confirmPassword')?.value;
    return pass !== confirm;
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.snackBar.open('⚠️ Por favor corrige los errores del formulario', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (this.passwordsNoCoinciden()) {
      this.snackBar.open('❌ Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Mostrar popup de confirmación exitosa
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('🎉 ¡Bienvenido! Tu cuenta está lista', 'OK', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.limpiar();
      }
    });
  }

  limpiar(): void {
    this.registroForm.reset();
    this.snackBar.open('🧹 Formulario limpiado', 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
