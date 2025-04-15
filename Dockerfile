# Use Node.js for development
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the development port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]