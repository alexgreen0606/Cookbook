package net.yorksolutions.pantry.Models;

import jakarta.persistence.*;

@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;

    public String name;

    @Column(columnDefinition = "TEXT")
    public String imageURL;

    public Long calPerOunce;

}
