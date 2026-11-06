# FlavorFinder: Recipe Sharing Platform

A full-stack recipe-sharing application built with React, Node.js, Express, and MongoDB.

## Features
- Register and log in with hashed passwords and JWT authentication.
- Browse, search, and filter recipes.
- Create, edit, and delete your own recipes.
- Like and save recipes.
- View your own recipes and saved recipes.
- Pantry matcher: enter ingredients and find recipes with matching ingredients.
- Recipe detail pages with image, ingredients, instructions, and optional video link.
- Responsive layout using the FlavorFinder color palette and Lucide icons.

## Requirements
- Node.js 18+
- npm
- MongoDB local installation or MongoDB Atlas connection string

## Setup

From the project root:

```bash
npm install
npm run install:all
```

Create `server/.env` from `server/.env.example` and set your MongoDB URI and a long random JWT secret.

Start MongoDB locally if you use a local database, then run:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000  
Health check: http://localhost:5000/api/health

## Example .env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flavorfinder
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

## Main API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `POST /api/recipes` (authenticated)
- `PUT /api/recipes/:id` (owner only)
- `DELETE /api/recipes/:id` (owner only)
- `PATCH /api/recipes/:id/like` (authenticated)
- `PATCH /api/recipes/:id/save` (authenticated)
- `GET /api/recipes/user/mine` (authenticated)
- `GET /api/recipes/user/saved` (authenticated)

## Suggested demo flow
1. Register two accounts.
2. Create a recipe with an image URL and ingredients.
3. Search and filter recipes from the home page.
4. Like and save a recipe from another account.
5. Open Pantry Matcher and enter ingredients.
6. Edit or delete a recipe you created.

## Security notes
Passwords are hashed with bcryptjs. JWTs are used for API authentication. The API validates input, checks recipe ownership, and does not return password hashes. For a production deployment, use HTTPS, secure cookie-based token storage, stricter rate limits, and a managed secrets store.
