package net.yorksolutions.pantry.Repositories;

import net.yorksolutions.pantry.Models.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Iterable<Recipe> findAllByCreatorIdOrderByName(Long creatorId);
}