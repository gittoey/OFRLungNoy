import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareDurianComponent } from './compare-durian.component';

describe('CompareDurianComponent', () => {
  let component: CompareDurianComponent;
  let fixture: ComponentFixture<CompareDurianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareDurianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareDurianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
