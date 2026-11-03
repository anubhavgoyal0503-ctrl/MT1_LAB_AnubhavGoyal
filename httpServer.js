import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlPath = path.join(__dirname, "public", "index.html");

const books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 299 },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 450 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(message);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body.trim() ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body"));
      }
    });
    req.on("error", reject);
  });
}

function validateBook(book) {
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return "Request body must be a JSON object";
  }
  if (book.id === undefined || !Number.isInteger(Number(book.id)) || Number(book.id) <= 0) {
    return "A positive integer id is required";
  }
  if (typeof book.title !== "string" || !book.title.trim()) return "A non-empty title is required";
  if (typeof book.author !== "string" || !book.author.trim()) return "A non-empty author is required";
  if (book.price === undefined || !Number.isFinite(Number(book.price)) || Number(book.price) < 0) {
    return "A valid non-negative price is required";
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;

  if (req.method === "GET" && pathname === "/") {
    return sendText(res, 200, "<h1>Welcome to the Library Book Management Application</h1><p>Node.js HTTP module demonstration.</p>");
  }

  if (req.method === "GET" && pathname === "/books") {
    return sendJson(res, 200, books);
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendText(res, 200, "<h1>About</h1><p>This library application demonstrates Node.js HTTP routing, JSON responses and file serving.</p>");
  }

  if (req.method === "GET" && pathname === "/home") {
    return fs.readFile(htmlPath, "utf8", (error, html) => {
      if (error) {
        console.error("Unable to read public/index.html:", error.message);
        return sendJson(res, 500, { error: "Unable to load the home page" });
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }

  if (req.method === "POST" && pathname === "/add-book") {
    try {
      const book = await readJsonBody(req);
      const validationError = validateBook(book);
      if (validationError) return sendJson(res, 400, { error: validationError });
      if (books.some(existing => existing.id === Number(book.id))) {
        return sendJson(res, 409, { error: "A book with this id already exists" });
      }
      const newBook = {
        id: Number(book.id),
        title: book.title.trim(),
        author: book.author.trim(),
        price: Number(book.price)
      };
      books.push(newBook);
      return sendJson(res, 201, { message: "Book added successfully", book: newBook });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Invalid request" });
    }
  }

  return sendJson(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
