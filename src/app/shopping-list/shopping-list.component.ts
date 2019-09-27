import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
//import {ShoppingListService} from './ShoppingListService.service';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients:Observable<{ingredients: Ingredient[]}>;
  //private subscription: Subscription;

  constructor(private store:Store<fromShoppingList.AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    /*  this.ingredients = this.lsService.getIngredients();
      this.subscription = this.lsService.ingredientsChanged
      .subscribe
        ((ingredients: Ingredient[])=> 
          {
            this.ingredients = ingredients
          });
          */
  }

  onEditItem(id: number){
    //this.lsService.startedEditing.next(id);
    this.store.dispatch(new ShoppingListActions.StartEditing(id));
  }

  ngOnDestory(): void{
    //this.subscription.unsubscribe();
  }

}
