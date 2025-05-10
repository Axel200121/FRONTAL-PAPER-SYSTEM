import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PermissionDto } from '../../../interfaces/permission.dto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {


  private http = inject(HttpClient)
  private url = environment.apiUrl
  constructor() { }


  public executeSavePermission(permissionDto:PermissionDto):Observable<ApiResponseDto>{
    const url = `${this.url}/permissions/save`
    return this.http.post<ApiResponseDto>(url,permissionDto)
  }

  public executeUpdatePermission(id:string, permissionDto:PermissionDto):Observable<ApiResponseDto>{
    const url = `${this.url}/permissions/update/${id}`
    return this.http.put<ApiResponseDto>(url, permissionDto);
  }

  public executeListPermissions(page:number, size:number, status?:string, idPermission?:string):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    if (status || idPermission) {
      params = params
      .set('status', status!.toString())
      .set('idPermission', idPermission!.toString())
    }

    const url = `${this.url}/permissions/alls`
    return this.http.get(url,{params})
  }

  public executeGetPermission(id:string):Observable<ApiResponseDto>{
    const url = `${this.url}/permissions/get/${id}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeDeletePermission(id:string):Observable<ApiResponseDto>{
    const url = `${this.url}/permissions/delete/${id}`
    return this.http.delete<ApiResponseDto>(url)
  }


}
