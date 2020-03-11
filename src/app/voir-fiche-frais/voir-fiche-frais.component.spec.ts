import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirFicheFraisComponent } from './voir-fiche-frais.component';

describe('VoirFicheFraisComponent', () => {
  let component: VoirFicheFraisComponent;
  let fixture: ComponentFixture<VoirFicheFraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirFicheFraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirFicheFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
