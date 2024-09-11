import { Component } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { DataService } from 'src/app/services/data.service';
import { Account } from 'src/data/account';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public name = ''
  public username = ''
  public password = ''

  constructor(
    public dataService: DataService, 
    public accessService: AccessService
  ){}

  register(){
    this.accessService.register(new Account(this.name, this.username, this.password))
    this.name = ''
    this.username = ''
    this.password = ''
  }
}
