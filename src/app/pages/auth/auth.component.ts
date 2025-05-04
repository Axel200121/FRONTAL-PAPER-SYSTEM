import { Component, OnInit } from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginDto } from '../../interfaces/login.dto';
import { AuthService } from './service/auth.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IftaLabelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ImageModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    MessageModule,
    Toast,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  public formAuth!: FormGroup;
  public listValidateInputs!: String[];
  public isVisibleErrosForm:boolean =false
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private cookieService:CookieService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.initFormLogin();
  }

  private initFormLogin() {
    this.formAuth = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public onSubmitLogin() {
    this.listValidateInputs = []

    if (this.formAuth.valid) {

      this.isVisibleErrosForm=false
      const loginDto: LoginDto = {

        email: this.formAuth.value.email,
        password: this.formAuth.value.password,

      };
      
      this.executeSetLogin(loginDto);

    } else {

      this.isVisibleErrosForm=true
      this.listValidateInputs = this.validateInputs();

    }
  }

  private executeSetLogin(loginDto: LoginDto) {
    this.authService.executeLogin(loginDto).subscribe({
      next: (response) => {
        console.log(response);
        this.cookieService.set('authToken',response.data.token,{expires: response.data.expiresIn, sameSite:'Strict'})
        const data: ApiResponseDto = response;
        this.toastLogin('success', 'Inicio de sesión exitoso!', data.message);
      },

      error: (error) => {
        console.error(error.error.description);
        if (error.error.status === 401 || error.error.status === 403) {
          this.toast('warn', 'Atención!', error.error.description);
        }

        if (error.error.status === 500) {
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      },
    });
  }

  private toastLogin(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 2000 // Duración en milisegundos (3 segundos)
    });
    // Redirige después de que el toast haya terminado
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);

  }

  private toast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });

    setTimeout
  }

  private validateInputs() {
    let listInputs: String[] = [];

    if (this.formAuth.get('email')?.hasError('required')) {
      listInputs.push('El correo es requerido');
    }

    if (this.formAuth.get('email')?.hasError('email')) {
      listInputs.push('El correo no cumple con el formato');
    }

    if (this.formAuth.get('password')?.hasError('required')) {
      listInputs.push('La contraseña es requerida');
    }

    return listInputs;
  }
}
