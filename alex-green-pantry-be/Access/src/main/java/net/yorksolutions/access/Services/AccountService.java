package net.yorksolutions.access.Services;

import net.yorksolutions.access.Models.Account;
import net.yorksolutions.access.dto.LoginInfo;
import net.yorksolutions.access.Repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Objects;
import java.util.UUID;

@Service
public class AccountService {
    public HashMap<UUID,Account> loggedInUsers;


    public AccountRepository accountRepository;
    RestTemplate client;

    @Value("${net.yorksolutions.pantryUrl}")
    String pantryRecipeUrl;

    public AccountService(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
        this.client = new RestTemplate();
        this.loggedInUsers = new HashMap<>();
    }

    /*
     * Creates an entry in the database for the provided account object. The account
     * must have an id that does not already exist, a present username, password, and email,
     * and a username that does not already exist.
     */
    public void createAccount(Account account) throws Exception {

        // check the id doesn't already exist
        if(account.id != null && accountRepository.findById(account.id).isPresent()){
            throw new IllegalAccessException();
        }

        // ensure user entered required input
        if(account.username.equals("") || account.password.equals("") || account.name.equals("")){
            throw new IllegalCallerException();
        }

        //check the username isn't already taken
        if(accountRepository.findByUsername(account.username).isPresent()){
            throw new IllegalArgumentException();
        }
        accountRepository.save(account);
    }

    /*
     * Adds the provided account to the hashmap of logged-on users and returns the token
     * that represents that account. If the account does not exist with the provided credentials,
     * an exception is thrown.
     */
    public UUID login(LoginInfo creds){
        var account = accountRepository.findByUsernameAndPassword(creds.username, creds.password).orElseThrow();
        UUID token = UUID.randomUUID();
        this.loggedInUsers.put(token,account);
        return token;
    }

    /**
     * Removes the account from the hashmap linked to the provided token.
     * 
     * @param token - the unique token representing the account to remove
     */
    public void logout(UUID token){
        this.loggedInUsers.remove(token);
    }

    /**
     * Retrieves the account object from the hashmap represented by the provided token.
     * 
     * @param token - the token representing the account
     * @return - the account object linked to the token
     * @throws Exception - if the token is not valid
     */
    public Account getAccount(UUID token) throws Exception {
        var account = this.loggedInUsers.get(token);
        if(account == null){
            throw new Exception();
        }
        return account;
    }

    /**
     * Updates the provided account object in the database given the account object exists and the new values satisfy the account rules:
     * a unique username, and valid username, password, and name.
     * 
     * @param token - the token representing the user who is making the change
     * @param account - the new values to save to the database
     * @throws Exception
     */
    public void updateAccount(UUID token, Account account) throws Exception{
        accountRepository.findById(account.id).orElseThrow();

        // ensure the account being modified is owned by the current user
        var tokenAccount = loggedInUsers.get(token);
        if(tokenAccount == null || !Objects.equals(tokenAccount.id, account.id)){
            throw new Exception();
        }

        if(account.username.equals("") || account.password.equals("") || account.name.equals("")){
            throw new IllegalArgumentException();
        }

        // check the username isn't already taken
        var existingAccounts = accountRepository.findAll();
        for(var existingAccount : existingAccounts ){
            if(existingAccount.username.equals(account.username) && (existingAccount.id != account.id)){
                throw new IllegalStateException();
            }
        }

        var newAccount = accountRepository.save(account);

        loggedInUsers.remove(token);
        loggedInUsers.put(token, newAccount);
    }

    /**
     * Deletes the account from the database that is linked to the provided token.
     * 
     * @param token - represents the account in the logged-on users hashmap
     * @throws Exception - if the account is not logged on
     */
    public void deleteAccount(UUID token) throws Exception {
        var tokenAccount = this.loggedInUsers.get(token);

        if(tokenAccount == null){
            throw new Exception();
        }

        var url = String.format("%s/recipes/deleteUser/%s", this.pantryRecipeUrl, token);

        try {
            this.client.delete(url);
            accountRepository.deleteById(tokenAccount.id);
        } catch (Exception e){
            throw new IllegalArgumentException();
        }
    }

}
