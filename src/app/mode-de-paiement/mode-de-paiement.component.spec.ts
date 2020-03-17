import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeDePaiementComponent } from './mode-de-paiement.component';

describe('ModeDePaiementComponent', () => {
  let component: ModeDePaiementComponent;
  let fixture: ComponentFixture<ModeDePaiementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeDePaiementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeDePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
