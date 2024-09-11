import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {

  itemFilter = ''

  public newStep = '';

  public edittingItem: Item | null = null;

  public createdItem: Item | null = null;
  public createdWeight: number | null = null;

  public selectedItem: Item | null = null;
  public selectedWeight: number | null = null;

  itemSearch = new FormControl('');
  itemOptions: Item[] = [];
  filteredItems: Observable<Item[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe,
    public dialogRef: MatDialogRef<EditRecipeComponent>,
    public dataService: DataService,
    public itemService: ItemService,
    private dialogService: DialogService,
  ) {
    this.dataService.getItemsObservable().subscribe(items => {
      this.itemOptions = [...items];
      this.recipe.items.forEach((item) => {
        this.itemOptions.splice(this.itemOptions.indexOf(item), 1);
      })
    });

    this.filteredItems = this.itemSearch.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value)
          return this._filterItems(value)
        return this.itemOptions.slice();
      })
    );
  }

  ngOnInit(): void {
    this.recipe.items = [...this.recipe.items];
    this.recipe.itemWeights = [...this.recipe.itemWeights];
    this.recipe.steps = [...this.recipe.steps]
  }

  private _filterItems(value: string): Item[] {
    const filterValue = value.toLowerCase();

    return this.itemOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private hideDialog() {
    this.dialogRef.updateSize("0px");
  }

  private unhideDialog() {
    this.dialogRef.updateSize("1200px");
  }

  resetVals() {
    this.createdItem = null;
    this.createdWeight = null;
    this.selectedWeight = null;
    this.selectedItem = null;
    this.edittingItem = null;
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  /**
   * Opens the dialog for creating a new item for the recipe.
   */
  openCreateItem() {
    this.itemFilter = ''
    this.hideDialog();
    this.dialogService.openCreateItem().afterClosed().subscribe((item) => {
      if (item != undefined) this.createdItem = item;
      this.unhideDialog();
    })
  }

  /**
   * Adds a new item to the recipe.
   */
  createItem() {
    if (this.createdItem && this.createdWeight) {
      this.recipe.items.unshift({ ...this.createdItem });
      this.recipe.itemWeights.unshift(this.createdWeight);
      this.createdItem = null;
      this.createdWeight = null;
    }
  }

  selectItem(item: Item) {
    this.selectedItem = item;
    this.itemFilter = ''
  }

  /**
   * Adds an item to the recipe from the pantry.
   */
  addItem() {
    if (this.selectedItem && this.selectedWeight) {
      this.recipe.items.unshift({ ...this.selectedItem });
      this.recipe.itemWeights.unshift(this.selectedWeight);
      this.itemOptions.splice(this.itemOptions.indexOf(this.selectedItem), 1);
      this.selectedItem = null;
      this.selectedWeight = null;
    }
  }

  /**
   * Allows user to edit an item they are creating for this recipe.
   */
  openEditItem(item: Item) {
    this.itemFilter = ''
    this.hideDialog();
    this.edittingItem = item;
    this.dialogService.openEditItem(item).afterClosed().subscribe((edittedItem) => {
      if (edittedItem != undefined){
        this.createdItem = edittedItem;
        this.createdWeight = this.recipe.itemWeights[this.recipe.items.indexOf(item)]
      } else {
        this.edittingItem = null;
      }
      this.unhideDialog();
    })
  }

  /**
   * Updates an item in the recipe.
   */
  updateItem() {
    if (this.createdItem && this.createdWeight && this.edittingItem) {
      // remove the editted item and its weight from the recipe
      this.recipe.itemWeights.splice(this.recipe.items.indexOf(this.edittingItem), 1);
      this.recipe.items.splice(this.recipe.items.indexOf(this.edittingItem), 1);

      // add the editted item to the recipe
      this.recipe.items.unshift({ ...this.createdItem });
      this.recipe.itemWeights.unshift(this.createdWeight);
      this.createdItem = null;
      this.createdWeight = null;
    }
  }

  /**
   * Removes an item from the recipe.
   * 
   * @param item - the item to remove from the recipe
   */
  removeItem(item: Item) {
    this.recipe.items.splice(this.recipe.items.indexOf(item), 1);
    this.recipe.itemWeights.splice(this.recipe.items.indexOf(item), 1);
    if (item.id != null)
      this.itemOptions.push(item);
  }

  /**
   * Adds a new step to the instructions list for this recipe.
   */
  addStep() {
    this.recipe.steps.push(this.newStep);
    this.newStep = '';
  }

  /**
   * Removes the provided step from the instructions list.
   */
  removeStep(step: String) {
    this.recipe.steps.splice(this.recipe.steps.indexOf(step), 1);
  }

  /**
   * Calculates the total calorie count of all items in the recipe.
   * 
   * @returns - the total calories of the recipe
   */
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

  drop(event: CdkDragDrop<String[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
  }

}
