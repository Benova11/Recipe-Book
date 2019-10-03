import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { AuthResponseData, AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number,
     email: string,
     userid: string,
     token: string
     ) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email,userid,token,expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        id: userid,
        token: token,
        tokenExpirationDate: expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error){
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
            errorMessage = 'This email alraedy exists';
            break;
        
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exists';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'incorrect password';
            break; 
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
   
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.fireBaseAPIkey,
            {email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
            }
        ).pipe(
            tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
                    return handleAuthentication(+resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    );
                }),
            catchError(errorRes => {
                return handleError(errorRes);
            })
        );
    })
);
    
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
            .post<AuthResponseData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.fireBaseAPIkey,
            {   
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                        return handleAuthentication(+resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        );
                    }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        }),

    );

    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS,),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if(authSuccessAction.payload.redirect){

                this.router.navigate(['/']);
            }
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData:{
                    email: string
                    id: string;
                    _token: string;
                    _tokenExpirationDate:Date;
            } = JSON.parse(localStorage.getItem('userData'));
            if(!userData){
                return {type: 'Unsuccess'};
            }
            
            const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
            if(loadedUser.token){
                //this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess(
                    {
                        email: loadedUser.email,
                        id: loadedUser.id,
                        token:loadedUser.token,
                        tokenExpirationDate:new Date(userData._tokenExpirationDate),
                        redirect: false
    
                    });
            }else{
                return {type: 'Unsuccess'};
            }    
        })
    )

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    )

    constructor(private actions$: Actions, private http:HttpClient, private router: Router, private authService: AuthService){}
    
}
