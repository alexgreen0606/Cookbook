package net.yorksolutions.pantry.Services;

import net.yorksolutions.pantry.Models.Account;
import net.yorksolutions.pantry.Models.Item;
import net.yorksolutions.pantry.Models.Recipe;
import net.yorksolutions.pantry.Repositories.ItemRepository;
import net.yorksolutions.pantry.Repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;


import static org.springframework.http.HttpStatus.OK;

@Service
public class RecipeService {
    public RecipeRepository recipeRepository;
    public ItemRepository itemRepository;
    public ItemService itemService;

    RestTemplate client;
    @Value("${net.yorksolutions.accessUrl}")
    String accessUrl;

    public RecipeService(RecipeRepository recipeRepository, ItemRepository itemRepository, ItemService itemService){
        this.recipeRepository = recipeRepository;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.client = new RestTemplate();
    }

    /**
     * Creates a new recipe and stores it in the database, as long as the user has entered all required fields.
     * If the recipe contains new items, create them and stored them in the database first.
     * 
     * @param recipe - the new recipe to save to the database
     * @throws Exception - if the user did not enter all fields
     */
    public void createRecipe(Recipe recipe) throws Exception {

        // check the id does not already exist
        if(recipe.id != null && recipeRepository.findById(recipe.id).isPresent()){
            throw new IllegalAccessException();
        }

        // check the user entered input for all fields
        if(recipe.name.equals("") || recipe.imageURL.equals("") || recipe.steps.size() < 1 || recipe.items.size() < 1 ){
            throw new IllegalArgumentException();
        }

        // create any new items and get the new items with their ids
        this.createNewItems(recipe);

        // save the recipe to the database
        recipeRepository.save(recipe);

    }

    /**
     * Gets all the recipes from the database that belong to the user represented by the token.
     * 
     * @param token - represents the user who made the request
     * @return - all recipes owned by the user
     * @throws Exception - there is no user logged in with the given token
     */
    public Iterable<Recipe> getRecipes(UUID token) throws Exception {
        var account = getAccount(token);

        // get all current user recipes in alphabetical order by name
        return recipeRepository.findAllByCreatorIdOrderByName(account.id);
    }

    /**
     * Updates a recipe from the database represented by the given id. 
     * 
     * @param id - represents the recipe tobe updated
     * @param recipe - the new values to save to the database
     * @param token - represents the user who made the request
     * @throws Exception - if the user is not logged-on or the new values are not all populated
     */
    public void updateRecipe(Long id, Recipe recipe, UUID token) throws Exception {
        // ensure the user has access to edit this recipe
        var account = getAccount(token);
        if(!Objects.equals(recipe.creatorId, account.id)){
            throw new Exception();
        }

        recipeRepository.findById(id).orElseThrow();

        // ensure the user entered all required fields
        if(recipe.name.equals("") || recipe.imageURL.equals("") || recipe.steps.size() < 1 || recipe.items.size() < 1 ){
            throw new IllegalArgumentException();
        }

        // create any new items and get the new items with their ids
        this.createNewItems(recipe);

        recipeRepository.save(recipe);

    }

    /**
     * Deletes a recipe by its id. The recipe must have been created by the user.
     * 
     * @param id - represents the recipe being deleted
     * @param token - represents the user who made the request
     * @throws Exception - if the user is not logged or the user does not own the recipe
     */
    public void deleteRecipe(Long id, UUID token) throws Exception {
        var recipe = recipeRepository.findById(id).orElseThrow();

        // ensure the user has access to delete this recipe
        var account = getAccount(token);
        if(!Objects.equals(recipe.creatorId, account.id)){
            throw new Exception();
        }

        recipeRepository.deleteById(id);
    }

    /**
     * Creates any new items in the provided recipe that do not exist in the database.
     * 
     * @param recipe - the recipe with new items to create
     * @throws Exception - an error occurs in the item service during creation
     */
    private void createNewItems(Recipe recipe) throws Exception{
        List<Item> newItems = new ArrayList<>();
        List<Item> nullItems = new ArrayList<>();

        // create any new items
        for (var item : recipe.items) {
            if (item.id == null) {
                nullItems.add(item);
                newItems.add(itemService.createItem(item));
            }
        }
        recipe.items.removeAll(nullItems);
        recipe.items.addAll(newItems);
    }

    /**
     * Deletes all recipes linked to a user.
     * 
     * @param token - the unique id representing the user
     * @throws Exception - if the user is not logged on
     */
    public void deleteAllCreatorRecipes(UUID token) throws Exception {
        var account = getAccount(token);

        // delete all the user's recipes
        var recipes = recipeRepository.findAllByCreatorIdOrderByName(account.id);
        recipeRepository.deleteAll(recipes);
    }

    /**
     * Calls the account endpoint to retrieve the account object represented by
     * the provided token.
     * 
     * @param token - represents the user whose account we need
     * @return - the account object the token represents
     * @throws Exception - if an error occurs at the account endpoint
     */
    private Account getAccount(UUID token) throws Exception {
        var url = String.format("%s/accounts?token=%s", this.accessUrl, token);
        ResponseEntity<Account> response = this.client.getForEntity(url, Account.class);
        if (OK.equals(response.getStatusCode())) {
            return response.getBody();
        } else {
            throw new Exception();
        }
    }
}