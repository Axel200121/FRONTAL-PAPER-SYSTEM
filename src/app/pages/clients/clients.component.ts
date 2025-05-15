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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      nameKey: 'DELETED',
      name: 'Eliminado',
    },
    {
      nameKey: 'PENDING',
      name: 'Pendiente',
    },
  ];

  //** */

  constructor(
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.executeListClients();
    this.executeListClientsBySelect();
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
