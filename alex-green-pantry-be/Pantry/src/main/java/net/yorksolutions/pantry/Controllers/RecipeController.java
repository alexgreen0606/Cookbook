package net.yorksolutions.pantry.Controllers;

import net.yorksolutions.pantry.Models.Recipe;
import net.yorksolutions.pantry.Services.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/recipes")
@CrossOrigin
public class RecipeController {

    private final RecipeService service;

    public RecipeController(RecipeService service){
        this.service = service;
    }

    /**
     * Endpoint to create a new recipe and save it to the database.
     * 
     * @param recipe - the new recipe to save
     */
    @PostMapping
    public void createRecipe(@RequestBody Recipe recipe){
        try {
            service.createRecipe(recipe);
        } catch (IllegalAccessException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // id already exists
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // missing required fields
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to get all the recipes stored in the database that belong to the 
     * user who made the request.
     * 
     * @param token - the token representing the user making the request
     * @return - all recipes from the pantry
     */
    @GetMapping
    public Iterable<Recipe> getRecipes(@RequestParam UUID token){
        try {
            return service.getRecipes(token);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to update a recipe's stored values.
     * 
     * @param id - the id of the recipe to modify
     * @param recipe - object holding the new values of the recipe
     * @param token - unique id representing the user making the request
     */
    @PutMapping("/{id}")
    public void updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe, @RequestParam UUID token){
        try {
            service.updateRecipe(id, recipe, token);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // missing required fields
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to delete a recipe by its id.
     * 
     * @param id - the id of the recipe to delete
     * @param token - the unique id representing the user making the request
     */
    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable Long id, @RequestParam UUID token){
        try {
            service.deleteRecipe(id, token);
        } catch (IllegalAccessException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // user does not have access to delete this recipe
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to delete all recipes created by a given user.
     * 
     * @param token - the unique id representing the user being deleted
     */
    @DeleteMapping("/deleteUser/{token}")
    public void deleteUserRecipes(@PathVariable UUID token){
        try {
            service.deleteAllCreatorRecipes(token);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }
}
