import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from 'src/data/account';
import { Item } from 'src/data/item';
import { Recipe } from 'src/data/recipe';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // default value for the user variable when no user is logged on
  private noUser: Account = new Account('', '', '');

  // tracks the account of the current user
  private user: BehaviorSubject<Account> = new BehaviorSubject<Account>(this.noUser);

  // the token of the user once logged-on
  private UUID: String | null = null;

  // list of all the user's recipes
  private recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);

  // list of all items in the pantry
  private items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  // booleans to track app state
  public loggedIn = false;
  public loggingIn = true;
  public registering = false;
  public viewingItems = false;
  public viewingAccount = false;

  constructor() { }

  getUserObservable() {
    return this.user.asObservable();
  }

  getRecipesObservable() {
    return this.recipes.asObservable();
  }

  getItemsObservable() {
    return this.items.asObservable();
  }

  resetVals() {
    this.loggingIn = false;
    this.registering = false;
    this.viewingItems = false;
    this.viewingAccount = false;
  }

  showItems() {
    this.resetVals();
    this.viewingItems = true;
  }

  showAccount() {
    this.resetVals();
    this.viewingAccount = true;
  }

  getUser() {
    return this.user.value;
  }

  getRecipes() {
    return this.recipes.value;
  }

  getItems() {
    return this.items.value;
  }

  getUUID(){
    return this.UUID;
  }

  /**
   * Sets app state once a user account has been received from the backend.
   * 
   * @param user - the account retrieved from the database
   * @param UUID - the token representing the user's account in the backend
   */
  loginUser(user: Account, UUID: String) {
    this.user.next(user);
    this.UUID = UUID;

    this.resetVals();
    this.loggedIn = true;
    this.viewingItems = true;
  }

  /**
   * Resets the app state once a user logs out of the backend.
   */
  logout() {
    this.user.next(this.noUser);
    this.UUID = null;

    this.resetVals();
    this.loggedIn = false;
    this.loggingIn = true;
  }

  /**
   * Updates the app's recipe list using the backend response.
   * 
   * @param recipes - the list of recipes from the database
   */
  updateRecipes(recipes: Recipe[]) {
    this.recipes.next(recipes);
  }

  /**
   * Updates the app's item list using the backend response.
   * 
   * @param items - the list of all items from the database
   */
  updateItems(items: Item[]) {
    this.items.next(items);
  }

  /**
   * Retrieves all recipes linked to a given item.
   * 
   * @param item - the item we are analyzing
   * @returns - all recipes linked to that item
   */
  getItemRecipes(item: Item) : Recipe[] {
    let itemRecipes: Recipe[] = []
    for(let recipe of this.recipes.value){
      for(let recItem of recipe.items){
        if(recItem.id === item.id){
          itemRecipes.push(recipe);
        }
      }
    }
    return itemRecipes;
  }
}
