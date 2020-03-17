import { Component } from '@angular/core'
import { AuthenticationService } from '../services/authentication.service'
import { TokenPayload } from '../interface/tokenPayload-interface';
import { Router } from '@angular/router'
import { Validators, FormControl } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
  ]);
  passFormControl = new FormControl('', [
    Validators.required,
  ]);
  credentials: TokenPayload = {
    id : '',
    nom : '',
    prenom : '',
    login : '',
    mdp : '',
    adresse : '',
    cp : '',
    ville : '',
    dateEmbauche : '',
    daf: 0,
  }

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        console.error(err)
      }
    )
  }
}
