import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';
import { CategoryDto } from '../../../interfaces/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient)
  private url = environment.apiUrl

  constructor() { }


  public executeGetListCategories(page:number, size:number, idCategory?:string, status?:string):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    if (idCategory || status) {
      params = params
      .set('idCategory', idCategory!.toString())
      .set('status', status!.toString())
    }
    const url = `${this.url}/categories/alls`
    return this.http.get(url,{params})
  }

  public executeGetListCategoriesBySelect():Observable<ApiResponseDto>{
    const url = `${this.url}/categories/select`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeGetCategory(idCategory:string):Observable<ApiResponseDto>{
    const url = `${this.url}/categories/get/${idCategory}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeSaveCategory(category:CategoryDto):Observable<ApiResponseDto>{
    const url = `${this.url}/categories/save`
    return this.http.post<ApiResponseDto>(url,category)
  }

  public executeUpdateCategory(idCategory:string, category:CategoryDto):Observable<ApiResponseDto>{
    const url  = `${this.url}/categories/update/${idCategory}`
    return this.http.put<ApiResponseDto>(url,category)
  }

  public executeDeleteCategory(idCategory:string):Observable<ApiResponseDto>{
    const url = `${this.url}/categories/delete/${idCategory}`
    return this.http.delete<ApiResponseDto>(url)
  }



}
