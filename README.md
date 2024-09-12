# The Cookbook :stew:

## Project Overview

This app is a recipe tracker that allows users to create and edit accounts, add items to the pantry, and 
create recipes using the items in the pantry.

## Features

- **Login System**: Create accounts to keep track of your personal recipes.
- **Pantry**: A pantry is used to keep track of ingredients and their calorie counts.
- **Recipes**: The cookbook allows for creation of recipes by linking pantry items and instructions.

## Technology Stack

### Frontend

- **Angular**: The user interface is built using Angular
- **CSS**: Provides styling and animations for a polished look and feel.
- **HTML5**: Lays the foundation for the frontend structure.

### Backend

- **Java Spring Boot**: The main framework that handles the server-side logic, routing, and API endpoints.
- **JPA Repository**: Used for interacting with the database, providing an abstraction layer to manage persistent data.

## How to Use

- **Create Account**: Enter your name, a username, and a password on the login page to create an account.
- **Build Your Pantry**: In the sidebar, add some ingredients to your collection. Ingredients require a name, image url, and calorie count.
- **Build Your Cookbook**: On the homepage, browse your recipes or create new ones with the create button. Recipes consist of names, images, ingredients, and instructions.
- **Edit Your Account**: The profile page allows for editing of all recipes, ingredients, username, password, name, and deletion of your account.

## Development Intent

This app was developed individually by me as my capstone project for York Solution's Barriers to Entry program (B2E).
I had two weeks to design and build both the frontend and backend

## Prerequisites

- **Docker**: The app is containerized, so Docker is required for running the application locally.

## Installation and Running the Game

1. Clone the repository:
```bash
git clone https://github.com/alexgreen0606/Cookbook
```

2. From the root folder, navigate to the docker compose folder:
```bash
cd db
```

3. Run Docker Compose:
```bash
docker compose up
```

4. Open `localhost:4200` in your browser to start using the app!