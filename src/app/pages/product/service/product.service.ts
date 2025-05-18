import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../../../interfaces/api.response.dto';
import { ProductDto } from '../../../interfaces/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private http = inject(HttpClient)
  private url = environment.apiUrl
  constructor() { }

  public executeListProducts(page:number, size:number, idProduct?:string, idCategory?:string, idProvider?:string, status?:string):Observable<any>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())

    if (status || idProduct || idCategory || idProvider) {
      params = params
      .set('idProduct', idProduct!.toString())
      .set('idCategory', idCategory!.toString())
      .set('idProvider', idProvider!.toString())
      .set('status', status!.toString())
    }

    const url = `${this.url}/products/alls`
    return this.http.get(url, {params})
  }

  public executeListProductsBySelect():Observable<ApiResponseDto>{
    const url = `${this.url}/products/alls/select`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeGetProduct(idProduct:string):Observable<ApiResponseDto>{
    const url = `${this.url}/products/get/${idProduct}`
    return this.http.get<ApiResponseDto>(url)
  }

  public executeSaveProduct(product:ProductDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/products/save`
    return this.http.post<ApiResponseDto>(url,product)
  }

  public executeupdateProduct(idProduct:string, product:ProductDto):Observable<ApiResponseDto>{
    const url =  `${this.url}/products/update/${idProduct}`
    return this.http.put<ApiResponseDto>(url,product);
  }

  public executeDeleteProduct(idProduct:string):Observable<ApiResponseDto>{
    const url = `${this.url}/products/delete/${idProduct}`
    return this.http.delete<ApiResponseDto>(url)
  }
}
