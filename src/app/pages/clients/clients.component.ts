import { Component, OnInit } from '@angular/core';
import { ClientsDto } from '../../interfaces/clients.dto';
import { ClientService } from './service/client.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';

@Component({
  selector: 'app-clients',
  imports: [
    CommonModule,
    ButtonModule,
    Tag,
    TableModule,
    StatusTranslatePipe
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent  implements OnInit{

  //*  variables para el DataTable y su paginación
    public listCustomers!:ClientsDto[]
    public isVisibleTable: boolean = true;
    public totalRecords: number = 0;
    public loading: boolean = false;
    public rows: number = 5;
    public first: number = 0;

    constructor(
      private clientService: ClientService
    ){}

  ngOnInit(): void {
    this.executeListClients()
  }

  /**
   * TODO: METODOS PARA LISTAR CLIENTES
   */

  public executeListClients(page = 0, size = 5){
    this.clientService.executeListClients(page,size).subscribe({
      next:(response)=>{
        this.listCustomers = response.content
        this.totalRecords = response.totalElements
        this.loading = false
      },
      error:(error)=>{
        this.loading = false
        this.isVisibleTable = false
        this.listCustomers = []
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
        this.executeListClients(pageNumber, pageSize);
    }

  public getSeverity(status:string){
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
