import { Component } from '@angular/core';
import { WidgetComponent } from './components/widget/widget.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    WidgetComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
