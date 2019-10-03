import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { ofType, Actions } from '@ngrx/effects';
import { take, switchMap, map } from 'rxjs/operators';
import { pipe, of } from 'rxjs';

import { Recipe } from './recipe.model';
;;import { DataStorageService } from '../shared/ds.service';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private store: Store<fromApp.AppState>,private actions$: Actions,private recipeService: RecipeService){}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
        //return this.dataStorageService.fetchRecipes();

        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => {
                return recipeState.recipes;
            }),
            switchMap(recipes => {
                if(recipes.length === 0 )
                {
                    this.store.dispatch(new RecipeActions.FetchRecipes());
                    return this.actions$.pipe(
                    ofType(RecipeActions.SET_RECIPES),
                    take(1)
                    );
                }else{
            return of(recipes);
            }
            })
        );
    }
}

