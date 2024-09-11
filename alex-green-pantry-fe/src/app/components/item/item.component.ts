import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  public linked = false;
  public recipes: Recipe[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public item: Item,
    public dialogRef: MatDialogRef<ItemComponent>,
    private dataService: DataService,
    private itemService: ItemService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.dataService.getItemsObservable().subscribe((items) => {
      for (let dataItem of items) {
        if (dataItem.id === this.item.id) {
          this.item = dataItem;
        }
      }
    })

    this.recipes = this.dataService.getItemRecipes(this.item);

    this.linked = this.recipes.length > 0;
  }

  openEditItem() {
    this.dialogService.openEditItem(this.item).afterClosed().subscribe(item => {
      if (item != undefined)
        this.itemService.updateItem(item);
    })
  }

  deleteItem() {
    if (this.item.id)
      this.itemService.deleteItem(this.item.id);
    this.dialogRef.close();
  }

}
