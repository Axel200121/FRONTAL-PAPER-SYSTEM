import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserDto } from '../../interfaces/user.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from './services/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { RoleDto } from '../../interfaces/role.dto';
import { RoleService } from '../../services/role.service';
import { SelectModule } from 'primeng/select';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AccordionModule } from 'primeng/accordion';
import { StatusUserDto } from '../../interfaces/status.user.dto';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { RenameRolesPipe } from '../../pipes/RenameRolesPipe';
import { ValidateInputDto } from '../../interfaces/validate.input.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    Dialog,
    InputTextModule,
    SelectModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    AccordionModule,
    Tag,
    ToastModule,
    ConfirmDialog,
    PasswordModule,
    StatusTranslatePipe,
    RenameRolesPipe,
  ],
  providers:[
    ConfirmationService,
    MessageService
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  // Inicializar lista para tabla usuarios y select roles
  public listUsers!: UserDto[];
  public listRoles!: RoleDto[];

  // variables para formulario
  public isEditForm : boolean = false
  public idUser:string = ''
  public formUser!: FormGroup;
  public visible: boolean = false;

  //variables para la paginacion
  public totalRecords: number = 0;
  public loading: boolean = false;
  public rows: number = 5;
  public first: number = 0;

  //Variables para filtros
  public selectFilterRole: string = '';
  public selectFilterStatus: string = '';
  public textFilter: string = '';

  //variable visbilidad table
  public isVisibleTable: boolean = true;

  // variables lista de errorer parametros
  public listValidateInputs: ValidateInputDto[] = []
  public messageError:string = ''
  // crear dto de los status
  public listStatus: StatusUserDto[] = [
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
      nameKey: 'SUSPENDED',
      name: 'Suspendido',
    },
    {
      nameKey: 'PENDING_ACTIVATION',
      name: 'Pendiente de Activación',
    },
    {
      nameKey: 'DELETED',
      name: 'Eliminado',
    },
  ];

  @ViewChild('dt') dt!: Table;
  public initialTableValue!: UserDto[];
  public isSorted: any = null;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.executeGetListUser();
    this.executeGetListRoles();
    this.initFormUser();
  }

  /**
   * TODO: METODOS PARA LISTAR Y FILTRAR INFORMACIÓN
   */
  private executeGetListRoles() {
    this.roleService.executeGetAllRolesBySelect().subscribe({
      next: (response) => {
        this.isVisibleTable = true;
        this.listRoles = response.data;
      },
      error: (error) => {
        this.isVisibleTable = false;
      },
    });
  }

  private executeGetListUser(status?: string,role?: string,page = 0,size = 10) {
    this.userService.executeGetListUsers(page, size, role, status).subscribe({
      next: (response) => {
        this.listUsers = response.content;
        this.totalRecords = response.totalElements; // Total de registros
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.isVisibleTable = false;
        this.listUsers = [];
      },
    });
  }

  public loadUsers(status?: string, role?: string, event?: TableLazyLoadEvent) {
    this.loading = true;
    // Valores por defecto si event.first o event.rows son undefined
    const first = event?.first || 0;
    const rows = event?.rows || 5; // Asume 10 filas por defecto
    const pageNumber = first / rows; // Cálculo seguro
    const pageSize = rows;
    this.executeGetListUser(status, role, pageNumber, pageSize);
  }

  public filterDataTable(status?: string, role?: string) {
    this.loadUsers(status, role);
  }

  public clearDataFilter() {
    this.loadUsers(), (this.selectFilterStatus = '');
    this.selectFilterRole = '';
  }


  /**
   * TODO: METODO PARA LOS TAG DE LOS STATUS
   */

  public getSeverity(status: string) {
    switch (status) {
      case 'SUSPENDED':
        return 'danger';

      case 'ACTIVE':
        return 'success';

      case 'PENDING_ACTIVATION':
        return 'warn';

      case 'INACTIVE':
        return 'info';

      case 'ALMACENERO':
        return null;

      default:
        return null;
    }
  }

  /**
   * TODO: METODOS PARA AGREGAR O ACTUALIZAT REGISTRO
   */

  private initFormUser() {
    this.formUser = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  public showDialog(userDto?: UserDto) {
    this.visible = true;
    if(userDto === undefined || userDto === null){
      this.isEditForm = false
      this.formUser.reset()
    }else{
      this.isEditForm = true
      this.idUser = userDto.id || ''
      console.log("user pae edit", userDto)
      this.formUser = this.formBuilder.group({
        name: [userDto.name || '', [Validators.required]],
        lastname: [userDto.lastName || '', [Validators.required]],
        phone: [userDto.phone || '', [Validators.required]],
        email: [userDto.email || '', [Validators.required]],
        password: ['', [Validators.required]],
        confirmpassword: ['', [Validators.required]],
        address: [userDto.address || '', [Validators.required]],
        role: [userDto.role?.id || '', [Validators.required]],
      });
    }
  }

  public closeDialog(){
    this.visible=false
    this.listValidateInputs = []
    this.messageError = ''
    this.formUser.reset()
  }

  public onSubmitUser(event: Event){
    if (this.formUser.valid) {
      let role: RoleDto={
        id:this.formUser.value.role
      }

      let user: UserDto = {
        name: this.formUser.value.name,
        lastName: this.formUser.value.lastname,
        password: this.formUser.value.password,
        confirmPassword: this.formUser.value.confirmpassword,
        phone: this.formUser.value.phone,
        email: this.formUser.value.email,
        address: this.formUser.value.address,
        role: role
      }
      this.listValidateInputs=[]
      this.confirmUserForm(event, user, this.idUser)
    } else {
      this.messageError = 'Tienes campos vacios, verifica por favor'
    }
  }

  private executeSaveUser(userDto:UserDto){
    this.userService.executeSaveUser(userDto).subscribe({
      next:(response)=>{
        this.formUser.reset()
        this.loadUsers()
        this.closeDialog()
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        if (response.statusCode === 400 && response.message === "Campos invalidos"){
          this.listValidateInputs = response.data
        } else if(response.statusCode === 400){
          this.messageError = response.message
        }
        if (error.error.status === 500) {
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      }
    })
  }

  private executeUpdateUser(idUser:string, userDto:UserDto){
    this.userService.executeUpdateUser(idUser, userDto).subscribe({
      next:(response)=>{
        this.formUser.reset()
        this.loadUsers()
        this.closeDialog()
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        if (response.statusCode === 400 && response.message === "Campos invalidos"){
          this.listValidateInputs = response.data
        } else if(response.statusCode === 400){
          this.messageError = response.message
        }
        if (error.error.status === 500) {
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      }
    })
  }

  public confirmUserForm(event: Event, userDto:UserDto, idUser?:string) {
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
          if(idUser === null || idUser === '' || idUser === undefined){
            this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El usuario se ha registrado de forma exitosa' });
            this.executeSaveUser(userDto)
          }else{
            this.messageService.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El usuario se actualizo de forma exitosa' });
            this.executeUpdateUser(idUser, userDto)
          }
            
        },
    });
  }

  private toast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
    setTimeout
  }

  /**
   * TODO: FUNCIONAES PARA ELIMIANR USUARIOS
   */
  

  private executeDeleteUser(idUser:string){
    this.userService.executeDeleteUser(idUser).subscribe({
      next:(response)=>{
        this.loadUsers()
      },
      error:(error)=>{
        const response:ApiResponseDto = error.error
        this.toast('error', 'Ocurrio un problema!', error.error.description);
      }
    })
  }

  public confirmDeleteUser(event: Event, idUser:string) {
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
            this.messageService.add({ severity: 'success', summary: 'Usuario eliminado', detail: 'El usuario ha sido eliminado correctamente' });
            this.executeDeleteUser(idUser)
        },
    });
  }

  public getMessageForm(){
    return this.isEditForm ? 'Edita la información del usuario' : 'Ingresa la sigueinte información'
  }

}
