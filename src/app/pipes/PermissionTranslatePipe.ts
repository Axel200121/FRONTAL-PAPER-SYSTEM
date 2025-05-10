import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translatePermission',
})
export class PermissionTranslatePipe implements PipeTransform {
  transform(permissionCode: string): string {
    const translations: Record<string, string> = {
      // Usuarios
      CREATE_USER: 'Crear usuarios',
      READ_USER: 'Ver usuarios',
      UPDATE_USER: 'Editar usuarios',
      DELETE_USER: 'Eliminar usuarios',

      // Roles
      CREATE_ROLE: 'Crear roles',
      READ_ROLE: 'Ver roles',
      UPDATE_ROLE: 'Editar roles',
      DELETE_ROLE: 'Eliminar roles',

      // Permisos
      CREATE_PERMISSION: 'Crear permisos',
      READ_PERMISSION: 'Ver permisos',
      UPDATE_PERMISSION: 'Editar permisos',
      DELETE_PERMISSION: 'Eliminar permisos',

      // Clientes
      CREATE_CUSTOMER: 'Crear clientes',
      READ_CUSTOMER: 'Ver clientes',
      UPDATE_CUSTOMER: 'Editar clientes',
      DELETE_CUSTOMER: 'Eliminar clientes',

      // Categorías
      CREATE_CATEGORY: 'Crear categorías',
      READ_CATEGORY: 'Ver categorías',
      UPDATE_CATEGORY: 'Editar categorías',
      DELETE_CATEGORY: 'Eliminar categorías',

      // Proveedores
      CREATE_PROVIDER: 'Crear proveedores',
      READ_PROVIDER: 'Ver proveedores',
      UPDATE_PROVIDER: 'Editar proveedores',
      DELETE_PROVIDER: 'Eliminar proveedores',

      // Productos
      CREATE_PRODUCT: 'Crear productos',
      READ_PRODUCT: 'Ver productos',
      UPDATE_PRODUCT: 'Editar productos',
      DELETE_PRODUCT: 'Eliminar productos',

      // Ventas
      CREATE_SALE: 'Crear ventas',
      READ_SALE: 'Ver ventas',
      UPDATE_SALE: 'Editar ventas',
      DELETE_SALE: 'Eliminar ventas',

      // Compras
      CREATE_SHOPPING: 'Crear compras',
      READ_SHOPPING: 'Ver compras',
      UPDATE_SHOPPING: 'Editar compras',
      DELETE_SHOPPING: 'Eliminar compras',
    };

    return translations[permissionCode] || permissionCode;
  }
}
