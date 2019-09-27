import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
//import {ShoppingListService} from '../ShoppingListService.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f',{static:false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store:Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData =>{
      if(stateData.editedIngredientIndex > -1)
      {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })

      }else{
        this.editMode = false;
      }
    });
    /*
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
        */
  }

  onAdditem(form: NgForm){
    const formValue = form.value;
    const newIngredient = new Ingredient(formValue.name,formValue.amount);
    if(!this.editMode){
      //this.lsService.addIngridient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }else
    {
      //this.lsService.updateIngredient(this.editedItemIndex,newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    }
    this.editMode = false;
    this.slForm.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEditing);
  }

  onDelete(){
    //this.lsService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEditing);
  }

}
