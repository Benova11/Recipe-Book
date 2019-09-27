import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
//import { ShoppingListService } from '../shopping-list/ShoppingListService.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';


@Injectable({providedIn:'root'})
export  class RecipeService {
    recipeChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];
    /* private recipes: Recipe[] = [
        new Recipe('A Test Recipe',
        'TEST',
        'https://get.pxhere.com/photo/dish-meal-food-vegetable-recipe-cuisine-vegetarian-food-parmigiana-1417897.jpg',
        [
            new Ingredient('Smekel',5),
            new Ingredient('LOOOOG',5),
            
        ]    ),
        new Recipe('Anoter Test Recipe',
        'TEST2',
        'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
        [
            new Ingredient('Smekel',2),
            new Ingredient('LOOOOG',3),
        ])
      ]; */
    constructor(private store:Store<fromShoppingList.AppState>){}

     getRecipes(){
        return this.recipes.slice();
    }

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

     getRecipeById(id : number){
        return this.recipes[id];
    }

     addIngredientsToShoppingList(ingredients: Ingredient[]){
        //this.slService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

     addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

     updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

     deleteRecipe(index: number){
        this.recipes.splice((index),1);
        this.recipeChanged.next(this.recipes.slice());
    }

}