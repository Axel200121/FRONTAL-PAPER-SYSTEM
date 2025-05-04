import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'sidebar',
  standalone:true,
  imports: [MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  constructor(public el: ElementRef) {}


}
