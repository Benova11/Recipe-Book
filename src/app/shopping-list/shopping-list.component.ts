import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {ShoppingListService} from './ShoppingListService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients:Ingredient[];
  private subscription: Subscription;

  constructor(private lsService:ShoppingListService) { }

  ngOnInit() {

      this.ingredients = this.lsService.getIngredients();
      this.subscription = this.lsService.ingredientsChanged
      .subscribe
        ((ingredients: Ingredient[])=> 
          {
            this.ingredients = ingredients
          });
  }

  onEditItem(id: number){
    this.lsService.startedEditing.next(id);
  }



  ngOnDestory(): void{
    this.subscription.unsubscribe();
  }

}
