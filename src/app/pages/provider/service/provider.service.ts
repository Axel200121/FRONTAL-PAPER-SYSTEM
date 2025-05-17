import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';
import { ProviderDto } from '../../../interfaces/provider.dto';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private http = inject(HttpClient)
  private url = environment.apiUrl
  constructor() { }

  public executeListProviders(page:number, size:number, idProvider?:string, status?:string):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    if (status || idProvider) {
      params = params
      .set('idProvider', idProvider!.toString())
      .set('status', status!.toString())
    }

    const url = `${this.url}/providers/alls`
    return this.http.get(url, {params})
  }

  public executeListProvidersBySelect():Observable<ApiResponseDto>{
    const url = `${this.url}/providers/alls/select`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeGetProvider(idProvider:string):Observable<ApiResponseDto>{
    const url = `${this.url}/providers/get/${idProvider}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeSaveProvider(provider:ProviderDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/providers/save`
    return this.http.post<ApiResponseDto>(url,provider)
  }

  public executeupdateProvider(idProvider:string, provider:ProviderDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/providers/update/${idProvider}`
    return this.http.put<ApiResponseDto>(url,provider);
  }

  public executeDeleteProvider(idProvider:string):Observable<ApiResponseDto>{
    const url = `${this.url}/providers/delete/${idProvider}`
    return this.http.delete<ApiResponseDto>(url)
  }
}
