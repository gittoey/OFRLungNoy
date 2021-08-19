import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurianMasterDataComponent } from './durian-master-data.component';

describe('DurianMasterDataComponent', () => {
  let component: DurianMasterDataComponent;
  let fixture: ComponentFixture<DurianMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurianMasterDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurianMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
