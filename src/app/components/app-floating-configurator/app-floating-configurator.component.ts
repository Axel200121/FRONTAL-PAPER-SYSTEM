import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfiguratorComponent } from '../app-configurator/app-configurator.component';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-app-floating-configurator',
  imports: [ButtonModule, StyleClassModule, AppConfiguratorComponent],
  templateUrl: './app-floating-configurator.component.html',
  styleUrl: './app-floating-configurator.component.scss'
})
export class AppFloatingConfiguratorComponent {

   // Inyecta el servicio directamente (sin usar this)
   private layoutService = inject(LayoutService);

   // Computed property para el tema oscuro
   isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
 
   // Método para alternar el modo oscuro
   toggleDarkMode() {
     this.layoutService.layoutConfig.update((state) => ({ 
       ...state, 
       darkTheme: !state.darkTheme 
     }));
   }

}
