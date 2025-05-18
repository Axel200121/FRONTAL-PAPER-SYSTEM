// status-translate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateStatus' })
export class StatusTranslatePipe implements PipeTransform {
  transform(status: string): string {
    const translations: Record<string, string> = {
        SUSPENDED: 'Suspendido',
        ACTIVE: 'Activo',
        PENDING_ACTIVATION: 'Pendiente de activación',
        PENDING_VERIFICATION: 'Pendiente de verificación',
        PENDING: 'Pendiente',
        INACTIVE: 'Inactivo',
        DELETED: 'Eliminado',
        BLOCKED: 'Bloqueado',

        //status product 
        OUT_OF_STOCK:'Agotado',
        PENDING_REPLENISHMENT:'Pendiente de reposición',
        DISCOUNTED:'Descontado',
        WITHDRAWN:'Retirado',
        IN_PRODUCTION:'En producción',
        IN_TRANSIT:'En transito',
    };
    return translations[status] || status;
  }
}
