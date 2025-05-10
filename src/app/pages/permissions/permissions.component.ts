import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionDto } from '../../interfaces/permission.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PermissionService } from './service/permission.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { StatusUserDto } from '../../interfaces/status.user.dto';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { PermissionTranslatePipe } from '../../pipes/PermissionTranslatePipe';

@Component({
  selector: 'app-permissions',
  imports: [
    CommonModule,
    StatusTranslatePipe,
    PermissionTranslatePipe,
    ButtonModule,
    Tag,
    TableModule,
    //dependencias form
    ReactiveFormsModule,
    Dialog,
    InputTextModule,
    SelectModule,
    FormsModule,
    ToastModule,
    ConfirmDialog
  ],
  providers:[ConfirmationService,MessageService],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent implements OnInit {

  //*  variables para el DataTable y su paginación
  public listPermissions!:PermissionDto[]
  public isVisibleTable: boolean = true;
  public totalRecords: number = 0;
  public loading: boolean = false;
  public rows: number = 5;
  public first: number = 0;


  //* variables para formulario
  public isEditForm : boolean = false
  private idPermission : string  = ''
  public formPermission!: FormGroup
  public isVisibleForm : boolean = false

  //* variables para validdacion de formulario
  public listValidateInputs:ValidateInputDto[] = []
  public messageErrorForm : string  = ''

  //* Lista para Filtros
  
  public lsitPermissionsBySelect!:PermissionDto[]
  public selectedPermisison : string = ''
  public selectedStatus : string = ''
  public listStatus: StatusRegisterDto[] = [
    {
      nameKey:'ACTIVE',
      name: 'Activado'
    },
    {
      nameKey:'INACTIVE',
      name: 'Inactivo'
    },
    {
      nameKey:'DELETED',
      name: 'Eliminado'
    },
    {
      nameKey:'PENDING',
      name: 'Pendiente'
    },
  ]


  constructor(
    private permissionService:PermissionService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ){}


  ngOnInit(): void {
    this.executeListPermissions()
    this.initFormPermission()
    this.executeListPermissionBySelect()
  }

  /**
   * TODO: METODOS PARA LISTAR Y FILTRAR INFORMACIÓN
   */

  public executeListPermissions(page = 0, size = 5, status?:string, idPermission?:string){
    this.permissionService.executeListPermissions(page,size,status,idPermission).subscribe({
      next:(response)=>{
        this.listPermissions = response.content
        this.totalRecords = response.totalElements
        this.loading = false
      },
      error:(error)=>{
        console.error(error)
        this.loading = false
        this.isVisibleTable = false
        this.listPermissions = []
      }
    })
  }

  public loadPermissions(status?: string, permission?: string, event?: TableLazyLoadEvent) {
      this.loading = true;
      // Valores por defecto si event.first o event.rows son undefined
      const first = event?.first || 0;
      const rows = event?.rows || 5; // Asume 10 filas por defecto
      const pageNumber = first / rows; // Cálculo seguro
      const pageSize = rows;
      this.executeListPermissions(pageNumber, pageSize, status, permission);
  }

  public getSeverity(status: string) {
    switch (status) {
      case 'SUSPENDED':
        return 'danger';

      case 'ACTIVE':
        return 'success';

      case 'INACTIVE':
        return 'warn';

      case 'DELETED':
        return 'danger';

      case 'PENDING':
        return 'info';

      default:
        return null;
    }
  }

  /**
   * TODO: METODOS PARA AGREGAR O ACTUALIZAT REGISTRO
   */
  private initFormPermission(permissionDto?:PermissionDto){
    this.formPermission = this.formBuilder.group({
      name :[permissionDto?.name || '', [Validators.required]],
      description: [permissionDto?.description || '', [Validators.required]],
      status:[permissionDto?.status  || '', [Validators.required]]
    })
  }

  public showFormModal(permissionDto?:PermissionDto){
    this.isVisibleForm=true
    if (permissionDto === undefined || permissionDto === null) {
      this.isEditForm = false,
      this.formPermission.reset()
    }else{
      this.isEditForm = true
      this.idPermission = permissionDto.id || ''
      this.initFormPermission(permissionDto)
    }
  }

  public closeDialog(){
    this.isVisibleForm=false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formPermission.reset()
  }

  public onSubmitPermission(event:Event){
    if (this.formPermission.valid) {
      let permission: PermissionDto = {
        name: this.formPermission.value.name,
        description: this.formPermission.value.description,
        status: this.formPermission.value.status
      }
      this.listValidateInputs = []
      this.confirmPermissionForm(event,permission,this.idPermission)
    }else{
      this.messageErrorForm = 'Tienes campos vacios, verifica por favor'
    }
  }

  private executeSavePermission(permission:PermissionDto){
    this.permissionService.executeSavePermission(permission).subscribe({
      next:(response)=>{
        this.first = 0; // Vuelve a la primera página
        this.rows = 5;  // Asegura que rows sea 5
        this.formPermission.reset(),
        this.loadPermissions()
        this.closeDialog()
        
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El permiso se ha registrado de forma exitosa' });
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

  private executeUpdateUser(idPermission:string, permission:PermissionDto){
      this.permissionService.executeUpdatePermission(idPermission,permission).subscribe({
        next:(response)=>{
          this.first = 0 // Vuelve a la primera página
          this.rows = 5  // Asegura que rows sea 5
          this.formPermission.reset(),
          this.loadPermissions()
          this.closeDialog()
          this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El permiso se actualizo de forma exitosa' });
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


  public confirmPermissionForm(event: Event, permissionDto:PermissionDto, idPermission?:string) {
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
            if(idPermission === null || idPermission === '' || idPermission === undefined){
              this.executeSavePermission(permissionDto)
            }else{
              this.executeUpdateUser(idPermission,permissionDto)
            }
              
          },
      });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información del usuario' : 'Ingresa la sigueinte información'
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
    setTimeout
  }

  /**
   * TODO: FUNCIONES PARA ELIMINAR
   */
  private executeDeletePermission(id:string){
    this.permissionService.executeDeletePermission(id).subscribe({
      next:(response)=>{
        this.first = 0 // Vuelve a la primera página
        this.rows = 5
        this.loadPermissions()
        this.messageService.add({ severity: 'success', summary: 'Permiso eliminado', detail: 'Permiso eliminado correctamente' });

      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        this.toast('error', 'Ocurrio un problema!', error.error.description);
      }
    })
  }

  public confirmDeletePermission(event: Event, id:string) {
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
            this.executeDeletePermission(id)
        },
    });
  }

  /**
   * TODO: FUNCIONES PARA FILTRAR INFORMACIÓN
   */

  public executeListPermissionBySelect(){
    this.permissionService.executeListPermissionsBySelect().subscribe({
      next : (response)=>{
        this.lsitPermissionsBySelect = response.data
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        this.toast('error', 'Ocurrio un problema!', error.error.description);
      }
    })
  }

  public filterDataTable(status?: string, permission?: string) {
    this.loadPermissions(status, permission);
  }

  public clearDataFilter() {
    this.loadPermissions(),
    this.selectedPermisison = ''
    this.selectedStatus = ''
  }

  
}
