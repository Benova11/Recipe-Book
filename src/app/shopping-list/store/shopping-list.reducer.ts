import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface AppState{
    shoppingList: State;
}

export interface State{
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState = {
    ingredients: 
    [
        new Ingredient('Apples',5),
        new Ingredient ('Oranges',3)
    
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions){
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
        {
            return{
                ...state,
                ingredients: [...state.ingredients, action.payload]
            }
        };

        case ShoppingListActions.ADD_INGREDIENTS:
        {
            return{
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }
        };

        case ShoppingListActions.UPDATE_INGREDIENT:
        {
            let ing = [...state.ingredients];
            ing [state.editedIngredientIndex] = action.payload;
            const ingredients = ing;
            return{
            ...state,
            ingredients,
            editedIngredientIndex: -1,
            editedIngredient: null
            }
        };

        case ShoppingListActions.DELETE_INGREDIENT:
        {
            return{
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        };

        case ShoppingListActions.START_EDITING:
        {
            return{
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }
            }
        };

        case ShoppingListActions.STOP_EDITING:
        {
            return{
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        };
         
        default:
        {
            return state;
        };
    }
}

