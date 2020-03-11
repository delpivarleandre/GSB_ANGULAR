import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service'
import { ModePaiement } from '../interface/modePaiement-interface';
import { FraisForfait } from '../interface/fraisForfait-interface';
import { AuthenticationService } from '../services/authentication.service';
import { LigneFraisForfait } from '../interface/ligneFraisForfait-interace';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { FraisHorsForfait } from '../interface/fraisHorsForfait-interface';

@Component({
  selector: 'app-ajout-frais',
  templateUrl: './ajout-frais.component.html',
  styleUrls: ['./ajout-frais.component.scss']
})
export class AjoutFraisComponent implements OnInit {

  constructor(
    private service: ServiceService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
  ) { }

  formValueCR: FormGroup
  formGroupHorsForfait: FormGroup



  modePaiementOptions: ModePaiement[]
  ligneFraisForfait: LigneFraisForfait[]
  ligneFraisHorsForfait: FraisHorsForfait[]

  ngOnInit() {

    this.formValueCR = this.fb.group({
      ETP: new FormControl,
      KM: new FormControl,
      NUI: new FormControl,
      REP: new FormControl,
    });

    this.formGroupHorsForfait = this.fb.group({
      date : new FormControl,
      libelle : new FormControl,
      montant : new FormControl,
      modePaiement : new FormControl
    })

    this.modePaiementOptions = this.service.modePaiement.filter(r => r);
    this.getLigneFraisForfait()
    this.getLigneFraisHorsForfait()
  }

  getLigneFraisForfait() {
    this.service
      .getLigneFraisForfait(this.auth.getIdLogin())
      .subscribe((data_general: LigneFraisForfait[]) => {
        this.ligneFraisForfait = data_general;
      });
  }

  getLigneFraisHorsForfait() {
    this.service
      .getLigneFraisHorsForfait(this.auth.getIdLogin())
      .subscribe((data_general: FraisHorsForfait[]) => {
        this.ligneFraisHorsForfait = data_general;
        console.log(data_general)
      });
  }

  getvalue() {
    this.service.updateLigneFraisForfait(this.formValueCR.value, this.auth.getIdLogin()).subscribe(() => console.log("update"))
  }

  getHorsForfaitAdd() {
    console.log(this.formGroupHorsForfait.value)
    this.service.addLigneFraisHorsForfait(this.formGroupHorsForfait.value,this.auth.getIdLogin()).subscribe(()=> this.getLigneFraisHorsForfait())
  }
  delete(task: FraisHorsForfait): void {
    this.service
      .deleteFraisHorsForfait(task.id)
      .subscribe(() => this.getLigneFraisHorsForfait())
  }

}
