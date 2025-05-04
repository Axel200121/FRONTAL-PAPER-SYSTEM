import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserDto } from '../../../interfaces/user.dto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)
  private url = environment.apiUrl


  public executeSaveUser(userDto:UserDto):Observable<ApiResponseDto>{
    const url = `${this.url}/users/save`
    return this.http.post<ApiResponseDto>(url,userDto);
  }

  public executeUpdateUser(idUser:string, userDto:UserDto):Observable<ApiResponseDto>{
    const url = `${this.url}/users/update/${idUser}`
    return this.http.put<ApiResponseDto>(url,userDto);
  }

  public executeGetListUsers(page:number, size:number, role?:string, status?:string):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    if (role || status) {
      params = params
      .set('idRole', role!.toString())
      .set('status', status!.toString())
    }

    const url = `${this.url}/users/alls`
    return this.http.get(url,{params})
  }

  public executeGetUser(idUser:string):Observable<ApiResponseDto>{
    const url = `${this.url}/users/get/${idUser}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeDeleteUser(idUser:string):Observable<ApiResponseDto>{
    const url = `${this.url}/users/delete/${idUser}`
    return this.http.delete<ApiResponseDto>(url)
  }

}
