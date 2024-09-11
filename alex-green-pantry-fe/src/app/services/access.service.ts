import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Account } from 'src/data/account';
import { DataService } from './data.service';
import { ItemService } from './item.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private dataService: DataService,
    private itemService: ItemService,
    private recipeService: RecipeService
  ) { }

  showMessage(message: string) {
    this.snackbar.open(message, "Dismiss", { duration: 3500 })
  }

  /**
   * Create a new account in the database.
   * 
   * @param user  - the new account to be created in the database
   */
  register(user: Account) {
    this.http.post("http://localhost:8081/accounts", user)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.tryLogin(user.username, user.password);
        },
        error: (error: { status: number; }) => {
          if (error.status === 412) {
            this.showMessage("Account id already exists.")
          } else if (error.status === 401) {
            this.showMessage("Username already taken.")
          } else if (error.status === 409) {
            this.showMessage("Missing required fields.")
          } else {
            this.showMessage("Internal server error when registering.")
          }
        }
      })
  }

  /**
   * Get an account from the database.
   * 
   * @param username - the input username
   * @param password - the input password
   */
  tryLogin(username: String, password: String) {
    this.http.post<String>(`http://localhost:8081/accounts/login`, { "username": username, "password": password })
      .pipe(take(1))
      .subscribe({
        next: (UUID: String) => {
          console.log(UUID)
          this.getAccount(UUID);
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Username or password does not exist.")
          } else {
            this.showMessage("Internal server error when logging in.")
          }
        }
      })
  }

  /**
   * Remove the user's account from the backend's hashmap of logged-on users.
   */
  logout() {
    this.http.get(`http://localhost:8081/accounts/logout?token=${this.dataService.getUUID()}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.dataService.logout();
        },
        error: () => {
          this.showMessage("Internal server error when logging out.")
        }
      })
  }

  /**
   * Get an account from the backend using an existing token in the browser.
   * 
   * @param UUID - the token stored in the browser
   */
  getAccount(UUID: String) {
    this.http.get<Account>(`http://localhost:8081/accounts?token=${UUID}`)
      .pipe(take(1))
      .subscribe({
        next: (account: Account) => {
          if (this.dataService.getUser().username != '') {
            this.dataService.loginUser(account, UUID);
            this.dataService.showAccount();
          } else {
            this.dataService.loginUser(account, UUID);
          }
          this.itemService.getItems();
          this.recipeService.getRecipes();
        },
        error: () => {
          this.showMessage("Internal server error when getting account.")
        }
      })
  }

  /**
   * Update an account in the database.
   * 
   * @param account - the new values to be saved in the database
   */
  updateAccount(account: Account) {
    this.http.put(`http://localhost:8081/accounts/${this.dataService.getUUID()}`, account)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.tryLogin(account.username, account.password);
          this.showMessage("Account updated!")
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Account does not exist.")
          } else if (error.status === 412) {
            this.showMessage("That username is already taken.")
          } else if (error.status === 401) {
            this.showMessage("Missing required fields.")
          } else {
            this.showMessage("Internal server error when updating account.")
          }
        }
      })
  }

  /**
   * Delete the current user's account from the database, along with their recipes.
   */
  deleteAccount() {
    this.http.delete(`http://localhost:8081/accounts/${this.dataService.getUUID()}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.dataService.logout();
        },
        error: (error: { status: number; }) => {
          if (error.status === 400) {
            this.showMessage("Account does not exist.")
          } else if (error.status === 412) {
            this.showMessage("Problem deleting recipes.")
          } else {
            this.showMessage("Internal server error when deleting account.")
          }
        }
      })
  }

}
