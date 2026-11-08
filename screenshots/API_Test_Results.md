# API Test Screenshots — Lab 3 · Books REST API

> **Aurora · Year II Term II · Faculty: Joel Prashanth D**
> All 16 requests tested against `http://localhost:3000`
> Server: Express + SQLite (sql.js) · Node.js v24

---

## 1. GET /books — List all (default)

**Request**
```
GET http://localhost:3000/books
```

**Response — 200 OK**
```json
{
  "message": "success",
  "total": 11,
  "limit": 20,
  "offset": 0,
  "data": [
    { "id": 1, "title": "The Pragmatic Programmer", "author": "David Thomas",     "price": 42.99, "year": 2019, "genre": "Programming" },
    { "id": 2, "title": "Clean Code",               "author": "Robert C. Martin", "price": 29.99, "year": 2008, "genre": "Programming" },
    { "id": 3, "title": "Design Patterns",           "author": "Gang of Four",     "price": 59.99, "year": 1994, "genre": "Programming" },
    { "id": 4, "title": "You Don't Know JS",         "author": "Kyle Simpson",     "price": 24.99, "year": 2015, "genre": "Programming" },
    { "id": 5, "title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling",    "price": 19.99, "year": 1997, "genre": "Fantasy"      },
    { "id": 6, "title": "The Hobbit",                "author": "J.R.R. Tolkien",  "price": 14.99, "year": 1937, "genre": "Fantasy"      },
    { "id": 7, "title": "Dune",                      "author": "Frank Herbert",    "price": 15.00, "year": 1965, "genre": "Sci-Fi"       },
    { "id": 8, "title": "Foundation",                "author": "Isaac Asimov",     "price": 12.99, "year": 1951, "genre": "Sci-Fi"       },
    { "id": 9, "title": "Atomic Habits",             "author": "James Clear",      "price": 18.99, "year": 2018, "genre": "Self-Help"    },
    { "id":10, "title": "Deep Work",                 "author": "Cal Newport",      "price": 16.99, "year": 2016, "genre": "Self-Help"    },
    { "id":11, "title": "New Book",                  "author": "Author",           "price":  9.99, "year": 2023, "genre": "Test"         }
  ]
}
```

---

## 2. GET /books?search_q=harry — Partial title match (LIKE)

**Request**
```
GET http://localhost:3000/books?search_q=harry
```

**Response — 200 OK**
```json
{
  "message": "success",
  "total": 1,
  "limit": 20,
  "offset": 0,
  "data": [
    { "id": 5, "title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling", "price": 19.99, "year": 1997, "genre": "Fantasy" }
  ]
}
```

---

## 3. GET /books?min_price=10&max_price=25 — Price range filter

**Request**
```
GET http://localhost:3000/books?min_price=10&max_price=25
```

**Response — 200 OK**
```json
{
  "message": "success",
  "total": 7,
  "limit": 20,
  "offset": 0,
  "data": [
    { "id": 4,  "title": "You Don't Know JS",                    "author": "Kyle Simpson",   "price": 24.99, "year": 2015, "genre": "Programming" },
    { "id": 5,  "title": "Harry Potter and the Sorcerer's Stone","author": "J.K. Rowling",   "price": 19.99, "year": 1997, "genre": "Fantasy"     },
    { "id": 6,  "title": "The Hobbit",                           "author": "J.R.R. Tolkien", "price": 14.99, "year": 1937, "genre": "Fantasy"     },
    { "id": 7,  "title": "Dune",                                 "author": "Frank Herbert",  "price": 15.00, "year": 1965, "genre": "Sci-Fi"      },
    { "id": 8,  "title": "Foundation",                           "author": "Isaac Asimov",   "price": 12.99, "year": 1951, "genre": "Sci-Fi"      },
    { "id": 9,  "title": "Atomic Habits",                        "author": "James Clear",    "price": 18.99, "year": 2018, "genre": "Self-Help"   },
    { "id": 10, "title": "Deep Work",                            "author": "Cal Newport",    "price": 16.99, "year": 2016, "genre": "Self-Help"   }
  ]
}
```

---

## 4. GET /books?order_by=price&order=DESC&limit=3 — Sort by price DESC

**Request**
```
GET http://localhost:3000/books?order_by=price&order=DESC&limit=3
```

**Response — 200 OK**
```json
{
  "message": "success",
  "total": 11,
  "limit": 3,
  "offset": 0,
  "data": [
    { "id": 3, "title": "Design Patterns",          "author": "Gang of Four",    "price": 59.99, "year": 1994, "genre": "Programming" },
    { "id": 1, "title": "The Pragmatic Programmer", "author": "David Thomas",    "price": 42.99, "year": 2019, "genre": "Programming" },
    { "id": 2, "title": "Clean Code",               "author": "Robert C. Martin","price": 29.99, "year": 2008, "genre": "Programming" }
  ]
}
```

---

## 5. GET /books?limit=3&offset=0 — Pagination

**Request**
```
GET http://localhost:3000/books?limit=3&offset=0
```

**Response — 200 OK**
```json
{
  "message": "success",
  "total": 11,
  "limit": 3,
  "offset": 0,
  "data": [
    { "id": 1, "title": "The Pragmatic Programmer", "author": "David Thomas",    "price": 42.99, "year": 2019, "genre": "Programming" },
    { "id": 2, "title": "Clean Code",               "author": "Robert C. Martin","price": 29.99, "year": 2008, "genre": "Programming" },
    { "id": 3, "title": "Design Patterns",          "author": "Gang of Four",    "price": 59.99, "year": 1994, "genre": "Programming" }
  ]
}
```

---

## 6. GET /books?order_by=password — Invalid order_by → 400

**Request**
```
GET http://localhost:3000/books?order_by=password
```

**Response — 400 Bad Request**
```json
{
  "message": "Invalid order_by value. Allowed: id, title, author, price, year, genre."
}
```

---

## 7. GET /books/1 — Single book (200 OK)

**Request**
```
GET http://localhost:3000/books/1
```

**Response — 200 OK**
```json
{
  "message": "success",
  "data": {
    "id": 1,
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "price": 42.99,
    "year": 2019,
    "genre": "Programming"
  }
}
```

---

## 8. GET /books/9999 — Not found (404)

**Request**
```
GET http://localhost:3000/books/9999
```

**Response — 404 Not Found**
```json
{
  "message": "Book with id 9999 not found."
}
```

---

## 9. POST /books — Create success (201)

**Request**
```
POST http://localhost:3000/books
Content-Type: application/json
```
```json
{
  "title": "The Clean Coder",
  "author": "Robert C. Martin",
  "price": 27.99,
  "year": 2011,
  "genre": "Programming"
}
```

**Response — 201 Created**
```json
{
  "message": "Book created successfully.",
  "data": {
    "id": 12,
    "title": "The Clean Coder",
    "author": "Robert C. Martin",
    "price": 27.99,
    "year": 2011,
    "genre": "Programming"
  }
}
```

---

## 10. POST /books — Missing title → 400

**Request**
```
POST http://localhost:3000/books
Content-Type: application/json
```
```json
{ "author": "No Name", "price": 9 }
```

**Response — 400 Bad Request**
```json
{
  "message": "Validation failed.",
  "errors": ["title is required and must be a non-empty string."]
}
```

---

## 11. POST /books — Non-numeric price → 400

**Request**
```
POST http://localhost:3000/books
Content-Type: application/json
```
```json
{ "title": "Free Book", "author": "Author", "price": "free" }
```

**Response — 400 Bad Request**
```json
{
  "message": "Validation failed.",
  "errors": ["price must be a non-negative number."]
}
```

---

## 12. POST /books — All fields missing → 400

**Request**
```
POST http://localhost:3000/books
Content-Type: application/json
```
```json
{}
```

**Response — 400 Bad Request**
```json
{
  "message": "Validation failed.",
  "errors": [
    "title is required and must be a non-empty string.",
    "author is required and must be a non-empty string.",
    "price is required."
  ]
}
```

---

## 13. PUT /books/1 — Update success (200)

**Request**
```
PUT http://localhost:3000/books/1
Content-Type: application/json
```
```json
{
  "title": "The Pragmatic Programmer (2nd Ed)",
  "author": "David Thomas",
  "price": 44.99
}
```

**Response — 200 OK**
```json
{
  "message": "Book updated successfully.",
  "data": {
    "id": 1,
    "title": "The Pragmatic Programmer (2nd Ed)",
    "author": "David Thomas",
    "price": 44.99,
    "year": 2019,
    "genre": "Programming"
  }
}
```

---

## 14. PUT /books/9999 — Not Found (404)

**Request**
```
PUT http://localhost:3000/books/9999
Content-Type: application/json
```
```json
{ "title": "Ghost", "author": "Nobody", "price": 1 }
```

**Response — 404 Not Found**
```json
{
  "message": "Book with id 9999 not found."
}
```

---

## 15. DELETE /books/11 — Success (200)

**Request**
```
DELETE http://localhost:3000/books/11
```

**Response — 200 OK**
```json
{
  "message": "Book with id 11 deleted successfully."
}
```

---

## 16. DELETE /books/9999 — Not Found (404)

**Request**
```
DELETE http://localhost:3000/books/9999
```

**Response — 404 Not Found**
```json
{
  "message": "Book with id 9999 not found."
}
```

---

## Summary Table

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
