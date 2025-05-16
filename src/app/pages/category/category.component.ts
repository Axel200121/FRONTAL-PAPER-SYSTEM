import { Component, OnInit } from '@angular/core';
import { CategoryDto } from '../../interfaces/category.dto';
import { CategoryService } from './service/category.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag, TagModule } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-category',
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

  //* Variables para formulario
  public isEditForm : boolean = false
  public idCategory : string  = ''
  public formCategory!:FormGroup
  public isVisibleForm: boolean = false

  public listValidateInputs: ValidateInputDto[]=[]
  public messageErrorForm : string = ''


  constructor(
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.executeGetListCategories()
    this.executeGetCategoriesBySelect()
    this.initFormCategory()
  }

  /**
   * TODO: METODOS PARA AGREGA O ACTUALIZAR CLIENTES
   */
  private initFormCategory(category?:CategoryDto){
    this.formCategory = this.formBuilder.group({
      name:[category?.name || '', [Validators.required]],
      status:[category?.status || '', [Validators.required]],
      description:[category?.description || '', [Validators.required]],
    })
  }

  public showFormModal(category?:CategoryDto){
    this.isVisibleForm = true
    if (category === undefined || category === null) {
      this.isEditForm = false
      this.formCategory.reset()
    }else{
      this.isEditForm = true
      this.idCategory = category.id || ''
      this.initFormCategory(category)
    }
  }

  public closeDialog(){
    this.isVisibleForm = false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formCategory.reset()
  }

  public onSubmitCategory(event:Event){
    if (this.formCategory.valid) {
      let category : CategoryDto = {
        name: this.formCategory.value.name,
        status: this.formCategory.value.status,
        description: this.formCategory.value.description
      }
      this.listValidateInputs = []
      this.confirmCategoryForm(event,category,this.idCategory)
    }else{
      this.messageErrorForm = 'Tienes campos vacios, verifica por favor'
    }
    }


  private executeSaveCategoy(category:CategoryDto){
    this.categoryService.executeSaveCategory(category).subscribe({
      next:(response)=>{
        this.first = 0; // Vuelve a la primera página
        this.rows = 5;  // Asegura que rows sea 5
        this.formCategory.reset(),
        this.loadCategories()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'La categoria se ha registrado de forma exitosa' });
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        if (response.statusCode === 400 && response.message === "Campos invalidos"){
          this.listValidateInputs = response.data
        } else if(response.statusCode === 400){
          this.messageErrorForm = response.message
        }
          
        if (error.error.status === 500) {
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      }
    })
  }
  
  private executeUpdateCategory(idCategory:string, category:CategoryDto){
    this.categoryService.executeUpdateCategory(idCategory,category).subscribe({
      next:(response)=>{
        this.first = 0 // Vuelve a la primera página
        this.rows = 5  // Asegura que rows sea 5
        this.formCategory.reset(),
        this.loadCategories()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'La categoria se actualizo de forma exitosa' });
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        if (response.statusCode === 400 && response.message === "Campos invalidos"){
          this.listValidateInputs = response.data
        } else if(response.statusCode === 400){
          this.messageErrorForm = response.message
        }
        if (error.error.status === 500) {
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      }
    })
  }

  public confirmCategoryForm(event: Event, category:CategoryDto, idCategory?:string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro de que quieres continuar?',
        header: 'Confirmación',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'No, Cancelar',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Si, Continuar',
        },
        accept: () => {
          if(idCategory === null || idCategory === '' || idCategory === undefined){
            this.executeSaveCategoy(category)
          }else{
            this.executeUpdateCategory(idCategory,category)
          }
                
        },
    });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información de la categoria' : 'Ingresa la siguiente información'
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
