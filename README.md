# Lab 3 — REST API · Backend Development Fundamentals

> **Year II · Term II · Aurora**  
> Faculty: Joel Prashanth D  
> Content weeks 3 (slots 13-19)

---

## Project structure

```
books-api-lab3/
├── src/
│   ├── routes/
│   │   └── books.js          # All CRUD + search/sort/filter routes
│   ├── validators/
│   │   └── bookValidator.js  # Input validation logic
│   └── middleware/
│       └── errorHandler.js   # Global error handler
├── debug_exercise/
│   ├── broken_server.js      # 4 deliberate bugs for students to fix
│   └── fixed_server.js       # Reference solution (don't peek!)
├── postman/
│   └── Books_API_Lab3.postman_collection.json
├── screenshots/
│   └── API_Test_Results.md   # All 16 live request/response results
├── database.js               # SQLite connection + schema
├── seed.js                   # Sample data loader (node seed.js)
├── server.js                 # Express app entry-point
├── .env.example              # Template — copy to .env (never commit .env)
├── .gitignore
└── package.json
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and set your PORT
cp .env.example .env

# 3. (Optional) Seed sample data
npm run seed

# 4. Start the server (reads PORT from .env)
npm start

# 5. Dev mode with auto-reload
npm run dev
```

Server listens on **http://localhost:3000** by default.

---

## API Endpoints

### Books resource  (`/books`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/books` | List books (search, sort, filter, paginate) |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Create a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

### GET /books — Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search_q` | string | `""` | Partial title match (LIKE) |
| `order_by` | string | `id` | Column to sort by (`id`, `title`, `author`, `price`, `year`, `genre`) |
| `order` | string | `ASC` | Sort direction (`ASC` or `DESC`) |
| `limit` | integer | `20` | Rows per page (1–100) |
| `offset` | integer | `0` | Rows to skip |
| `min_price` | number | — | Minimum price (inclusive) |
| `max_price` | number | — | Maximum price (inclusive) |

### Response shapes

**Success list:**
```json
{
  "message": "success",
  "total": 42,
  "limit": 20,
  "offset": 0,
  "data": [ ... ]
}
```

**Success single:**
```json
{ "message": "success", "data": { ... } }
```

**Created (201):**
```json
{ "message": "Book created successfully.", "data": { ... } }
```

**Error (4xx):**
```json
{ "message": "Validation failed.", "errors": [ "price is required." ] }
```

**Not found (404):**
```json
{ "message": "Book with id 9999 not found." }
```

---

## Status Code Summary

| Situation | Code |
|-----------|------|
| Successful read / update / delete | 200 |
| Successful create | 201 |
| Bad request / validation error | 400 |
| Resource not found | 404 |
| Server error | 500 |

---

## Debugging Exercise

Open `debug_exercise/broken_server.js`. It contains **four deliberate bugs**:

1. **EADDRINUSE** — port already in use  
2. **Wrong DB path** — database file not found (empty db loaded instead)  
3. **Table-name typo** — `no such table: book`  
4. **Missing await** — server starts before the database is ready → routes crash with `Database not initialised`  

Fix each bug, then compare with `fixed_server.js`.

---

## Postman Testing

Import `postman/Books_API_Lab3.postman_collection.json` into Postman.  
The collection covers **16 requests** across all endpoints — both success and failure cases.

See [`screenshots/API_Test_Results.md`](./screenshots/API_Test_Results.md) for all 16 live request/response results.

---

## Test Results Summary (All 16 Passed ✅)

| # | Endpoint | Status | Result |
|---|----------|--------|--------|
| 1 | GET /books | 200 | ✅ 11 books returned |
| 2 | GET /books?search_q=harry | 200 | ✅ 1 book found |
| 3 | GET /books?min_price=10&max_price=25 | 200 | ✅ 7 books in range |
| 4 | GET /books?order_by=price&order=DESC&limit=3 | 200 | ✅ Top 3 by price |
| 5 | GET /books?limit=3&offset=0 | 200 | ✅ First page |
| 6 | GET /books?order_by=password | 400 | ✅ Rejected invalid column |
| 7 | GET /books/1 | 200 | ✅ Single book |
| 8 | GET /books/9999 | 404 | ✅ Not found |
| 9 | POST /books (valid) | 201 | ✅ Created id=12 |
| 10 | POST /books (missing title) | 400 | ✅ Validation error |
| 11 | POST /books (price='free') | 400 | ✅ Validation error |
| 12 | POST /books ({}) | 400 | ✅ All 3 errors returned |
| 13 | PUT /books/1 (valid) | 200 | ✅ Updated |
| 14 | PUT /books/9999 | 404 | ✅ Not found |
| 15 | DELETE /books/11 | 200 | ✅ Deleted |
| 16 | DELETE /books/9999 | 404 | ✅ Not found |

---

## Viva Answers (Quick Reference)

**Query parameter vs path parameter?**  
A *path parameter* (`:id`) identifies a specific resource and is part of the URL path.  
A *query parameter* (`?search_q=…`) filters, sorts, or paginates a collection and appears after `?`.

**What does stateless mean?**  
Each HTTP request carries all the information the server needs; the server keeps no session state between requests.

**Status code for bad input vs missing record?**  
`400 Bad Request` for invalid/missing input data.  
`404 Not Found` when the requested resource does not exist.

---

## Rules

- Never commit `.env` or `node_modules/`.
- Passwords are never stored or logged in plain text.
- Every route returns the correct HTTP status code.
- Always use parameterised queries — never build SQL by string concatenation.
