import { Component, OnInit } from '@angular/core';
import { ProductDto } from '../../interfaces/product.dto';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProductService } from './service/product.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { CategoryDto } from '../../interfaces/category.dto';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ProviderDto } from '../../interfaces/provider.dto';
import { CategoryService } from '../category/service/category.service';
import { ProviderService } from '../provider/service/provider.service';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    StatusTranslatePipe,

    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent  implements OnInit{
    
  //* Variables para el datatable y paginación
  public listProducts!:ProductDto[]
  public isVisibleTable: boolean = false
  public totalRecords: number = 0
  public loading: boolean = false
  public rows: number = 5
  public first: number = 0

  //* Variables para filtrar información

  public listProductsBySelect!: ProductDto[]
  public listCategoriesBySelect!: CategoryDto[]
  public listProvidersBySelect!:ProviderDto[]
  public selectedProduct:string = ''
  public selectedCategory: string = ''
  public selectedProvider:string = ''
  public selectedStatus: string  = ''
  public listStatus: StatusRegisterDto[] = [
        {
          nameKey: 'ACTIVE',
          name: 'Activado',
        },
        {
          nameKey: 'INACTIVE',
          name: 'Inactivo',
        },
        {
          nameKey: 'PENDING',
          name: 'Pediente',
        },
        {
          nameKey: 'DELETED',
          name: 'Eliminado',
        },
  ]

  constructor(
    private productService:ProductService,
    private categoryService:CategoryService,
    private providerService:ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}
  
  ngOnInit(): void {
      this.executeGetListProducts()
      this.executeGetCategoriesBySelect()
      this.executeGetProductsBySelect()
      this.executeGetProvidersBySelect()
  }

  /**
     * TODO: MEOTODOS PARA FILTRAR INFORMACIÓN
     */
  
    private executeGetProductsBySelect(){
      this.productService.executeListProductsBySelect().subscribe({
        next: (response)=>{
          this.listProductsBySelect =  response.data
        },
        error:(error)=>{
          const response: ApiResponseDto = error.error;
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      })
    }

    private executeGetCategoriesBySelect(){
      this.categoryService.executeGetListCategoriesBySelect().subscribe({
        next: (response)=>{
          this.listCategoriesBySelect =  response.data
        },
        error:(error)=>{
          const response: ApiResponseDto = error.error;
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      })
    }

    private executeGetProvidersBySelect(){
      this.providerService.executeListProvidersBySelect().subscribe({
        next: (response)=>{
          this.listProvidersBySelect =  response.data
        },
        error:(error)=>{
          const response: ApiResponseDto = error.error;
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      })
    }
  
    public filterDataTable(idProduct?:string, idCategory?:string, idProvider?:string, status?:string) {
      this.loadProducts(idProduct,idCategory,idProvider,status)
    }
  
    public clearDataFilter() {
      this.loadProducts()
      this.selectedProduct = ''
      this.selectedProvider = ''
      this.selectedCategory = ''
      this.selectedStatus = ''
    }
  
    /**
     * TODO: USANDO TOAST
     */
  
    private toast(severity: string, summary: string, detail: string) {
      this.messageService.add({
        severity: severity,
        summary: summary,
        detail: detail,
      });
      setTimeout;
    }
  
  /**
     * TODO: FUCNIONES PARA LISTAS CATEGORIAS
     */
    private executeGetListProducts(page = 0, size = 5, idProduct?:string, idCategory?:string, idProvider?:string, status?:string){
      console.log("id product", idProduct)
      console.log("id category", idCategory)
      console.log("id provider", idProvider)
      console.log("status", status)
      this.productService.executeListProducts(page,size,idProduct,idCategory,idProvider,status).subscribe({
        next: (response)=>{
          this.listProducts = response.content
          this.totalRecords = response.totalElements
          this.loading = false
          console.log("data", this.listProducts)
        },
        error: (error)=>{
          this.loading = false
          this.isVisibleTable = false
          this.listProducts = []
        }
      })
    }
  
    public loadProducts(idProduct?:string, idCategory?:string, idProvider?:string, status?:string, event?:TableLazyLoadEvent){
      this.loading = true
      const first = event?.first || 0
      const rows = event?.rows || 5
      const page = first / rows
      const size = rows
      this.executeGetListProducts(page,size,idProduct,idCategory,idProvider,status)
    }
  
  
    public getSeverity(status: string) {
      switch (status) {
  
        case 'ACTIVE':
          return 'success'
  
        case 'INACTIVE':
          return 'info'
  
        case 'PENDING':
          return 'warn'
  
        case 'DELETED':
          return 'danger'
  
        default:
          return null
      }
    }
  
}
