import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoginDto } from '../../../interfaces/login.dto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private url = environment.apiUrl
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor() { }

  public executeLogin(loginDto: LoginDto) : Observable<ApiResponseDto>{
    const url = `${this.url}/auth/login`
    return this.http.post<ApiResponseDto>(url,loginDto);
  }

  /**
   * Almacena el token JWT en el localStorage
   * @param token Token JWT
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token JWT almacenado
   * @returns Token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Almacena la información del usuario en el localStorage
   * @param user Información del usuario
  */
  private setCurrentUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Obtiene la información del usuario almacenada
   * @returns Información del usuario o null si no existe
  */
  getCurrentUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si hay un token válido
  */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión del usuario
  */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
