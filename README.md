# Library Management System — Web Version

A simple browser-based Library Management System built with Java 17, Spring Boot, HTML, CSS, and JavaScript.

## Features

- Add books with title, author, ISBN, and availability
- Display all books in a table
- Remove a book by ISBN
- Reject duplicate ISBN values
- Responsive interface for desktop and mobile
- JSON API at `/api/books`

## Important limitation

This starter version stores books in application memory. The collection resets when the application restarts or is redeployed. Add a persistent database (for example PostgreSQL) before using this for real data or a production library.

## Run locally

Requirements: JDK 17+ and Maven 3.9+.

From the project folder:

```bash
mvn spring-boot:run
```

Open <http://localhost:8080>.

Alternatively, build and run the JAR:

```bash
mvn clean package
java -jar target/library-management-web-1.0.0.jar
```

## Deploy online with Render

This project includes a `Dockerfile` and `render.yaml`.

1. Create or sign in to GitHub at <https://github.com/>.
2. Create a new repository.
3. Upload all files and folders from this project to the repository (keep the folder structure).
4. Sign in to Render at <https://render.com/> and choose **New + → Blueprint**.
5. Connect your GitHub account and select the repository containing `render.yaml`.
6. Review the service and deploy it.
7. When the deployment completes, open the public `onrender.com` URL shown in the Render dashboard.

Render's available free plans and policies can change; check the current dashboard before deploying. The first build can take several minutes.

## API quick reference

- `GET /api/books` — list books
- `POST /api/books` — add a book, JSON example:

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "isbn": "9780061122415",
  "availability": true
}
```

- `DELETE /api/books/{isbn}` — remove a book by ISBN
