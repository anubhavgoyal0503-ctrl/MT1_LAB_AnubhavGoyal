
# MT1-LABEXAM — Library Book Management Web Application


A college Full Stack Development lab project built exactly around the supplied practical requirements.

## Technologies
- Node.js with ES Modules
- Built-in `http` and `fs` modules (Part A)
- Express.js and `express.json()` (Part B)
- JavaScript arrays as in-memory storage (no database)

## Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── index.html
├── screenshots/
│   └── .gitkeep
└── README.md
```

## Requirements
Install a current Node.js LTS release. Verify installation:

```bash
node -v
npm -v
```

## Setup

Open a terminal in this folder:

```bash
npm install
```

## Run Part A — HTTP and FS modules

Terminal 1:

```bash
node httpServer.js
```

Expected message: `HTTP Server running at http://localhost:3000`

Open these URLs in a browser:

| Method | URL | Expected result |
|---|---|---|
| GET | `http://localhost:3000/` | Welcome HTML |
| GET | `http://localhost:3000/books` | Books as JSON |
| GET | `http://localhost:3000/about` | About information |
| GET | `http://localhost:3000/home` | `public/index.html` served using `fs.readFile()` |
| POST | `http://localhost:3000/add-book` | Adds a book to the in-memory array |

POST `/add-book` JSON example:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

Use `Content-Type: application/json`. The server returns HTTP 201 when successful, 400 for invalid input, and 409 for a duplicate ID.

## Run Part B — Express REST API

Keep Part A running. Open a second terminal:

```bash
node expressApp.js
```

Expected message: `Express Server running at http://localhost:4000`

Test using EchoAPI, Postman, Thunder Client, or another HTTP client:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `http://localhost:4000/books` | Get all books |
| GET | `http://localhost:4000/books/1` | Get book with ID 1 |
| POST | `http://localhost:4000/books` | Add a book |
| PUT | `http://localhost:4000/books/1` | Update book 1 |
| DELETE | `http://localhost:4000/books/1` | Delete book 1 |

For POST, select Body → raw → JSON:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

For PUT, send JSON fields to update, for example:

```json
{
  "title": "Clean Code - Updated",
  "price": 600,
  "category": "Programming"
}
```

Successful POST returns status 201. Missing book returns 404. Invalid JSON or invalid fields return 400. Duplicate IDs return 409.

**Important:** Data is stored in JavaScript arrays. It is temporary and resets when the relevant server process restarts. Part A and Part B have separate arrays.

## Practical demonstration sequence

1. Start `httpServer.js`; show the terminal start message.
2. Open `/`, `/books`, `/about`, and `/home`.
3. Use EchoAPI to POST a book to `http://localhost:3000/add-book`, then GET `/books`.
4. Start `expressApp.js` in another terminal.
5. In EchoAPI, demonstrate GET all, GET by ID, POST, PUT, and DELETE.
6. Demonstrate a missing ID to show the 404 response.
7. Capture screenshots and save them in `screenshots/`.

## Suggested screenshots for submission

- `01-http-server.png` — terminal showing HTTP server running.
- `02-http-routes.png` — browser showing `/books` or `/`.
- `03-fs-home.png` — browser showing `/home`.
- `04-express-server.png` — terminal showing Express server running.
- `05-get-all-books.png` — EchoAPI GET all books.
- `06-get-book-by-id.png` — EchoAPI GET one book.
- `07-post-book.png` — EchoAPI POST with 201 response.
- `08-put-book.png` — EchoAPI PUT update response.
- `09-delete-book.png` — EchoAPI DELETE response.
- `10-github-commits.png` — GitHub repository and commit history.

Screenshots must be captured from your own running application; do not submit fabricated screenshots.

## GitHub submission

Create a GitHub repository named **MT1-LABEXAM**. Then, from this project folder:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/MT1-LABEXAM.git
git push -u origin main
```

After making and testing changes, update the repository with meaningful commits, for example:

```bash
git add .
git commit -m "Implement HTTP server and FS file serving"
git push
git add .
git commit -m "Implement Express book CRUD API"
git push
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

# Practical and viva preparation

## 1. Project introduction

The Library Book Management Web Application is a Node.js project that demonstrates server creation, routing, HTTP methods, file handling, and REST API development. It has two independent servers: a native Node.js HTTP server on port 3000 and an Express.js server on port 4000. Book records are stored in JavaScript arrays, so no database is required.

## 2. Objective

- Create a server using Node.js HTTP module.
- Handle routes and HTTP methods.
- Serve an HTML file using the FS module.
- Build REST APIs using Express.js.
- Implement Create, Read, Update and Delete (CRUD).
- Return suitable JSON responses and HTTP status codes.

## 3. Implementation explanation

### Part A — `httpServer.js`

- `http` is imported from Node.js built-ins.
- `http.createServer()` creates the server.
- `server.listen(3000)` starts it on port 3000.
- `req.method` and URL pathname are checked to implement routing.
- GET `/books` returns the books array as JSON.
- POST `/add-book` reads incoming chunks, parses JSON, validates fields and adds a record.
- `fs.readFile()` reads `public/index.html` for GET `/home`.
- `writeHead()` sets status and Content-Type.
- Unknown routes return 404.

### Part B — `expressApp.js`

- Express is imported and an application is created.
- `express.json()` parses JSON request bodies.
- A sample array contains three books.
- `app.get()` reads books.
- `app.post()` creates a book.
- `app.put()` updates a book.
- `app.delete()` removes a book.
- `:id` is a route parameter used to identify a book.
- `res.status().json()` sends JSON with an HTTP status code.

## 4. Important code concepts

| Code | Meaning |
|---|---|
| `http.createServer()` | Creates a native HTTP server |
| `server.listen(3000)` | Starts server on port 3000 |
| `fs.readFile()` | Reads a file asynchronously |
| `express()` | Creates an Express application |
| `express.json()` | Parses incoming JSON |
| `app.get()` | Handles GET requests |
| `app.post()` | Handles POST requests |
| `app.put()` | Handles PUT requests |
| `app.delete()` | Handles DELETE requests |
| `req.params.id` | Reads ID from route parameter |
| `req.body` | Reads parsed request body |
| `res.status(201).json()` | Sends JSON with status 201 |

## 5. 30 practical viva questions with answers

1. **What is Node.js?**  
   Node.js is a JavaScript runtime that allows JavaScript to run outside a browser.

2. **What is the HTTP module?**  
   It is a built-in Node.js module used to create HTTP servers and handle requests and responses.

3. **What does `http.createServer()` do?**  
   It creates an HTTP server and accepts a callback to handle incoming requests.

4. **What is a port number?**  
   A port identifies a particular application or service on a computer. This project uses 3000 and 4000.

5. **What is routing?**  
   Routing means deciding what response to send based on the requested URL and HTTP method.

6. **What is the FS module?**  
   The File System module provides methods to work with files and directories.

7. **What does `fs.readFile()` do?**  
   It asynchronously reads the contents of a file.

8. **Why is `index.html` placed in the `public` folder?**  
   It keeps the HTML page organized separately from server code.

9. **What is Express.js?**  
   Express.js is a Node.js web framework used to build web applications and APIs.

10. **Why are two servers used?**  
    Part A demonstrates native HTTP and FS modules, while Part B demonstrates Express REST APIs.

11. **What is middleware?**  
    Middleware is a function that runs during the request-response cycle.

12. **What does `express.json()` do?**  
    It parses incoming JSON request bodies and makes the result available in `req.body`.

13. **What is a REST API?**  
    A REST API exposes resources through URLs and uses HTTP methods to perform operations.

14. **What is CRUD?**  
    CRUD stands for Create, Read, Update and Delete.

15. **What is the GET method?**  
    GET retrieves information from the server.

16. **What is the POST method?**  
    POST sends data to the server to create a resource.

17. **What is the PUT method?**  
    PUT updates an existing resource.

18. **What is the DELETE method?**  
    DELETE removes a resource.

19. **What is a route parameter?**  
    It is a variable part of a route, such as `:id` in `/books/:id`.

20. **What is `req.params.id`?**  
    It reads the ID value supplied in the URL.

21. **What is `req.body`?**  
    It contains data sent in the request body after suitable body-parsing middleware processes it.

22. **What is JSON?**  
    JSON stands for JavaScript Object Notation. It is a text format used to exchange structured data.

23. **What is HTTP status code 200?**  
    It means the request was successful.

24. **What is HTTP status code 201?**  
    It means a resource was successfully created.

25. **What is HTTP status code 400?**  
    It means the request contains invalid data or syntax.

26. **What is HTTP status code 404?**  
    It means the requested route or resource was not found.

27. **What is HTTP status code 409?**  
    It indicates a conflict, such as attempting to create a duplicate book ID.

28. **Why is an array used instead of a database?**  
    The practical instructions explicitly require JavaScript arrays and do not require a database.

29. **What happens to array data when the server restarts?**  
    The data resets because it is stored in memory and is not permanently saved.

30. **What is the difference between Node.js HTTP and Express.js?**  
    The HTTP module is a built-in low-level server module, while Express provides higher-level routing and middleware features.

## 6. Quick demonstration checklist

- [ ] Run `npm install`.
- [ ] Run `node httpServer.js`.
- [ ] Demonstrate all four GET routes on port 3000.
- [ ] Demonstrate POST `/add-book`.
- [ ] Run `node expressApp.js` in a second terminal.
- [ ] Demonstrate all five CRUD endpoints on port 4000.
- [ ] Show invalid ID / 404 response.
- [ ] Capture genuine screenshots.
- [ ] Push the project to GitHub.
=======
# MT1_LAB_AnubhavGoyal
>>>>>>> 80eb139d9464d664cd103ebeba830d9eef2a0147
