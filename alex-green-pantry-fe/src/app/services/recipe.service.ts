import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Recipe } from 'src/data/recipe';
import { DataService } from './data.service';
import { DialogService } from './dialog.service';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private dataService: DataService,
    private itemService: ItemService,
    private dialogService: DialogService
  ) { }

  showMessage(message: string) {
    this.snackbar.open(message, "Dismiss", { duration: 3500 })
  }

  /**
   * Create a new recipe and save it to the database.
   * 
   * @param recipe - the new recipe to save
   */
  createRecipe(recipe: Recipe) {
    console.log(recipe)
    this.http.post("http://localhost:8080/recipes", { ...recipe })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getRecipes();
          this.itemService.getItems();
        },
        error: (error: { status: number; }) => {
          if (error.status === 412) {
            this.showMessage("Recipe id already exists.")
          } else if (error.status === 400) {
            this.showMessage("Missing required fields.")
          }
          else {
            this.showMessage("Internal server error when creating recipe.")
          }
        }
      })
  }

  /**
   * Get all recipes from the database linked to the current user.
   */
  getRecipes() {
    this.http.get<Recipe[]>(`http://localhost:8080/recipes?token=${this.dataService.getUUID()}`)
      .pipe(take(1))
      .subscribe({
        next: (recipes: Recipe[]) => {
          this.dataService.updateRecipes(recipes);
        },
        error: () => {
          this.showMessage("Internal server error when getting recipes.")
        }
      })
  }

  /**
   * Update an existing recipe from the database. If the api call fails, the dialog service reopens the
   * recipe to keep context for the user.
   * 
   * @param recipe - the recipe to save to the database
   * @param backupRecipe - a backup recipe to open in case the api call fails
   */
  updateRecipe(recipe: Recipe, backupRecipe: Recipe) {
    this.http.put(`http://localhost:8080/recipes/${recipe.id}?token=${this.dataService.getUUID()}`, recipe)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getRecipes();
          this.itemService.getItems();
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Missing required fields.")
          } else {
            this.showMessage("Internal server error when updating recipe.")
          }
          this.dialogService.openRecipe(backupRecipe)
        }
      })
  }

  /**
   * Delete a recipe from the database.
   * 
   * @param recipeId - the id of the recipe to delete
   */
  deleteRecipe(recipeId: number) {
    this.http.delete(`http://localhost:8080/recipes/${recipeId}?token=${this.dataService.getUUID()}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getRecipes();
        },
        error: (error: { status: number; }) => {
          if (error.status === 412) {
            this.showMessage("User does not have access to delete this recipe.")
          } else {
            this.showMessage("Internal server error when deleting recipe.")
          }
        }
      })
  }

}