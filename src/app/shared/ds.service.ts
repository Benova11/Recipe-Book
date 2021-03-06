import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

//import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})

export class DataStorageService {

    constructor(private http: HttpClient, private recipesService: RecipeService,private store: Store<fromApp.AppState>) {}
    
    storeRecipes(){
        const recipes = this.recipesService.getRecipes();
        this.http.put('https://ng-course-recipe-book-26101.firebaseio.com/recipes.json', recipes).subscribe(
            (response => {
                console.log(response);
            })
        );
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
              'https://ng-course-recipe-book-26101.firebaseio.com/recipes.json',
            )
          .pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
          tap(recipes => {
            this.store.dispatch(new RecipesActions.SetRecipes(recipes));
            //this.recipesService.setRecipes(recipes);
          })
        );
    }
}

