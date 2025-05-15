import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';
import { ClientsDto } from '../../../interfaces/clients.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private http = inject(HttpClient)
  private url = environment.apiUrl
  constructor() { }

  public executeListClients(page:number, size:number):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    const url = `${this.url}/customers/alls`
    return this.http.get(url, {params})
  }

  public executeListClientsBySelect():Observable<ApiResponseDto>{
    const url = `${this.url}/customers/alls/select`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeGetClient(idClient:string):Observable<ApiResponseDto>{
    const url = `${this.url}/customers/get/${idClient}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeSaveClient(clientDto:ClientsDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/customers/save`
    return this.http.post<ApiResponseDto>(url,clientDto)
  }

  public executeupdateClient(idClient:string, clientDto:ClientsDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/customers/update/${idClient}`
    return this.http.put<ApiResponseDto>(url,clientDto);
  }

  public executeDeleteClient(idClient:string):Observable<ApiResponseDto>{
    const url = `${this.url}/customers/delete/${idClient}`
    return this.http.delete<ApiResponseDto>(url)
  }


}
