import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 299, category: "Biography" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 450, category: "Self-help" }
];

function validateBook(body, requireId = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Request body must be a JSON object";
  if (requireId && (body.id === undefined || !Number.isInteger(Number(body.id)) || Number(body.id) <= 0)) {
    return "A positive integer id is required";
  }
  if (body.title !== undefined && (typeof body.title !== "string" || !body.title.trim())) {
    return "Title must be a non-empty string";
  }
  if (body.author !== undefined && (typeof body.author !== "string" || !body.author.trim())) {
    return "Author must be a non-empty string";
  }
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) {
    return "Price must be a valid non-negative number";
  }
  if (body.category !== undefined && (typeof body.category !== "string" || !body.category.trim())) {
    return "Category must be a non-empty string";
  }
  if (requireId && (!body.title?.trim() || !body.author?.trim() || body.price === undefined)) {
    return "title, author and price are required";
  }
  return null;
}

// GET /books - retrieve all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id - retrieve one book
app.get("/books/:id", (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  return res.status(200).json(book);
});

// POST /books - create a book
app.post("/books", (req, res) => {
  const validationError = validateBook(req.body, true);
  if (validationError) return res.status(400).json({ error: validationError });

  const id = Number(req.body.id);
  if (books.some(book => book.id === id)) {
    return res.status(409).json({ error: "A book with this id already exists" });
  }

  const newBook = {
    id,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    price: Number(req.body.price),
    category: typeof req.body.category === "string" && req.body.category.trim()
      ? req.body.category.trim()
      : "General"
  };
  books.push(newBook);
  return res.status(201).json({ message: "Book added successfully", book: newBook });
});

// PUT /books/:id - update an existing book
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const validationError = validateBook(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Provide at least one field to update" });
  }

  if (req.body.title !== undefined) book.title = req.body.title.trim();
  if (req.body.author !== undefined) book.author = req.body.author.trim();
  if (req.body.price !== undefined) book.price = Number(req.body.price);
  if (req.body.category !== undefined) book.category = req.body.category.trim();

  return res.status(200).json({ message: "Book updated successfully", book });
});

// DELETE /books/:id - delete a book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const [deletedBook] = books.splice(index, 1);
  return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
});

// Malformed JSON and other Express errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON request body" });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
