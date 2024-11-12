# Use an official Node.js runtime as a parent image
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install @expo/ngrok globally
RUN npm install -g @expo/ngrok@^4.1.0

# Copy the rest of the application code to the working directory
COPY . .

# Expose ports for Expo and Metro Bundler
EXPOSE 19000
EXPOSE 8081

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel"]


# Build the Docker image and run the container

# docker build -t pantrypal .
# docker run -p 19000:19000 -p 8081:8081 -v $(pwd):/app pantrypal