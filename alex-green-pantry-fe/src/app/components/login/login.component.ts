import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username = ''
  public password = ''

  constructor(
    public dataService: DataService, 
    public accessService: AccessService
  ){} 

  login(){
    this.accessService.tryLogin(this.username, this.password)
    this.username = ''
    this.password = ''
  }
}
