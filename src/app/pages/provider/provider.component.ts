import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { SelectModule } from 'primeng/select';
import { ProviderService } from './service/provider.service';
import { ProviderDto } from '../../interfaces/provider.dto';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';

@Component({
  selector: 'app-provider',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    Tag,
    TableModule,
    StatusTranslatePipe,
    SelectModule,

    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    InputTextModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss'
})
export class ProviderComponent implements OnInit {

  //*  variables para el DataTable y su paginación
  public listProviders!: ProviderDto[];
  public isVisibleTable: boolean = true;
  public totalRecords: number = 0;
  public loading: boolean = false;
  public rows: number = 5;
  public first: number = 0;

  //* Variables para filtrar información
  public listProvidersBySelect!: ProviderDto[]
  public selectedProvider: string = ''
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
  public idProvider : string  = ''
  public formProvider!:FormGroup
  public isVisibleForm: boolean = false
  public listValidateInputs: ValidateInputDto[]=[]
  public messageErrorForm : string = ''
  



  constructor(
    private providerService:ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ){}



  ngOnInit(): void {
   this.executeGetListProviders()
   this.executeGetProvidersBySelect()
   this.initFormProvider()
  }

  /**
   * TODO: METODOS PARA AGREGA O ACTUALIZAR PROVEEDORES
   */
  private initFormProvider(provider?:ProviderDto){
    this.formProvider = this.formBuilder.group({
      name:[provider?.name || '', [Validators.required]],
      phone:[provider?.phone || '', [Validators.required]],
      email:[provider?.email || '', [Validators.required]],
      status:[provider?.status || '', [Validators.required]],
      address:[provider?.address || '', [Validators.required]],
    })
  }

  public showFormModal(provider?:ProviderDto){
    this.isVisibleForm = true
    if (provider === undefined || provider === null) {
      this.isEditForm = false
      this.formProvider.reset()
    }else{
      this.isEditForm = true
      this.idProvider = provider.id || ''
      this.initFormProvider(provider)
    }
  }

  public closeDialog(){
    this.isVisibleForm = false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formProvider.reset()
  }

  public onSubmitProvider(event:Event){
    if (this.formProvider.valid) {
      let provider : ProviderDto = {
        name: this.formProvider.value.name,
        phone: this.formProvider.value.phone,
        email: this.formProvider.value.email,
        status: this.formProvider.value.status,
        address: this.formProvider.value.address
      }
      this.listValidateInputs = []
      this.confirmProviderForm(event,provider,this.idProvider)
    }else{
      this.messageErrorForm = 'Tienes campos vacios, verifica por favor'
    }
    }


  private executeSaveProvider(provider:ProviderDto){
    this.providerService.executeSaveProvider(provider).subscribe({
      next:(response)=>{
        this.first = 0; // Vuelve a la primera página
        this.rows = 5;  // Asegura que rows sea 5
        this.formProvider.reset(),
        this.loadProviders()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El proveedor se ha registrado de forma exitosa' });
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
  
  private executeUpdateProvider(idProvider:string, provider:ProviderDto){
    this.providerService.executeupdateProvider(idProvider,provider).subscribe({
      next:(response)=>{
        this.first = 0 // Vuelve a la primera página
        this.rows = 5  // Asegura que rows sea 5
        this.formProvider.reset(),
        this.loadProviders()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El proveedor se actualizo de forma exitosa' });
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

  public confirmProviderForm(event: Event, provider:ProviderDto, idProvider?:string) {
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
          if(idProvider === null || idProvider === '' || idProvider === undefined){
            this.executeSaveProvider(provider)
          }else{
            this.executeUpdateProvider(idProvider, provider)
          }
                
        },
    });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información de proveedor' : 'Ingresa la siguiente información'
  }


  /**
     * TODO: MEOTODOS PARA FILTRAR INFORMACIÓN
     */
  
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
  
    public filterDataTable(provider?: string, status?: string) {
      this.loadProviders(provider, status);
    }
  
    public clearDataFilter() {
      this.loadProviders()
      this.selectedProvider = ''
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
     * TODO: FUCNIONES PARA LISTAS PROVEEDORES
     */
    private executeGetListProviders(page = 0, size = 5, idProvider?:string, status?:string){
      this.providerService.executeListProviders(page,size,idProvider,status).subscribe({
        next: (response)=>{
          this.listProviders = response.content
          this.totalRecords = response.totalElements
          this.loading = false
        },
        error: (error)=>{
          this.loading = false
          this.isVisibleTable = false
          this.listProviders = []
        }
      })
    }
  
    public loadProviders(idProvider?:string, status?:string, event?:TableLazyLoadEvent){
      this.loading = true
      const first = event?.first || 0
      const rows = event?.rows || 5
      const page = first / rows
      const size = rows
      this.executeGetListProviders(page,size,idProvider,status)
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
