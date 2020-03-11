import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { ModePaiement } from '../interface/modePaiement-interface';
import { HttpClient } from '@angular/common/http';
import { Etat } from '../interface/etat-interface';
import { FraisHorsForfait } from '../interface/fraisHorsForfait-interface';
import { LigneFraisForfait } from '../interface/ligneFraisForfait-interace';
import { share } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service'
import { MoisVisiteur } from '../interface/mois-interface';
import { FraisForfaitComplet } from '../interface/fraisForfaitComplet-interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient, public auth: AuthenticationService) { }

  modePaiement = []
  moisVisiteur = []
  ligneFraisForfait = []
  ligneFraisHorsForfait = []
  etat = []
  config = new BehaviorSubject<any>({});
  adress = "" //LOCAL
  // adress = "http://wlfusion03s.priv.birdz.com:5000/" //DEV 
  init() {
    forkJoin(
      this.getModePaiement(),
    ).subscribe(() => {
      this.config.next({
        modePaiement: this.modePaiement,
      })
    })
  }

  getModePaiement(): Observable<ModePaiement[]> {
    const req = this.http.get<ModePaiement[]>(this.adress + 'users/mode_paiement').pipe(share());
    req.subscribe((res => {
      res.forEach((item) => {
        this.modePaiement[item.id] = {
          id: item.id,
          modePaiement: item.modePaiement,
        }
      })
    }));
    return req;
  }

  getEtat(): Observable<Etat[]> {
    return this.http.get<Etat[]>(this.adress + 'users/etat');
  }

  getLigneFraisForfait(idVisiteur): Observable<LigneFraisForfait[]> {
    const req = this.http.get<LigneFraisForfait[]>(this.adress + 'users/ligne_frais_forfait?num=' + idVisiteur).pipe(share());
    req.subscribe((res => {
      res.forEach((item) => {
        this.ligneFraisForfait[item.idfrais] = {
          idfrais: item.idfrais,
          libelle: item.libelle,
          quantite: item.quantite
        }
      })
    }));
    return req;
  }

  getLigneFraisForfaitComplet(idVisiteur,mois): Observable<FraisForfaitComplet[]> {
    const req = this.http.get<FraisForfaitComplet[]>(this.adress + 'users/ligne_frais_forfait_complet?num=' + idVisiteur + '&mois=' + mois).pipe(share());
    req.subscribe((res => {
      res.forEach((item) => {
        this.ligneFraisForfait[item.id] = {
          id: item.id,
          libelle: item.libelle,
          quantite: item.quantite,
          montant : item.montant,
          total : item.total
        }
      })
    }));
    return req;
  }
  getMoisVisiteur(idVisiteur): Observable<MoisVisiteur[]> {
    const req = this.http.get<MoisVisiteur[]>(this.adress + 'users/mois_visiteur?num=' + idVisiteur).pipe(share());
    req.subscribe((res => {
      res.forEach((item) => {
        this.moisVisiteur[item.mois] = {
          mois: item.mois,

        }
      })
    }));
    return req;
  }

  updateLigneFraisForfait(ligneFrais: LigneFraisForfait, idVisiteur): Observable<{}> {
    console.log(JSON.stringify(ligneFrais));
    const body = {
      ligneFrais,
      idVisiteur
    }
    return this.http.put<LigneFraisForfait>(this.adress + 'users/update_frais_forfait', body);
  }

  getLigneFraisHorsForfait(idVisiteur): Observable<FraisHorsForfait[]> {
    const req = this.http.get<FraisHorsForfait[]>(this.adress + 'users/ligne_frais_hors_forfait?num=' + idVisiteur).pipe(share());
    req.subscribe((res => {
      res.forEach((item) => {
        this.ligneFraisHorsForfait[item.id] = {
          date: item.date,
          id : item.id,
          libelle : item.libelle,
          modePaiement : item.modePaiement,
          montant : item.montant,
          paiement : item.paiement,
        }
      })
      console.log(res)
    }
    
    ));
    return req;
  }
  deleteFraisHorsForfait(id: number): Observable<{}> {
    const url = this.adress + `users/delete_hors_forfait/${id}`;
    return this.http.delete(url);
}

addLigneFraisHorsForfait(fraisHorsForfait: FraisHorsForfait, idVisiteur): Observable<{}> {
  console.log(JSON.stringify(fraisHorsForfait));
  const body = {
    fraisHorsForfait,
    idVisiteur
  }
  return this.http.post<LigneFraisForfait>(this.adress + 'users/add_frais_hors_forfait', body);
}
}