import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionDto } from '../../interfaces/permission.dto';
import { FormGroup } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PermissionService } from './service/permission.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';

@Component({
  selector: 'app-permissions',
  imports: [
    CommonModule,
    StatusTranslatePipe,
    ButtonModule,
    Tag,
    TableModule
  ],
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

  constructor(
    private permissionService:PermissionService
  ){}


  ngOnInit(): void {
    this.executeListPermissions()
  }

  /**
   * TODO: METODOS PARA LISTAR Y FILTRAR INFORMACIÓN
   */

  public executeListPermissions(page = 0, size = 5, status?:string, idPermission?:string){
    this.permissionService.executeListPermissions(page,size).subscribe({
      next:(response)=>{
        this.listPermissions = response.content
        console.log("list permission", this.listPermissions)
        this.totalRecords = response.totalElements
        this.loading = false
        console.log("data", response)
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

  
}
