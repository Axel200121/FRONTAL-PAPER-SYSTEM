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
            label: 'UI Components',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
            ]
        },
        {
            label: 'Gestion Usuarios',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/landing']
                },
                {
                      label: 'Roles',
                      icon: 'pi pi-fw pi-book',
                      routerLink: ['/pages/crud']
                  },
                  {
                      label: 'Permisos',
                      icon: 'pi pi-fw pi-exclamation-circle',
                      routerLink: ['/pages/notfound']
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
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/landing']
                },
                {
                    label: 'Prodcutos',
                    icon: 'pi pi-fw pi-box',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Invetario',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/pages/notfound']
                },
            ]
        },

        {
            label: 'Gestion Compras',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/pages'],
            items: [
                {
                    label: 'Efectuar compra',
                    icon: 'pi pi-fw pi-shopping-bag',
                    routerLink: ['/landing']
                },
                {
                    label: 'Historico',
                    icon: 'pi pi-fw pi-history',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Proveedores',
                    icon: 'pi pi-fw pi-truck',
                    routerLink: ['/pages/notfound']
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
                    icon: 'pi pi-fw pi-cart-plus',
                    routerLink: ['/landing']
                },
                {
                    label: 'Historico',
                    icon: 'pi pi-fw pi-history',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/pages/notfound']
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
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/landing']
                },
                {
                    label: 'Mi perfil',
                    icon: 'pi pi-fw pi-user',
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