import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietiesComponent } from './varieties.component';

describe('VarietiesComponent', () => {
  let component: VarietiesComponent;
  let fixture: ComponentFixture<VarietiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
