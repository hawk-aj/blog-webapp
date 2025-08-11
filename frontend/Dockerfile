# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache mounted to improve rebuild speed
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Add nginx performance optimization
RUN echo "worker_processes auto;" > /etc/nginx/nginx.conf \
    && echo "events { worker_connections 1024; }" >> /etc/nginx/nginx.conf \
    && echo "http { include /etc/nginx/conf.d/*.conf; }" >> /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY simple-nginx.conf /etc/nginx/conf.d/default.conf

# Create cache directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && chmod 700 /var/cache/nginx/*

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
