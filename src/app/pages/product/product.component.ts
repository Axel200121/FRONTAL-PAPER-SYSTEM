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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
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
    ToastModule,
    InputNumber, 
    Fluid
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
          nameKey: 'OUT_OF_STOCK',
          name: 'Agotado',
        },
        {
          nameKey: 'PENDING_REPLENISHMENT',
          name: 'Pendiente de Reposición',
        },
        {
          nameKey: 'IN_TRANSIT',
          name: 'En transito',
        },
        {
          nameKey: 'DISCOUNTED',
          name: 'Descontado',
        },
        {
          nameKey: 'WITHDRAWN',
          name: 'Retirado',
        },
        {
          nameKey: 'IN_PRODUCTION',
          name: 'en producción',
        },
  ]

  //* Variables para formulario
  public isEditForm : boolean = false
  public idProduct : string  = ''
  public formProduct!:FormGroup
  public isVisibleForm: boolean = false

  public listValidateInputs: ValidateInputDto[]=[]
  public messageErrorForm : string = ''

  constructor(
    private productService:ProductService,
    private categoryService:CategoryService,
    private providerService:ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
      this.executeGetListProducts()
      this.executeGetCategoriesBySelect()
      this.executeGetProductsBySelect()
      this.executeGetProvidersBySelect()
      this.initFormProduct()
  }

  /**
   * TODO: METODOS PARA AGREGA O ACTUALIZAR CLIENTES
   */
  private initFormProduct(product?:ProductDto){
    this.formProduct = this.formBuilder.group({
      codeProduct:[product?.codeProduct || '',[Validators.required]],
      name:[product?.name || '', [Validators.required]],
      description:[product?.description || '', [Validators.required]],
      buyPrice:[product?.buyPrice || '', [Validators.required]],
      salePrice:[product?.salePrice || '', [Validators.required]],
      stock:[product?.stock  || '', [Validators.required]],
      minimumStock:[product?.minimumStock || '', [Validators.required]],
      category:[product?.category?.id || '', [Validators.required]],
      provider:[product?.provider?.id || '', Validators.required],
      status:[product?.status || '', [Validators.required]],
    })
  }

  public showFormModal(product?:ProductDto){
    this.isVisibleForm = true
    if (product === undefined || product === null) {
      this.isEditForm = false
      this.formProduct.reset()
    }else{
      this.isEditForm = true
      this.idProduct = product.id || ''
      this.initFormProduct(product)
    }
  }

  public closeDialog(){
    this.isVisibleForm = false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formProduct.reset()
  }

  public onSubmitProduct(event:Event){
    if (this.formProduct.valid) {
      let category : CategoryDto = {
        id: this.formProduct.value.category
      }
      
      let provider  : ProviderDto = {
        id: this.formProduct.value.provider
      }

      let product : ProductDto = {
        codeProduct: this.formProduct.value.codeProduct,
        name: this.formProduct.value.name,
        description: this.formProduct.value.description,
        buyPrice: this.formProduct.value.buyPrice,
        salePrice: this.formProduct.value.salePrice,
        stock: this.formProduct.value.stock,
        minimumStock: this.formProduct.value.minimumStock,
        category: category,
        provider: provider,
        status: this.formProduct.value.status
      }
      console.log("data a guardar",product)

      this.listValidateInputs = []
      this.confirmProductForm(event,product,this.idProduct)
    }else{
      this.messageErrorForm = 'Tienes campos vacios, verifica por favor'
    }
    }


  private executeSaveProduct(product: ProductDto){
    this.productService.executeSaveProduct(product).subscribe({
      next:(response)=>{
        this.first = 0; // Vuelve a la primera página
        this.rows = 5;  // Asegura que rows sea 5
        this.formProduct.reset(),
        this.loadProducts()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El producto se ha registrado de forma exitosa' });
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
  
  private executeUpdateProduct(idProduct :string, product: ProductDto){
    this.productService.executeupdateProduct(idProduct,product).subscribe({
      next:(response)=>{
        this.first = 0 // Vuelve a la primera página
        this.rows = 5  // Asegura que rows sea 5
        this.formProduct.reset(),
        this.loadProducts()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El producto se actualizo de forma exitosa' });
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

  public confirmProductForm(event: Event, product: ProductDto, idProduct?:string) {
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
          if(idProduct === null || idProduct === '' || idProduct === undefined){
            this.executeSaveProduct(product)
          }else{
            this.executeUpdateProduct(idProduct,product)
          }
                
        },
    });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información del producto' : 'Ingresa la siguiente información'
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
          return 'contrast'
  
        case 'OUT_OF_STOCK':
          return 'danger'

        case 'PENDING_REPLENISHMENT':
          return 'warn'
        
        case 'DISCOUNTED':
          return 'info'
        
        case 'WITHDRAWN':
          return 'primary'

        case 'IN_PRODUCTION':
          return 'secondary'

        case 'IN_TRANSIT':
          return 'secondary'
         
        case 'DELETED':
          return 'danger'
  
        default:
          return null
      }
    }
  
}
