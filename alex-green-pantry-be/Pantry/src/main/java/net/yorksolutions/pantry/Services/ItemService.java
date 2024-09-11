package net.yorksolutions.pantry.Services;

import net.yorksolutions.pantry.Models.Item;
import net.yorksolutions.pantry.Repositories.ItemRepository;
import net.yorksolutions.pantry.Repositories.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ItemService {
    public ItemRepository itemRepository;
    public RecipeRepository recipeRepository;

    public ItemService(ItemRepository itemRepository, RecipeRepository recipeRepository){
        this.itemRepository = itemRepository;
        this.recipeRepository = recipeRepository;
    }

    /**
     * Saves the given item object into the database, as long as it
     *  does not have an id already linked to an item, and
     * has all fields populated with data.
     * 
     * @param item - the new item object to save
     * @return - the new item object that was saved to the database
     * @throws Exception - if the request is invalid
     */
    public Item createItem(Item item) throws Exception {

        // check the id does not already exist
        if(item.id != null && itemRepository.findById(item.id).isPresent()){
            throw new IllegalAccessException();
        }

        // check the user entered all required fields
        if(item.name.equals("") || item.imageURL.equals("")){
            throw new IllegalArgumentException();
        }

        // ensure the user entered weight and calories
        if(item.calPerOunce == null){
            throw new IllegalStateException();
        }

        return itemRepository.save(item);

    }

    /**
     * Finds all the existing pantry items in the database.
     * 
     * @return - every item in the pantry
     */
    public Iterable<Item> getItems(){
        // return all items in alphabetical order by name
        return itemRepository.findAllByOrderByName();
    }

    /**
     * Updates the item represented by the provided id using the new values in the item
     * object. The new item must follow the same rules applied during item creation.
     * 
     * @param id - represents the item being updated
     * @param item - the item's new values
     */
    public void updateItem(Long id, Item item) {
        itemRepository.findById(id).orElseThrow();

        // ensure user entered all required fields
        if(item.name.equals("") || item.imageURL.equals("")){
            throw new IllegalArgumentException();
        }

        // ensure the user entered weight and calories
        if(item.calPerOunce == null){
            throw new IllegalStateException();
        }

        itemRepository.save(item);
    }

    /**
     * Deletes an item from the database using its id.
     * 
     * @param id - represents the item being deleted
     * @throws Exception - if the item does not exist or the item is linked to a recipe
     */
    public void deleteItem(Long id) throws Exception{
        itemRepository.findById(id).orElseThrow();

        for (var recipe : recipeRepository.findAll()){
            for(var item : recipe.items){
                if(Objects.equals(item.id, id)){
                    throw new IllegalAccessException();
                }
            }
        }

        itemRepository.deleteById(id);
    }

}
