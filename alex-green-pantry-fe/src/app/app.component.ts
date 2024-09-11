import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';
import { DataService } from './services/data.service';
import { DialogService } from './services/dialog.service';
import { ItemService } from './services/item.service';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'The Cookbook';

  itemFilter = ''
  recipeFilter = ''

  recipeSearch = new FormControl('');
  recipeOptions: Recipe[] = [];
  filteredRecipes: Observable<Recipe[]>;

  itemSearch = new FormControl('');
  itemOptions: Item[] = [];
  filteredItems: Observable<Item[]>;

  constructor(
    public dataService: DataService,
    private itemService: ItemService,
    private dialogService: DialogService,
    private recipeService: RecipeService
  ) {
    this.dataService.getRecipesObservable().subscribe((recipes: any) => {
      this.recipeOptions = [...recipes];
    });

    this.dataService.getItemsObservable().subscribe((items: any) => {
      this.itemOptions = [...items];
    });

    this.filteredItems = this.itemSearch.valueChanges.pipe(
      startWith('' as string),
      map((value: string | null) => {
        if (value)
          return this._filterItems(value)
        return this.itemOptions.slice();
      })
    );

    this.filteredRecipes = this.recipeSearch.valueChanges.pipe(
      startWith('' as string),
      map((value: string | null) => {
        if (value)
          return this._filterRecipes(value)
        return this.recipeOptions.slice();
      })
    );
  }

  resetFilters(){
    this.itemFilter = ''
    this.recipeFilter = ''
  }

  private _filterRecipes(value: string): Recipe[] {
    const filterValue = value.toLowerCase();

    return this.recipeOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterItems(value: string): Item[] {
    const filterValue = value.toLowerCase();

    return this.itemOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  /**
   * Open the dialog for creating a new pantry item.
   */
  openCreateItem() {
    this.resetFilters()
    this.dialogService.openCreateItem()
      .afterClosed().subscribe((item: Item | undefined) => {
        if (item != undefined)
          this.itemService.createItem(item);
      })
  }

  /**
   * Open the dialog for creating a new pantry recipe.
   */
  openCreateRecipe() {
    this.resetFilters()
    this.dialogService.openCreateRecipe()
      .afterClosed().subscribe((recipe: Recipe | undefined) => {
        if (recipe != undefined)
          this.recipeService.createRecipe(recipe);
      })
  }

  /**
   * Open the dialog for displaying a pantry item.
   */
  openItem(item: Item) {
    this.resetFilters()
    this.dialogService.openItem(item);
  }

  /**
   * Open the dialog for displaying a pantry recipe.
   */
  openRecipe(recipe: Recipe | null) {
    this.resetFilters()
    if (recipe)
      this.dialogService.openRecipe(recipe);
  }

}
