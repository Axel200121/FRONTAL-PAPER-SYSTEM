import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { RoleDto } from '../../../interfaces/role.dto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';

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

  public executeGetListRoles(page:number, size:number, role?:string, status?:string,):Observable<any>{
    let params = new HttpParams()
    .set('page',page.toString())
    .set('size', size.toString())
    if (role || status) {
      params = params
      .set('idRole', role!.toString())
      .set('status', status!.toString())
    }

    const url = `${this.url}/roles/alls`
    return this.http.get(url)
  }

  public executeGetRole(idRole:string):Observable<ApiResponseDto>{
    const url = `${this.url}/roles/get/${idRole}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeSaveRole(roleDto:RoleDto):Observable<ApiResponseDto>{
    const url = `${this.url}/roles/save`
    return this.http.post<ApiResponseDto>(url,roleDto)
  }

  public executeUpdateRole(idRole:string, roleDto:RoleDto):Observable<ApiResponseDto>{
    const url = `${this.url}/roles/update/${idRole}`
    return this.http.put<ApiResponseDto>(url,roleDto)
  }


  public executeDeleteRole(idRole:string):Observable<ApiResponseDto>{
    const url = `${this.url}/roles/delete/${idRole}`
    return this.http.delete<ApiResponseDto>(url)
  }
}
