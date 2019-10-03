import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

//import { DataStorageService } from '../shared/ds.service';
//import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthAactions from '../auth/store/auth.actions';
import * as RecipeAactions from '../recipes/store/recipe.actions';


@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit,OnDestroy{
    collapsed = true;
    userSub: Subscription;
    isAuthenticated = false;
    
    constructor(private store:Store<fromApp.AppState>){}

    ngOnInit(){
        this.userSub = this.store.select('auth').pipe(
        map(authState => {
            return authState.user;}))
        .subscribe(user =>
            {
                this.isAuthenticated = !!user;
            });
    }

    onSaveData(){
        //this.dataService.storeRecipes();
        this.store.dispatch(new RecipeAactions.StoreRecipes());
    }

    onFetchData(){
        //this.dataService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeAactions.FetchRecipes());
    }

    onLogout(){
        //this.auth.logout();
        this.store.dispatch(new AuthAactions.Logout());
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    
}