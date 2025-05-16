import { Component, OnInit } from '@angular/core';
import { CategoryDto } from '../../interfaces/category.dto';
import { CategoryService } from './service/category.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag, TagModule } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-category',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    StatusTranslatePipe,

    SelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[ConfirmationService, MessageService],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent  implements OnInit{

  //* Variables para el datatable y paginación
  public listCategories!:CategoryDto[]
  public isVisibleTable: boolean = false
  public totalRecords: number = 0
  public loading: boolean = false
  public rows: number = 5
  public first: number = 0

  //* Variables para filtrar información
  public listCategoriesBySelect!: CategoryDto[]
  public selectedCategory: string = ''
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
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    this.executeGetListCategories()
    this.executeGetCategoriesBySelect()
  }

  /**
   * TODO: MEOTODOS PARA FILTRAR INFORMACIÓN
   */

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

  public filterDataTable(category?: string, status?: string) {
    this.loadCategories(category, status);
  }

  public clearDataFilter() {
    this.loadCategories()
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
  private executeGetListCategories(page = 0, size = 5, idCategory?:string, status?:string){
    this.categoryService.executeGetListCategories(page,size,idCategory,status).subscribe({
      next: (response)=>{
        this.listCategories = response.content
        this.totalRecords = response.totalElements
        this.loading = false
      },
      error: (error)=>{
        this.loading = false
        this.isVisibleTable = false
        this.listCategories = []
      }
    })
  }

  public loadCategories(idCategory?:string, status?:string, event?:TableLazyLoadEvent){
    this.loading = true
    const first = event?.first || 0
    const rows = event?.rows || 5
    const page = first / rows
    const size = rows
    this.executeGetListCategories(page,size,idCategory,status)
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
