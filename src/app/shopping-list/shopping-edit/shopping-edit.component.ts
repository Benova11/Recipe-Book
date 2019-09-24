import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import {ShoppingListService} from '../ShoppingListService.service';
import * as ShoppingListActions from '../store/shopping-list.actions';



@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f',{static:false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private lsService:ShoppingListService, private store:Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }

  ngOnInit() {
    this.subscription =  this.lsService.startedEditing.subscribe(
      (index) =>
        {
          this.editMode = true;
          this.editedItemIndex = index;
          this.editedItem = this.lsService.getIngredient(this.editedItemIndex);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        });
  }

  onAdditem(form: NgForm){
    const formValue = form.value;
    const newIngredient = new Ingredient(formValue.name,formValue.amount);
    if(!this.editMode){
      //this.lsService.addIngridient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }else
    {
      this.lsService.updateIngredient(this.editedItemIndex,newIngredient);
    }
    this.editMode = false;
    this.slForm.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.lsService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
