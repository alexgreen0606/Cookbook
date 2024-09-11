package net.yorksolutions.access.Controllers;

import net.yorksolutions.access.Models.Account;
import net.yorksolutions.access.dto.LoginInfo;
import net.yorksolutions.access.Services.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/accounts")
@CrossOrigin
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service){
        this.service = service;
    }

    /**
     * This endpoint creates a new account and saves it to the database. The user is also
     * immediately logged on.
     * 
     * @param account - the new account object to be added to the database
     */
    @PostMapping
    public void createAccount(@RequestBody Account account){
        try {
            service.createAccount(account);
        } catch (IllegalCallerException e){
            throw new ResponseStatusException(HttpStatus.CONFLICT); // missing required fields
        } catch (IllegalAccessException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // account already exists
        } catch(IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); // username already taken
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED); // unknown error occurred
        }
    }

    /**
     * Endpoint for getting an existing account that is/was recently logged on.
     * 
     * @param token - the unique token that represents the account in the hashmap of logged-on users
     * @return - the account object of the current user
     */
    @GetMapping
    public Account getAccount(@RequestParam UUID token){
        try {
            return service.getAccount(token);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // username or password does not exist
        }
    }

    /**
     * Endpoint to log the user into the app. Calls the account service to check the username and password.
     * 
     * @param creds - object storing the username and password for the request
     * @return - the token that now represents the logged-on account in the hashmap
     */
    @PostMapping("/login")
    public UUID login(@RequestBody LoginInfo creds){
        try {
            return service.login(creds);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // username or password does not exist
        }
    }

    /**
     * Endpoint to log the user out by removing their account from the hashmap in the account service.
     * 
     * @param token - the token linked to the account object in the hashmap
     */
    @GetMapping("/logout")
    public void logout(@RequestParam UUID token){
        service.logout(token);
    }

    /**
     * Endpoint to update details within the provided account object.
     * 
     * @param token - the token linked to the user who is making the request
     * @param account - the account object to be updated
     */
    @PutMapping("/{token}")
    public void updateAccount(@PathVariable UUID token, @RequestBody Account account){
        try {
            service.updateAccount(token, account);
        } catch (IllegalStateException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // username is already taken
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); // missing required fields
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // account does not exist
        }
    }

    /**
     * Endpoint to delete an account from the database using the token linked to that account in the
     * account service hashmap.
     * 
     * @param token - the token linked to the account to delete
     */
    @DeleteMapping("/{token}")
    public void deleteAccount(@PathVariable UUID token){
        try {
            service.deleteAccount(token);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED); // failed to delete recipes
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST); // account does not exist
        }
    }
}
