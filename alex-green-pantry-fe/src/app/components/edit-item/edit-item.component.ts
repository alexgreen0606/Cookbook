import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/data/item';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent {

  public weight : number | null = null
  public calories : number | null = null

  constructor(
    @Inject(MAT_DIALOG_DATA) public item: Item,
    public dialogRef: MatDialogRef<EditItemComponent>
  ) { }

}
