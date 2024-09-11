package net.yorksolutions.access.Models;

import jakarta.persistence.*;

@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;

    public String name;

    @Column(unique = true)
    public String username;

    public String password;

}