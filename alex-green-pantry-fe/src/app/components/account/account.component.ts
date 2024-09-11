import { Component } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Recipe } from 'src/data/recipe';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  constructor(
    public dataService: DataService,
    private accessService: AccessService,
    private dialogService: DialogService
  ) { }

  openEditAccount() {
    this.dialogService.openEditAccount().afterClosed().subscribe((account) => {
      if (account != undefined) {
        this.accessService.updateAccount(account);
      }
    })
  }

  deleteAccount() {
    this.accessService.deleteAccount();
  }

  openRecipe(recipe: Recipe) {
    this.dialogService.openRecipe(recipe);
  }

  logout(){
    this.accessService.logout();
  }

}
