import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { StatusTranslatePipe } from '../../pipes/StatusTranslatePipe ';
import { SelectModule } from 'primeng/select';
import { ProviderService } from './service/provider.service';
import { ProviderDto } from '../../interfaces/provider.dto';
import { StatusRegisterDto } from '../../interfaces/status.register.dto';
import { ApiResponseDto } from '../../interfaces/api.response.dto';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider',
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
  providers:[MessageService,ConfirmationService],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss'
})
export class ProviderComponent implements OnInit {

  //*  variables para el DataTable y su paginación
  public listProviders!: ProviderDto[];
  public isVisibleTable: boolean = true;
  public totalRecords: number = 0;
  public loading: boolean = false;
  public rows: number = 5;
  public first: number = 0;

  //* Variables para filtrar información
  public listProvidersBySelect!: ProviderDto[]
  public selectedProvider: string = ''
  public selectedStatus: string  = ''
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
          nameKey: 'PENDING',
          name: 'Pediente',
        },
        {
          nameKey: 'DELETED',
          name: 'Eliminado',
        },
    ]
  



  constructor(
    private providerService:ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}



  ngOnInit(): void {
   this.executeGetListProviders()
   this.executeGetProvidersBySelect()
  }


  /**
     * TODO: MEOTODOS PARA FILTRAR INFORMACIÓN
     */
  
    private executeGetProvidersBySelect(){
      this.providerService.executeListProvidersBySelect().subscribe({
        next: (response)=>{
          this.listProvidersBySelect =  response.data
        },
        error:(error)=>{
          const response: ApiResponseDto = error.error;
          this.toast('error', 'Ocurrio un problema!', error.error.description);
        }
      })
    }
  
    public filterDataTable(provider?: string, status?: string) {
      this.loadProviders(provider, status);
    }
  
    public clearDataFilter() {
      this.loadProviders()
      this.selectedProvider = ''
      this.selectedStatus = ''
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

  /**
     * TODO: FUCNIONES PARA LISTAS PROVEEDORES
     */
    private executeGetListProviders(page = 0, size = 5, idProvider?:string, status?:string){
      this.providerService.executeListProviders(page,size,idProvider,status).subscribe({
        next: (response)=>{
          this.listProviders = response.content
          this.totalRecords = response.totalElements
          this.loading = false
        },
        error: (error)=>{
          this.loading = false
          this.isVisibleTable = false
          this.listProviders = []
        }
      })
    }
  
    public loadProviders(idProvider?:string, status?:string, event?:TableLazyLoadEvent){
      this.loading = true
      const first = event?.first || 0
      const rows = event?.rows || 5
      const page = first / rows
      const size = rows
      this.executeGetListProviders(page,size,idProvider,status)
    }
  
  
    public getSeverity(status: string) {
      switch (status) {
  
        case 'ACTIVE':
          return 'success'
  
        case 'INACTIVE':
          return 'info'
  
        case 'PENDING':
          return 'warn'
  
        case 'DELETED':
          return 'danger'
  
        default:
          return null
      }
    }

}
