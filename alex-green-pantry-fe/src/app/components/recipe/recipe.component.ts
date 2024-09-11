import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe,
    public dialogRef: MatDialogRef<RecipeComponent>,
    private recipeService: RecipeService,
    private dialogService: DialogService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getRecipesObservable().subscribe((recipes) => {
      for (let dataRecipe of recipes) {
        if (dataRecipe.id === this.recipe.id) {
          this.recipe = dataRecipe;
        }
      }
    })


    this.dataService.getItemsObservable().subscribe((items) => {
      for (let dataItem of items) {
        for (let recipeItem of this.recipe.items) {
          if (recipeItem.id === dataItem.id) {
            this.recipe.items.splice(this.recipe.items.indexOf(recipeItem), 1);
            this.recipe.items.push(dataItem);
          }
        }
      }
    })
  }

  openEditRecipe() {
    this.dialogRef.close();
    console.log(this.recipe.steps)
    let backupRecipe = {...this.recipe}
    this.dialogService.openEditRecipe(this.recipe).afterClosed().subscribe(recipe => {
      if (recipe != undefined) {
        console.log(backupRecipe)
          this.recipeService.updateRecipe(recipe, backupRecipe);
      } else {
        this.dialogService.openRecipe(backupRecipe);
      }
    })
  }

  openItem(item: Item) {
    this.dialogRef.close();
    this.dialogService.openItem(item).afterClosed().subscribe(() => {
      this.dialogService.openRecipe(this.recipe);
    })
  }

  deleteRecipe() {
    if (this.recipe.id)
      this.recipeService.deleteRecipe(this.recipe.id)
    this.dialogRef.close();
  }

  calculateCalories() {
    let totalCalories = 0;
    for (let item of this.recipe.items) {
      if (item.calPerOunce) {
        let itemWeight = this.recipe.itemWeights[this.recipe.items.indexOf(item)]
        totalCalories += itemWeight * item.calPerOunce;
      }
    }
    return totalCalories;
  }
}
