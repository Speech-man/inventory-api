# Group 3: Project 9: Inventory API

A simple REST API for managing products and keeping track of which ones are low or out of stock.

## How to run it

You need Node.js (v18 or newer).

```
git clone https://github.com/Speech-man/inventory-api.git
cd inventory-api
npm install
npm start
```

The server runs on http://localhost:3000. Start it from the project folder, not from somewhere else (see Known Issues).

To run the tests:

- `npm test` runs the validation tests.
- `npm run test:api` runs the endpoint tests. The server has to be running in another terminal first.

## Product fields

- id (string): made automatically, always unique
- name (string): required
- quantity (number): required, 0 or more
- price (number): required, 0 or more
- category (string): required
- lowStockThreshold (number): optional, default is 5
- createdAt (string): set when the product is created
- updatedAt (string): changes every time the product is updated

Validation rules:

- name and category must be non-empty strings.
- quantity must be a whole number, 0 or more.
- price must be a number, 0 or more.
- lowStockThreshold, if given, must be a whole number, 0 or more.
- On PUT, every field is optional, but any field you send must still be valid.

## Stock rules

- Low stock: quantity is more than 0 and not more than lowStockThreshold.
- Out of stock: quantity is 0.

## Response format

Successful responses are JSON with `success: true`, a `message`, and the result in `data`. Errors from the routes (such as 404) have `success: false` and a `message`. Validation errors (400) come from the validator and have an `error` and a `details` list instead.

## Endpoints

- GET /resources: get all products
- GET /resources/low-stock: get products that are low on stock
- GET /resources/out-of-stock: get products that are out of stock
- GET /resources/:id: get one product
- POST /resources: add a product
- PUT /resources/:id: update a product
- DELETE /resources/:id: delete a product

### GET /resources

Response (200):
```json
{
  "success": true,
  "message": "All products retrieved successfully",
  "data": [
    {
      "id": "3f1c2a6e-8b7d-4c1e-9a52-1d2e3f4a5b6c",
      "name": "Pen",
      "quantity": 10,
      "price": 50,
      "category": "Stationery",
      "lowStockThreshold": 5,
      "createdAt": "2026-11-15T10:00:00.000Z",
      "updatedAt": "2026-11-15T10:00:00.000Z"
    }
  ]
}
```

### POST /resources

Request:
```json
{ "name": "Pen", "quantity": 10, "price": 50, "category": "Stationery" }
```

Response (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "3f1c2a6e-8b7d-4c1e-9a52-1d2e3f4a5b6c",
    "name": "Pen",
    "quantity": 10,
    "price": 50,
    "category": "Stationery",
    "lowStockThreshold": 5,
    "createdAt": "2026-11-15T10:00:00.000Z",
    "updatedAt": "2026-11-15T10:00:00.000Z"
  }
}
```

### GET /resources/:id

Response (200): the product is in `data`, with the message "Product retrieved successfully".

If the id doesn't exist (404):
```json
{ "success": false, "message": "Product not found" }
```

### PUT /resources/:id

You only need to send the fields you want to change.

Request:
```json
{ "quantity": 4 }
```

Response (200): `data` holds the updated product with a new updatedAt, and the message is "Product updated successfully". If the id doesn't exist you get 404 with "Product not found".

### DELETE /resources/:id

Response (200):
```json
{ "success": true, "message": "Product deleted successfully" }
```

If the id doesn't exist you get 404 with "Product not found".

### GET /resources/low-stock

Response (200): `data` is a list of the products that count as low stock.

### GET /resources/out-of-stock

Response (200): `data` is a list of the products with quantity 0.

### Validation error

If the data is wrong, for example an empty body, the API returns 400.

Request:
```json
{}
```

Response (400):
```json
{
  "error": "Validation failed",
  "details": [
    "name is required",
    "category is required",
    "quantity is required",
    "price is required"
  ]
}
```

## Team

- David Ikechukwu: Routes (routes/productRoutes.js, server.js)
- David Ikechukwu: Routes (reviewed and tested the routes)
- Babarinde Elijah: File storage (data/storage.js)
- Babarinde Elijah: File storage (services/productService.js)
- Ernest Olamide Sanni: Validation (middleware/validate.js)
- David Ampofo: Validation (reviewed the validation PR)
- Babarinde Elijah: Testing and README (tests/validation.test.js)
- Darko Magdalene Yaa: Testing and README (README.md)
- Deborah: Testing
- Emmanuel Alinyoh-Dotun: Testing and GitHub review 
- Destiny Chika Jonathan: Testing and GitHub review
- Babarinde Elijah: GitHub repository creation
- Emmanuel Ekop Bassey: GitHub review
- EGBA HENRY CHUKWUEMEKA: GitHUb review


## Known issues

- Start the server from the project root. The path to the data file is relative, so it breaks if you start it from another folder.
- `npm run test:api` needs the server running, and it changes data/products.json.
- Storing products in a JSON file won't work well if many people use the API at the same time.