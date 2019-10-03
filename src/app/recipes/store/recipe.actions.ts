import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] SET_RECIPES';
export const FETCH_RECIPES = '[Recipe] FETCH_RECIPE';
export const ADD_RECIPE = '[Recipe] ADD_RECIPE';
export const UPDATE_RECIPES = '[Recipe] UPDATE_RECIPES';
export const DELETE_RECIPES = '[Recipe] DELETE_RECIPES';
export const STORE_RECIPES = '[Recipe] STORE_RECIPES';

export class SetRecipes implements Action{
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]){}
}

export class FetchRecipes implements Action{
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action{
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe){}
}

export class UpdateRecipes implements Action{
    readonly type = UPDATE_RECIPES;

    constructor(public payload: {index: number,newRecipe: Recipe}){}
}

export class DeleteRecipes implements Action{
    readonly type = DELETE_RECIPES;

    constructor(public payload: number){}
}

export class StoreRecipes implements Action{
    readonly type = STORE_RECIPES;
}

export type RecipesActions = 
SetRecipes|
FetchRecipes|
AddRecipe|
UpdateRecipes|
DeleteRecipes|
StoreRecipes;