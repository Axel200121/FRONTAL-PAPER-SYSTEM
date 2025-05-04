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
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    Dialog,
    InputTextModule,
    SelectModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    AccordionModule
    
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
  public selectedRole: string | undefined;


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

  private executeGetListUser(page = 0, size = 10) {
    this.userService.executeGetListUsers(page, size).subscribe({
      next: (response) => {
        this.listUsers = response.content;
        console.log(this.listUsers);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private executeGetListRoles() {
    this.roleService.executeGetAllRolesBySelect().subscribe({
      next: (response) => {
        this.listRoles = response.data
        console.log(this.listRoles);
      },
      error: (error) => {
        console.log(error);
      },
    });
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
