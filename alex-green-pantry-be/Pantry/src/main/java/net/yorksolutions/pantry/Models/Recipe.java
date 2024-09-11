package net.yorksolutions.pantry.Models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;

    public String name;

    @Column(columnDefinition = "TEXT")
    public String imageURL;

    @ElementCollection
    public List<String> steps;

    public Long creatorId;

    @ManyToMany(cascade = CascadeType.MERGE)
    public List<Item> items;

    @ElementCollection
    public List<Float> itemWeights;

}
