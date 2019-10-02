import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/Forms';
//import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService} from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private storeSub: Subscription;

  constructor(private authService: AuthService,private router:Router,private store: Store<fromApp.AppState>) { }

  ngOnInit(){
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    //this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    //let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      //authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email,password: password}));
    }else{
      //authObs = this.authService.signup(email,password);
      this.store.dispatch(new AuthActions.SignupStart({email: email,password: password}));
    }
    
    /*
      authObs.subscribe(
        resData => 
        {
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
        errorMessage =>
        {
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    */ 
    form.reset();
  }

  ngOnDestroy(){
    if(this.storeSub){
    this.storeSub.unsubscribe();
    }
  }

}
