import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserDto } from '../../interfaces/user.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-users',
  standalone:true,
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
    StatusTranslatePipe,
    RenameRolesPipe
    
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  public listUsers!: UserDto[]
  public listRoles!:RoleDto[]
  public userDialog: boolean = false
  public formUser!:FormGroup
  public visible: boolean = false


  //variables para la paginacion
  public totalRecords: number = 0
  public loading: boolean = false
  public rows: number = 5
  public first: number = 0

  //Variables para filtros
  public selectFilterRole: string = ''
  public selectFilterStatus:string = ''
  public textFilter:string = ''

  //variable visbilidad table
  public isVisibleTable:boolean = true

  // crear dto de los status
  public listStatus: StatusUserDto [] = [
    {
      nameKey:"ACTIVE",
      name:"Activado"
    },
    {
      nameKey:"INACTIVE",
      name:"Inactivo"
    },
    {
      nameKey:"SUSPENDED",
      name:"Suspendido"
    },
    {
      nameKey:"SUSPENDED",
      name:"Suspendido"
    },
    {
      nameKey:"PENDING_ACTIVATION",
      name:"Pendiente de Activación"
    },
    {
      nameKey:"DELETED",
      name:"Eliminado"
    },

  ]


  @ViewChild('dt') dt!: Table;
  public initialTableValue!: UserDto[];
  public isSorted: any = null;


  constructor(
    private userService: UserService,
    private roleService:RoleService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.executeGetListUser()
    this.executeGetListRoles()
    this.initFormUser()
  }

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

  private executeGetListUser(status?:string, role?:string, page = 0, size = 10) {
    this.userService.executeGetListUsers(page, size, role, status).subscribe({
      next: (response) => {
        this.listUsers = response.content;
        this.totalRecords = response.totalElements // Total de registros
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        this.isVisibleTable = false
        this.listUsers = []
        console.log(error);
      },
    });
  }

  public loadUsers(status?:string, role?:string, event?: TableLazyLoadEvent) {
    this.loading = true;
    // Valores por defecto si event.first o event.rows son undefined
    const first = event?.first || 0;
    const rows = event?.rows || 5; // Asume 10 filas por defecto
    const pageNumber = first / rows; // Cálculo seguro
    const pageSize = rows;
    this.executeGetListUser(status, role, pageNumber,pageSize)
}

public filterDataTable(status?:string, role?:string){
  console.log("valor status", status)
  console.log("valor role", role)
  this.loadUsers(status,role)
}

public clearDataFilter(){
  this.loadUsers(),
  this.selectFilterStatus = ''
  this.selectFilterRole = ''
}

  private executeGetListRoles() {
    this.roleService.executeGetAllRolesBySelect().subscribe({
      next: (response) => {
        this.isVisibleTable=true
        this.listRoles = response.data
        console.log(this.listRoles);
      },
      error: (error) => {
        this.isVisibleTable=false
        console.log(error);
      },
    });
  }

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

    showDialog() {
        this.visible = true;
    }


    /**
     * FUNCIONAES PARA TABLE
     */


    public editProduct(){}
    public deleteProduct(){}

}
