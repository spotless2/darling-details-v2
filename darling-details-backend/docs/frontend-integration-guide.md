# Darling Details Frontend Integration Guide

This guide provides comprehensive instructions for developing a frontend application that integrates with the Darling Details backend API.

## Table of Contents
1. [Authentication](#authentication)
2. [Store Settings](#store-settings)
3. [Products](#products)
4. [Image Handling](#image-handling)
5. [Best Practices](#best-practices)

## Authentication

### Login Flow
- **Endpoint**: `POST /api/users/login`
- **Request Body**:
  ```json
  {
    "email": "admin@darlingdetails.com",
    "password": "adminpassword"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@darlingdetails.com"
    }
  }
  ```
- **Implementation Notes**:
  - Store the JWT token in localStorage/sessionStorage
  - Include token in all subsequent authenticated requests
  - Redirect to admin panel after successful login

### Token Verification
- **Endpoint**: `GET /api/users/verify-token`
- **Headers**: `x-auth-token: your-jwt-token`
- **Response**: 
  ```json
  {
    "valid": true,
    "user": {
      "id": 1,
      "email": "admin@darlingdetails.com",
      "name": "Admin User"
    }
  }
  ```
- **Implementation Notes**:
  - Use this endpoint to verify token validity before accessing protected routes
  - Create a route guard that checks token validity

### Authentication Best Practices
- Always verify the token before displaying protected content
- Handle token expiration by redirecting users to login page
- Store tokens securely; avoid storing in cookies without proper security measures
- Implement automatic token refresh if needed for longer sessions

## Store Settings

### Get Store Settings
- **Endpoint**: `GET /api/store-settings`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "storeName": "Darling Details",
      "contactEmail": "contact@darlingdetails.com",
      "contactPhone": "555-123-4567",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```
- **Implementation Notes**:
  - This is a public endpoint - no authentication required
  - Use this data to display store info in header/footer
  - Show contact information on contact pages

### Update Store Settings (Admin Only)
- **Endpoint**: `PUT /api/store-settings`
- **Headers**: `x-auth-token: your-jwt-token`
- **Request Body**:
  ```json
  {
    "storeName": "Updated Store Name",
    "contactEmail": "new@example.com",
    "contactPhone": "555-987-6543"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Store settings updated successfully",
    "data": {
      "id": 1,
      "storeName": "Updated Store Name",
      "contactEmail": "new@example.com",
      "contactPhone": "555-987-6543",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
  ```
- **Validation**:
  - Store name must be 2-100 characters
  - Email must be a valid format
  - Phone number must match pattern `/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/`

### Create Store Settings (Admin Only, rare usage)
- **Endpoint**: `POST /api/store-settings`
- **Headers**: `x-auth-token: your-jwt-token`
- **Request Body**: Same format as Update endpoint
- **Note**: This endpoint is rarely needed as store settings are automatically created on server startup

## Products

### Get All Products (with filtering)
- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `name`: Filter by name (optional)
  - `minPrice`: Minimum price (optional)
  - `maxPrice`: Maximum price (optional)
  - `inStock`: Set to 'true' to show only in-stock products (optional)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Product Name",
        "price": "29.99",
        "description": "Product description",
        "quantity": 10,
        "image": "filename.webp",
        "imageUrl": "/uploads/optimized/filename.webp",
        "thumbnailUrl": "/uploads/thumbnails/filename-thumb.webp",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "totalPages": 5,
      "currentPage": 1,
      "limit": 10
    }
  }
  ```
- **Implementation Notes**:
  - This is a public endpoint - no authentication required
  - Always display thumbnails in product listings
  - Implement pagination using the provided meta information
  - Use filter parameters to create search, price range filters, etc.

### Get Single Product
- **Endpoint**: `GET /api/products/:id`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Product Name",
      "price": "29.99",
      "description": "Product description",
      "quantity": 10,
      "image": "filename.webp",
      "imageUrl": "/uploads/optimized/filename.webp",
      "thumbnailUrl": "/uploads/thumbnails/filename-thumb.webp",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```
- **Implementation Notes**:
  - Public endpoint - no authentication required
  - Use for product detail pages
  - Display the full-size image (`imageUrl`) for product details

### Create Product (Admin Only)
- **Endpoint**: `POST /api/products`
- **Headers**: `x-auth-token: your-jwt-token`
- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `name`: Product name (required, 2-100 chars)
  - `price`: Product price (required, > 0)
  - `description`: Product description (optional)
  - `quantity`: Available quantity (optional, >= 0)
  - `image`: Product image file (optional, jpg/jpeg/png/gif/webp only)

### Update Product (Admin Only)
- **Endpoint**: `PUT /api/products/:id`
- **Headers**: `x-auth-token: your-jwt-token`
- **Request Format**: `multipart/form-data` or `application/json`
- **Form/JSON Fields**: Same as Create Product
- **Implementation Notes**:
  - For JSON requests, image will not be updated
  - For form-data requests with image, existing image will be replaced
  - Only include fields you want to update

### Delete Product (Admin Only)
- **Endpoint**: `DELETE /api/products/:id`
- **Headers**: `x-auth-token: your-jwt-token`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

## Image Handling

### Image Optimization Features
The backend automatically:
1. Converts uploaded images to WebP format
2. Resizes large images to max dimensions of 1200x1500px
3. Creates 300x300px thumbnails
4. Sets appropriate cache headers

### Best Practices for Images
- Always use the `thumbnailUrl` for product listings
- Only load full-size `imageUrl` on product detail pages
- Add loading="lazy" attribute to image tags
- Implement image placeholders during loading
- Use responsive images with srcset when needed

### Image URLs
- Main image: `/uploads/optimized/[filename].webp`
- Thumbnail: `/uploads/thumbnails/[filename]-thumb.webp`
- The server sets 1-day cache headers for images

## Best Practices

### API Request Patterns
- Always include JWT token for protected routes via `x-auth-token` header
- Handle 401 errors by redirecting to login page
- Implement proper error handling for API requests
- Use a centralized API request function/service

### Error Handling
- Display validation errors next to form fields
- Show meaningful messages for server errors
- Implement retry logic for network failures when appropriate

### Authentication State Management
- Centralize authentication logic
- Check token validity before accessing protected admin routes
- Provide a clear logout function that cleans up auth state

### Performance Considerations
- Implement pagination for all product listings
- Use image thumbnails in listing pages to reduce bandwidth usage
- Implement caching of non-frequently-changing data like store settings

### Security Guidelines
- Never store sensitive information in localStorage/sessionStorage
- Always validate inputs on the frontend before submission
- Implement proper CSRF protection
- Always use HTTPS in production
