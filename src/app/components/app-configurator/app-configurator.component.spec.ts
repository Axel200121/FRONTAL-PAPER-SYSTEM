import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfiguratorComponent } from './app-configurator.component';

describe('AppConfiguratorComponent', () => {
  let component: AppConfiguratorComponent;
  let fixture: ComponentFixture<AppConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
