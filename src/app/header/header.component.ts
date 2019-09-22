import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/ds.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit,OnDestroy{
    collapsed = true;
    userSub: Subscription;
    isAuthenticated = false;
    
    constructor(private dataService: DataStorageService, private auth:AuthService){}

    ngOnInit(){
        this.userSub = this.auth.user.subscribe(user =>
            {
                this.isAuthenticated = !!user;
            });
    }

    onSaveData(){
        this.dataService.storeRecipes();
    }

    onFetchData(){
        this.dataService.fetchRecipes().subscribe();
    }

    onLogout(){
        this.auth.logout();
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    
}