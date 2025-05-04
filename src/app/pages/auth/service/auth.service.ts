import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoginDto } from '../../../interfaces/login.dto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private url = environment.apiUrl
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private _cookie: CookieService
  ) { }

  public executeLogin(loginDto: LoginDto) : Observable<ApiResponseDto>{
    const url = `${this.url}/auth/login`
    return this.http.post<ApiResponseDto>(url,loginDto);
  }

  public getToken(): string {
    return this._cookie.get('authToken'); // Recuperar el token
  }

  public isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }


}
