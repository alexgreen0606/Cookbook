# The Cookbook :stew:

## Project Overview

The Cookbook is a recipe tracker that enables users to create and manage accounts, maintain a pantry of ingredients, and build recipes using those pantry items. The application offers a user-friendly interface to store your favorite recipes, track ingredients, and manage calorie counts.

## Features

- **Login System**: Users can create and manage accounts to personalize their experience.
- **Pantry**: Track ingredients in your pantry, along with their calorie counts.
- **Recipe Management**: Create, browse, and edit recipes by linking pantry items to instructions and images.

## Technology Stack

### Frontend

- **Angular**: Handles the user interface, ensuring a dynamic and interactive experience.
- **CSS**: Provides styling and animations for a polished and responsive look.
- **HTML5**: Lays the foundation for the frontend structure.

### Backend

- **Java Spring Boot**: The main framework that handles the server-side logic, routing, and API endpoints.
- **JPA Repository**: Used for interacting with the database, providing an abstraction layer to manage persistent data.

## How to Use

- **Create an Account**: Sign up with your name, username, and password on the login page.
- **Build Your Pantry**: Add ingredients via the sidebar. Each ingredient requires a name, image URL, and calorie count.
- **Create and Manage Recipes**: On the homepage, browse or create new recipes. Recipes consist of names, images, linked ingredients from the pantry, and step-by-step instructions.
- **Edit Your Account**: The profile page allows you to modify your recipes, ingredients, username, password, and name. You can also delete your account from here.

## Development Intent

This app was developed as my capstone project for York Solutions' `Barriers to Entry (B2E)` program, completed over two weeks. The goal was to design and implement both the frontend and backend independently, resulting in a fully functional application.

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