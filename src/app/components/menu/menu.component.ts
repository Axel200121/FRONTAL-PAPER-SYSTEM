import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone:true,
  imports: [CommonModule, MenuitemComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  model: MenuItem[] = [];

  ngOnInit() {
      this.model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
            ]
        },
        {
            label: 'Gestion Usuarios',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/home/users']
                },
                {
                      label: 'Roles',
                      icon: 'pi pi-fw pi-pencil',
                      routerLink: ['/home/roles']
                  },
                  {
                      label: 'Permisos',
                      icon: 'pi pi-fw pi-exclamation-circle',
                      routerLink: ['/home/permissions']
                  },
              ]
          },
        {
            label: 'Gestion Productos',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Categorias',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/home/categories']
                },
                {
                    label: 'Prodcutos',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Invetario',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/pages/notfound']
                },
            ]
        },

        {
            label: 'Gestion Compras',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Efectuar compra',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing']
                },
                {
                    label: 'Historico',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Proveedores',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/home/providers']
                },
            ]
        },

        {
            label: 'Gestion Ventas',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Efectuar venta',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing']
                },
                {
                    label: 'Historico',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/home/clients']
                },
            ]
        },

        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Auditiar Sistema',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing']
                },
                {
                    label: 'Mi perfil',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-fw pi-sign-out',
                    routerLink: ['/pages/notfound']
                },
            ]
        },
    ];
}
}