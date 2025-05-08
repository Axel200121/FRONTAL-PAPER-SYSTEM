// status-translate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateStatus' })
export class StatusTranslatePipe implements PipeTransform {
  transform(status: string): string {
    const translations: Record<string, string> = {
        SUSPENDED: 'Suspendido',
        ACTIVE: 'Activo',
        PENDING_ACTIVATION: 'Pendiente de activación',
        INACTIVE: 'Inactivo',
        DELETED: 'Eliminado',
    };
    return translations[status] || status;
  }
}
