import { Component, OnInit } from '@angular/core';
import { RoleDto } from '../../interfaces/role.dto';
import { RoleService } from './service/role.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { RenameRolesPipe } from '../../pipes/RenameRolesPipe';

@Component({
  selector: 'app-roles',
  imports: [
    ButtonModule,
    TableModule,
    Tag,
    StatusTranslatePipe,
    RenameRolesPipe
  ],
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

  constructor(
    private roleService:RoleService
  ){}

  ngOnInit(): void {
    this.executeListRoles()
  }


  /**
   * TODO: FUNCIONALIDAD PARA LISTAR ROLES
   */

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
