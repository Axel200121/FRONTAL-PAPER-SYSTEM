import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../interfaces/api.response.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private http = inject(HttpClient)
  private url = environment.apiUrl

  constructor() { }

  public executeGetAllRolesBySelect():Observable<ApiResponseDto>{
    const url = `${this.url}/roles/select`
    return this.http.get<ApiResponseDto>(url);
  }


}
