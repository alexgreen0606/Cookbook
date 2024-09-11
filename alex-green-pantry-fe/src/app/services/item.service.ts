import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Item } from 'src/data/item';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: HttpClient, 
    private snackbar: MatSnackBar, 
    private dataService: DataService
  ) { }

  showMessage(message: string) {
    this.snackbar.open(message, "Dismiss", { duration: 3500 })
  }

  /**
   * Create a new item and save it to the database.
   * 
   * @param item - the new item to be created
   */
  createItem(item: Item) {
    this.http.post("http://localhost:8080/items", item)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getItems();
        },
        error: (error: { status: number; }) => {
          if (error.status === 412) {
            this.showMessage("Item id already exists.")
          } else if (error.status === 400) {
            this.showMessage("Missing required fields.")
          } else if (error.status === 401){
            this.showMessage("Missing calories per ounce. Item not created.")
          } else {
            this.showMessage("Internal server error when creating item.")
          }
        }
      })
  }

  /**
   * Get all items from the database.
   */
  getItems() {
    this.http.get<Item[]>("http://localhost:8080/items")
      .pipe(take(1))
      .subscribe({
        next: (items: Item[]) => {
          this.dataService.updateItems(items);
        },
        error: () => {
          this.showMessage("Internal server error when getting items.")
        }
      })
  }

  /**
   * Update an item in the database.
   * 
   * @param item - the item and its new values to save
   */
  updateItem(item: Item) {
    this.http.put(`http://localhost:8080/items/${item.id}`, item)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getItems();
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Missing required fields.")
          } else if (error.status === 412){
            this.showMessage("Missing calories per ounce. Item not updated.")
          } else {
            this.showMessage("Internal server error when updating item.")
          }
        }
      })
  }

  /**
   * Delete an item from the database, as long as no recipes are linked to it.
   * 
   * @param itemId - the id of the item to delete
   */
  deleteItem(itemId: number) {
    this.http.delete(`http://localhost:8080/items/${itemId}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getItems();
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Another user's recipe relies on this item. Cannot delete.")
          } else {
            this.showMessage("Internal server error when deleting item.")
          }
        }
      })
  }

}
