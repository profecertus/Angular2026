import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dniValidator } from '../validators/dni.validators';
import { passwordMatchValidator } from '../validators/passwords-match.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { sinEspacios } from '../validators/sin-espacios.validators';
import Swal from 'sweetalert2';
import { emailDisponibleValidator } from '../validators/email-disponible.validator';

@Component({
  selector: 'app-inscripcion',
  imports: [ReactiveFormsModule],
  templateUrl: './inscripcion.html',
  styleUrl: './inscripcion.css',
})
export class Inscripcion {
  private fb = inject(FormBuilder);

  cupon = new FormControl('',{
    nonNullable: true,
    validators:[Validators.pattern(/^[A-Z]{3}-\d{3}$/)],
  });

  form: FormGroup = this.fb.group({
    nombre:['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    email: ['', {
      validators: [Validators.required, Validators.email, sinEspacios],
      asyncValidators: [emailDisponibleValidator()],
    }],
    edad: [null as number | null, [Validators.required, Validators.min(18), Validators.max(99)]],
    dni: ['', [Validators.required, dniValidator()]],
    tipoParticipante:['asistente', Validators.required],
    credenciales: this.fb.group(
      {
        clave:['', [Validators.required, Validators.minLength(8)]],
        confirmar:['', Validators.required]
      },
      {validators:[passwordMatchValidator('clave', 'confirmar')]}
    ),
    acompanantes: this.fb.array<FormGroup>([]),
  });

  get emailCtrl():AbstractControl{
    return this.form.get('email')!;
  }

  get credenciales():FormGroup{
    return this.form.get('credenciales') as FormGroup;
  }

  get acompanantes():FormArray{
    return this.form.get('acompanantes') as FormArray;
  }

  vistaPrevia = signal<string>('{}');
  estadoForm = signal<string>('PENDING');
  autoguardado = signal<string>('-');
  totalAcompantes = computed(() => this.acompanantes.length);

  constructor(){
    this.form.valueChanges.
      pipe(takeUntilDestroyed()).
      subscribe(()=> {
        const hora = new Date().toLocaleTimeString();
        this.autoguardado.set(
          this.form.valid ? `Autoguardado ${hora} `: `Cambios sin guardar (${hora})`
        );
      });

      this.form.statusChanges
        .pipe(takeUntilDestroyed())
        .subscribe((s) => this.estadoForm.set(s));
  }

  tieneError(ruta:string, error:string): boolean{
    const c = this.form.get(ruta);
    return !!c && c.touched && c.hasError(error);
  }

  toggleEmail():void{
    const email = this.form.get('email');
    email?.enabled ? email.disable(): email?.enable();
  }

  onTipoChange():void{
    const esPonente = this.form.get('tipoParticipante')?.value === 'ponente';
    if(esPonente && !this.form.get('tema')){
      this.form.addControl(
        'tema',
        this.fb.control('', [Validators.required, Validators.minLength(5)])
      );
    }else if (!esPonente && this.form.get('tema')){
      this.form.removeControl('tema');
    }
  }

  private nuevoAcompanante(nombre='', edad:number | null = null):FormGroup{
    return this.fb.group({
      nombre: [nombre, [Validators.required, Validators.minLength(3)]],
      edad:[edad, [Validators.required, Validators.min(0)]],
    });
  }

  agregarAcompanante():void{
    this.acompanantes.push(this.nuevoAcompanante());
  }

  quitarAcompanantes(i: number):void{
    this.acompanantes.removeAt(i);
  }

  guardado = signal<string>('');

  guardar():void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      this.guardado.set('');
      Swal.fire({
        icon:'error',
        title:'Formulario invalido',
        text:'Revisa los campos marcados en rojo'
      });
      return;
    }

    const dto = this.form.getRawValue();
    this.guardado.set(`Inscripción Registrada para "${dto.nombre}"`)
    Swal.fire({
      icon:'success',
      title:'Grabado correcto',
      text: 'Inscripcion registrada',
      confirmButtonText: 'Aceptar'
    });
  }

  limpiar():void{
    this.form.reset({tipoParticipante: 'asistente'});
    this.acompanantes.clear();
    this.form.removeControl('tema');
  }
}
