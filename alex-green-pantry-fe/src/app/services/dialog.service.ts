import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';
import { EditAccountComponent } from '../components/edit-account/edit-account.component';
import { EditItemComponent } from '../components/edit-item/edit-item.component';
import { EditRecipeComponent } from '../components/edit-recipe/edit-recipe.component';
import { ItemComponent } from '../components/item/item.component';
import { RecipeComponent } from '../components/recipe/recipe.component';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
  ) { }

  openCreateRecipe() {
    return this.dialog.open(EditRecipeComponent, { width: '1200px', data: new Recipe('', '', [], [], this.dataService.getUser().id, []) })
  }

  openCreateItem() {
    return this.dialog.open(EditItemComponent, { width: '500px', data: new Item('', '', null) })
  }

  openEditAccount() {
    return this.dialog.open(EditAccountComponent, { width: '500px', data: { ...this.dataService.getUser() } })
  }

  openEditItem(item: Item) {
    return this.dialog.open(EditItemComponent, { width: '500px', data: { ...item } })
  }

  openEditRecipe(recipe: Recipe) {
    return this.dialog.open(EditRecipeComponent, { width: '1200px', data: { ...recipe } })
  }

  openItem(item: Item) {
    return this.dialog.open(ItemComponent, { width: '700px', data: item })
  }

  openRecipe(recipe: Recipe) {
    return this.dialog.open(RecipeComponent, { width: '700px', data: recipe })
  }
}
