import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/Forms';

import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { ShoppingEditComponent } from '../shopping-list/shopping-edit/shopping-edit.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations:[
        ShoppingListComponent,
        ShoppingEditComponent
    ],

    imports:[
        FormsModule,
        RouterModule.forChild([{path: '', component:ShoppingListComponent},
    ]),
    SharedModule
    ]
})
export class ShoppingListModule {}