// rename-roles.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'renameRoles' })
export class RenameRolesPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    // Paso 1: Reemplazar guiones bajos por espacios
    const withSpaces = value.replace(/_/g, ' ');

    // Paso 2: Convertir a minúsculas y capitalizar cada palabra
    return withSpaces.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}