import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {ShoppingListService} from './ShoppingListService.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients:Observable<{ingredients: Ingredient[]}>;
  private subscription: Subscription;

  constructor(private lsService:ShoppingListService,
    private store:Store<{ shoppingList: { ingredients: Ingredient[] } }>
    ) 
    { }

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
    this.lsService.startedEditing.next(id);
  }



  ngOnDestory(): void{
    this.subscription.unsubscribe();
  }

}
