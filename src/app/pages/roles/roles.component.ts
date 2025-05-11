import { Component, OnInit } from '@angular/core';
import { RoleDto } from '../../interfaces/role.dto';
import { RoleService } from './service/role.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { RenameRolesPipe } from '../../pipes/RenameRolesPipe';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PermissionDto } from '../../interfaces/permission.dto';
import { PermissionService } from '../permissions/service/permission.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { Checkbox } from 'primeng/checkbox';
import { PermissionTranslatePipe } from '../../pipes/PermissionTranslatePipe';

@Component({
  selector: 'app-roles',
  imports: [
    ButtonModule,
    TableModule,
    Tag,
    StatusTranslatePipe,
    RenameRolesPipe,
    PermissionTranslatePipe,

    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    ConfirmDialog,
    SelectModule,
    InputTextModule,
    AccordionModule,
    Checkbox
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  //* variables para dataTable y paginación
  public listRoles!: RoleDto[]
  public isVisibleTable: boolean = true
  public totalRecords : number = 0
  public loading: boolean = false
  public rows: number = 5
  public first: number = 0

  //* variables para formulario
  public isEditForm: boolean = false
  private idRol : string  = ''
  public formRol!:FormGroup
  public isVisibleForm: boolean = false
  public listPermissions!:PermissionDto []
  public selectedPermissions: string[] = [];

  //* variables para validación de formulario
  public listValidateInputs: ValidateInputDto [] = []
  public messageErrorForm : string  = ''
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
    private roleService:RoleService,
    private permissionService:PermissionService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.executeListRoles()
    this.executeListPermissions()
    this.initFormRol()

  }


  /**
   * TODO: FUNAICONALIDAD PARA AGREGAR O EDITAR ROL
   */

  private initFormRol(roleDto?: RoleDto) {
  this.formRol = this.formBuilder.group({
    name: [roleDto?.name || '', [Validators.required]],
    description: [roleDto?.description || '', [Validators.required]],
    status: [roleDto?.status || '', [Validators.required]],
    permissions: this.formBuilder.array(  // Nombre corregido
      roleDto?.permissions?.map(p => this.formBuilder.control(p)) || [],
      [Validators.required]
    )
  });
}

  
  
  

  public showModalForm(roleDto?:RoleDto){
    this.isVisibleForm = true
    if (roleDto === undefined || roleDto === null) {
      this.isEditForm =  false
      this.formRol.reset()
    }else{
      this.isEditForm = true
      this.idRol = roleDto.id || ''
      this.initFormRol(roleDto)
    }
  }

  public clseModalForm(){
    this.isVisibleForm = false
    this.listValidateInputs = []
    this.messageErrorForm = ''
    this.formRol.reset()
  }

  public onSubmitRole(event:Event){
    if (this.formRol.valid) {
      let roleDto : RoleDto = {
        name:this.formRol.value.name,
        description:this.formRol.value.description,
        status:this.formRol.value.status,
        permissions: this.formRol.value.permissions
      }
      console.log("dto a enviar", roleDto)
      this.listValidateInputs = []
    }else{
      this.messageErrorForm = 'Tienas campos vacios, verifica por favor'
    }
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información del rol' : 'Ingresa la siguiente información'
  }



  /**
   * TODO: FUNCIONALIDAD PARA LISTAR ROLES
   */

  private executeListPermissions(){
    this.permissionService.executeListPermissionsBySelect().subscribe({
      next:(response)=>{
        this.listPermissions =response.data
      },
      error:(error)=>{

      }
    })
  }

  private executeListRoles(page = 0, size = 5, role?:string, status?:string){
    this.roleService.executeGetListRoles(page,size,role,status).subscribe({
      next:(response)=>{
        this.listRoles = response.content
        this.totalRecords = response.totalRecords
        this.loading = false
      },
      error:(error)=>{
        this.loading = false
        this.isVisibleTable = false
        this.listRoles = []
      }
    })
  }

  public loadRoles(status?:string, role?:string, event?:TableLazyLoadEvent){
    this.loading = true
    const first = event?.first || 0;
    const rows = event?.rows || 5; // Asume 10 filas por defecto
    const pageNumber = first / rows; // Cálculo seguro
    const pageSize = rows;
    this.executeListRoles(pageNumber,pageSize,role,status)
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


}
