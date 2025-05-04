import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFloatingConfiguratorComponent } from './app-floating-configurator.component';

describe('AppFloatingConfiguratorComponent', () => {
  let component: AppFloatingConfiguratorComponent;
  let fixture: ComponentFixture<AppFloatingConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFloatingConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFloatingConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
