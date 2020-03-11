import { Component } from '@angular/core'
import { AuthenticationService } from '../services/authentication.service'
import { TokenPayload } from '../interface/tokenPayload-interface';
import { Router } from '@angular/router'

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
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
