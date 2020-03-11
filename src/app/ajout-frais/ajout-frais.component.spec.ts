import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutFraisComponent } from './ajout-frais.component';

describe('AjoutFraisComponent', () => {
  let component: AjoutFraisComponent;
  let fixture: ComponentFixture<AjoutFraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutFraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
