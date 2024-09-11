import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from 'src/data/account';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public account: Account, 
    public dialogRef: MatDialogRef<EditAccountComponent>
  ) {}

}
