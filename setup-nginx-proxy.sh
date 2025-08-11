#!/bin/bash

# This script sets up Nginx as a reverse proxy for the portfolio application
# and restarts the Docker containers with the updated configuration

# Exit on any error
set -e

echo "Setting up Nginx reverse proxy for portfolio application..."

# Copy the Nginx configuration file
echo "Copying Nginx configuration file..."
sudo cp portfolio-proxy.conf /etc/nginx/sites-available/

# Create a symbolic link to enable the site
echo "Creating symbolic link to enable the site..."
sudo ln -sf /etc/nginx/sites-available/portfolio-proxy.conf /etc/nginx/sites-enabled/

# Remove the default site if it exists
echo "Removing default site if it exists..."
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx to apply changes
echo "Reloading Nginx to apply changes..."
sudo systemctl reload nginx

# Restart Docker containers with the updated configuration
echo "Restarting Docker containers with the updated configuration..."
docker-compose down
docker-compose up -d

echo "Setup complete! Your portfolio application should now be accessible at http://localhost"
echo "The frontend container is running on port 8080, but Nginx is proxying requests from port 80."
