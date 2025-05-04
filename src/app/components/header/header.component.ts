import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppFloatingConfiguratorComponent } from '../app-floating-configurator/app-floating-configurator.component';
import { LayoutService } from '../../services/layout.service';
import { AppConfiguratorComponent } from '../app-configurator/app-configurator.component';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfiguratorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  items!: MenuItem[];

  constructor(public layoutService: LayoutService) {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}
