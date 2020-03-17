import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service';
import { ModePaiement } from '../interface/modePaiement-interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-mode-de-paiement',
  templateUrl: './mode-de-paiement.component.html',
  styleUrls: ['./mode-de-paiement.component.scss']
})
export class ModeDePaiementComponent implements OnInit {

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
  ) { }

  editPaiement: ModePaiement
  modeDePaiement: ModePaiement[]
  formGroupPaiement: FormGroup
  displayedColumns = [
    'MODEPAIEMENT',
    'BUTTON'
  ]

  ngOnInit() {
    this.formGroupPaiement = this.fb.group({
      paiementName: new FormControl('',
        Validators.required),
    });

    this.modeDePaiement = this.service.modePaiement.filter(r => r);
    console.log(this.modeDePaiement)
  }

  getPaiementAdd() {
    this.service.addModePaiement(this.formGroupPaiement.value).subscribe(() => this.getModePaiement())
  }

  getModePaiement() {
    this.service.getModePaiement().subscribe((data_general: ModePaiement[]) => this.modeDePaiement = data_general)
  }

  delete(task: ModePaiement): void {
    this.service
      .deleteModePaiement(task.id)
      .subscribe(() => this.getModePaiement())
  }

  edit(task) {
    console.log(task)
    this.editPaiement = task;
  }

  update() {
    if (this.editPaiement) {
        console.log("editTask: ", this.editPaiement.modePaiement)
        this.service.updatePaiement(this.editPaiement).subscribe(() => {
            this.getModePaiement()
            this.editPaiement = undefined
        })
    }
  }
}
