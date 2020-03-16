import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service';
import { AuthenticationService } from '../services/authentication.service';
import { MoisVisiteur } from '../interface/mois-interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FraisForfaitComplet } from '../interface/fraisForfaitComplet-interface';
import { FraisHorsForfait } from '../interface/fraisHorsForfait-interface';

@Component({
  selector: 'app-voir-fiche-frais',
  templateUrl: './voir-fiche-frais.component.html',
  styleUrls: ['./voir-fiche-frais.component.scss'],
  // providers : { DEFAULT_CURRENCY_CODE, useValue: 'USD'}
})
export class VoirFicheFraisComponent implements OnInit {

  constructor(
    private service: ServiceService,
    public auth: AuthenticationService,
    private fb: FormBuilder, ) { }

  displayedColumns = [
    'LIBELLE',
    'MONTANT',
    'QUANTITE',
    'TOTAL'
  ];
  displayed = [
    'DATE',
    'LIBELLE',
    'MODEPAIEMENT',
    'MONTANT',
  ];

  moisVisiteur: MoisVisiteur[]
  ligneFraisForfaitComplet: FraisForfaitComplet[]
  ligneFraisHorsForfait: FraisHorsForfait[]
  formGroupDate: FormGroup
  itsTrue: boolean
  total : number
  totalFrais : number
  ngOnInit() {
    this.formGroupDate = this.fb.group({
      mois: new FormControl,
    });
    this.getMoisVisiteur()
  }
  getMoisVisiteur() {
    this.service.getMoisVisiteur(this.auth.getIdLogin()).subscribe((data_general: MoisVisiteur[]) => this.moisVisiteur = data_general)
  }
  sendMoisValeur() {
    console.log(this.formGroupDate.value)
    this.itsTrue = true
    this.getLigneFraisForfaitComplet()
    this.getLigneFraisHorsForfait()
  }

  getLigneFraisForfaitComplet() {
    this.service.getLigneFraisForfaitComplet(this.auth.getIdLogin(), this.formGroupDate.value.mois).subscribe(
      (data_general: FraisForfaitComplet[]) => {this.ligneFraisForfaitComplet = data_general;
      this.totalFrais =  this.ligneFraisForfaitComplet.map(t => t.total).reduce((acc, value) => acc + Number(value), 0);
      });
  }

  getLigneFraisHorsForfait() {
    this.service
      .getLigneFraisHorsForfait(this.auth.getIdLogin())
      .subscribe((data_general: FraisHorsForfait[]) => {
        this.ligneFraisHorsForfait = data_general;
        this.total =  this.ligneFraisHorsForfait.map(t => t.montant).reduce((acc, value) => acc + Number(value), 0);

      });
  }
  getTotalCost() {
    return this.total
  }
  getTotalCostFrais() {
    return this.totalFrais
  }
    
}
