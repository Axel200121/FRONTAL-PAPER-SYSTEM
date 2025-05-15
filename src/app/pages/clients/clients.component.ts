import { Component, OnInit } from '@angular/core';
import { ClientsDto } from '../../interfaces/clients.dto';
import { ClientService } from './service/client.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { Toast, ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-clients',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    Tag,
    TableModule,
    StatusTranslatePipe,
    SelectModule,

    ToastModule,
    Dialog,
    InputTextModule,
    ConfirmDialog
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {

  //*  variables para el DataTable y su paginación
  public listCustomers!: ClientsDto[];
  public isVisibleTable: boolean = true;
  public totalRecords: number = 0;
  public loading: boolean = false;
  public rows: number = 5;
  public first: number = 0;

  //* Variables filtrar información
  public listClientsBySelect!: ClientsDto[];
  public selectedClient: string = '';
  public selectedStatus: string = '';
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
      nameKey: 'SUSPENDED',
      name: 'Suspendido',
    },
    {
      nameKey: 'PENDING_VERIFICATION',
      name: 'Pediente de verificación',
    },
    {
      nameKey: 'DELETED',
      name: 'Eliminado',
    },
    {
      nameKey: 'BLOCKED',
      name: 'Bloqueado',
    },
  ]

  //* Variables para formulario
  public isEditForm : boolean = false
  public idClient : string  = ''
  public formClient!:FormGroup
  public isVisibleForm: boolean = false

  public listValidateInputs: ValidateInputDto[]=[]
  public messageErrorForm : string = ''

  constructor(
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.executeListClients();
    this.executeListClientsBySelect();
    this.initFormClient()
  }

  /**
   * TODO: METODOS PARA AGREGA O ACTUALIZAR CLIENTES
   */
  private initFormClient(clientDto?:ClientsDto){
    this.formClient = this.formBuilder.group({
      fullname:[clientDto?.fullName || '', [Validators.required]],
      phone:[clientDto?.phone || '', [Validators.required]],
      email:[clientDto?.email || '', [Validators.required]],
      status:[clientDto?.status || '', [Validators.required]],
      address:[clientDto?.address || '', [Validators.required]]
    })
  }

  public showFormModal(clientDto?:ClientsDto){
    this.isVisibleForm = true
    if (clientDto === undefined || clientDto === null) {
      this.isEditForm = false
      this.formClient.reset()
    }else{
      this.isEditForm = true
      this.idClient = clientDto.id || ''
      this.initFormClient(clientDto)
    }
  }

  public closeDialog(){
    this.isVisibleForm = false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formClient.reset()
  }

  public onSubmitPermission(event:Event){
    if (this.formClient.valid) {
      let client: ClientsDto = {
        fullName: this.formClient.value.fullname,
        phone: this.formClient.value.phone,
        email: this.formClient.value.email,
        status: this.formClient.value.status,
        address: this.formClient.value.address
      }
      this.listValidateInputs = []
      this.confirmPermissionForm(event,client,this.idClient)
    }else{
      this.messageErrorForm = 'Tienes campos vacios, verifica por favor'
    }
    }


  private executeSaveClient(client:ClientsDto){
    this.clientService.executeSaveClient(client).subscribe({
      next:(response)=>{
        this.first = 0; // Vuelve a la primera página
        this.rows = 5;  // Asegura que rows sea 5
        this.formClient.reset(),
        this.loadPermissions()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El cliente se ha registrado de forma exitosa' });
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
  
  private executeUpdateClient(idClient:string, client:ClientsDto){
    this.clientService.executeupdateClient(idClient,client).subscribe({
      next:(response)=>{
        this.first = 0 // Vuelve a la primera página
        this.rows = 5  // Asegura que rows sea 5
        this.formClient.reset(),
        this.loadPermissions()
        this.closeDialog()
        this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El cliente se actualizo de forma exitosa' });
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

  public confirmPermissionForm(event: Event, client:ClientsDto, idClient?:string) {
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
          if(idClient === null || idClient === '' || idClient === undefined){
            this.executeSaveClient(client)
          }else{
            this.executeUpdateClient(idClient,client)
          }
                
        },
    });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información del usuario' : 'Ingresa la siguiente información'
  }


  /**
   * TODO: METODOS PARA LISTAR CLIENTES
   */

  public executeListClients(page = 0,size = 5,idClient?: string,status?: string) {
    this.clientService.executeListClients(page, size, idClient, status).subscribe({
      next: (response) => {
        this.listCustomers = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.isVisibleTable = false;
        this.listCustomers = [];
      },
    });
  }

  public loadPermissions(status?: string,idClient?: string,event?: TableLazyLoadEvent) {
    this.loading = true;
    // Valores por defecto si event.first o event.rows son undefined
    const first = event?.first || 0;
    const rows = event?.rows || 5; // Asume 10 filas por defecto
    const pageNumber = first / rows; // Cálculo seguro
    const pageSize = rows;
    this.executeListClients(pageNumber, pageSize, idClient, status);
  }

  public getSeverity(status: string) {
    switch (status) {

      case 'ACTIVE':
        return 'success'

      case 'INACTIVE':
        return 'secondary'

      case 'SUSPENDED':
        return 'info'

      case 'PENDING_VERIFICATION':
        return 'warn'

      case 'DELETED':
        return 'danger'

      case 'BLOCKED':
        return 'contrast'

      default:
        return null
    }
  }

  /**
   * TODO: METODOS PARA FILTRAR INFORMACIÓN
   */
  public executeListClientsBySelect() {
    this.clientService.executeListClientsBySelect().subscribe({
      next: (response) => {
        this.listClientsBySelect = response.data;
      },
      error: (error) => {
        const response: ApiResponseDto = error.error;
        this.toast('error', 'Ocurrio un problema!', error.error.description);
      },
    });
  }

  public filterDataTable(status?: string, permission?: string) {
    this.loadPermissions(status, permission);
  }

  public clearDataFilter() {
    this.loadPermissions(), (this.selectedClient = '');
    this.selectedStatus = '';
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
}
