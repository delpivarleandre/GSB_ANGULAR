import { Component } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { TokenPayload } from '../interface/tokenPayload-interface';
import { Router } from "@angular/router";

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  credentials: TokenPayload = {
    id : '0' ,
    nom : '0' ,
    prenom : '0' ,
    login : '0' ,
    mdp : '0' ,
    adresse : '0' ,
    cp : '0' ,
    ville : '' ,
    dateEmbauche : 'Date.now()' ,
    daf: 0 ,
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/profile");
      },
      err => {
        console.error(err);
      }
    );
  }
}
