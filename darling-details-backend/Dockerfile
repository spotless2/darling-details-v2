FROM node:20-alpine

WORKDIR /app

# Install system dependencies needed by sharp (image processing)
RUN apk add --no-cache vips-dev build-base python3

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
