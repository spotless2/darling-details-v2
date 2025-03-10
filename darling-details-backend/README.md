# Darling Details Backend

Backend API for the Darling Details e-commerce system.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/darling-details-v2.git
cd darling-details-v2/darling-details-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your details.

4. Start the development server:
```bash
npm run dev
```

## Features

- User authentication with JWT
- Product management with image optimization
- Category management
- Store settings management

## API Documentation

API documentation is available in the `/docs` folder.

## Production Deployment Checklist

Before deploying to production:

1. Set secure passwords and JWT secret in `.env`
2. Set NODE_ENV=production
3. Implement proper password hashing (currently uses plaintext)
4. Set up proper HTTPS in production
5. Consider implementing rate limiting for API endpoints

## License

[MIT](LICENSE)
