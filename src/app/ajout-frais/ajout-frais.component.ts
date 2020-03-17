import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../services/service'
import { ModePaiement } from '../interface/modePaiement-interface';
import { FraisForfait } from '../interface/fraisForfait-interface';
import { AuthenticationService } from '../services/authentication.service';
import { LigneFraisForfait } from '../interface/ligneFraisForfait-interace';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FraisHorsForfait } from '../interface/fraisHorsForfait-interface';
import { MatSort,  MatDateFormats, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, MatSnackBar } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from 'moment';

export const MY_FORMAT: MatDateFormats = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY"
  }
};

const moment = _moment;
@Component({
  selector: 'app-ajout-frais',
  templateUrl: './ajout-frais.component.html',
  styleUrls: ['./ajout-frais.component.scss'],
  providers : [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE]
  },

  { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT }
],
})


export class AjoutFraisComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private service: ServiceService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }




  displayedColumns = [
    'DATE',
    'LIBELLE',
    'MONTANT',
    'MODEPAIEMENT',
    'BUTTON'
  ];
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
      date: new FormControl,
      libelle: new FormControl,
      montant: new FormControl,
      modePaiement: new FormControl
    })
    // console.log('datasource',this.dataSource)
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
    this.service.updateLigneFraisForfait(this.formValueCR.value, this.auth.getIdLogin()).subscribe(() => {console.log("update");
    this._snackBar.open('Vos frais ont été ajoutés', 'Cancel', {
      duration: 2000,
    });
  })
  }

  getHorsForfaitAdd() {
    console.log(this.formGroupHorsForfait.value)
    this.service.addLigneFraisHorsForfait(this.formGroupHorsForfait.value, this.auth.getIdLogin()).subscribe(() => this.getLigneFraisHorsForfait())
  }
  
  delete(task: FraisHorsForfait): void {
    this.service
      .deleteFraisHorsForfait(task.id)
      .subscribe(() => this.getLigneFraisHorsForfait())
  }
}
