package net.yorksolutions.pantry.Controllers;

import net.yorksolutions.pantry.Models.Item;
import net.yorksolutions.pantry.Services.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/items")
@CrossOrigin
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service){
        this.service = service;
    }

    /**
     * Endpoint that creates a new pantry item and saves it to the database.
     * 
     * @param item - the new item object to save to the database
     * @return - the new item with its id from the database
     */
    @PostMapping
    public Item createItem(@RequestBody Item item){
        try {
            return service.createItem(item);
        } catch (IllegalAccessException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // item id already exists
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // missing required fields
        } catch (IllegalStateException e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); // calories per ounce is null
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to retrieve all items stored in the database.
     * 
     * @return - all items in the pantry
     */
    @GetMapping
    public Iterable<Item> getItems(){
        try {
            return service.getItems();
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to modify values of an existing item in the database.
     * 
     * @param id - the id of the item to modify
     * @param item - the new item values 
     */
    @PutMapping("/{id}")
    public void updateItem(@PathVariable Long id, @RequestBody Item item){
        try {
            service.updateItem(id, item);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // missing required fields
        } catch (IllegalStateException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // calories per ounce is null
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint to delete an item from the database using its id.
     * 
     * @param id - the id of the item to delete
     */
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id){
        try {
            service.deleteItem(id);
        } catch (IllegalAccessException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

}
