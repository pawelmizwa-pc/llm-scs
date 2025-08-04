#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}### Setting up Ollama API with self-signed SSL certificate...${NC}"

# Create SSL directory
mkdir -p ./nginx/ssl

# Generate self-signed certificate if it doesn't exist
if [ ! -f "./nginx/ssl/cert.pem" ]; then
    echo -e "${YELLOW}Generating self-signed SSL certificate...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./nginx/ssl/key.pem \
        -out ./nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    
    chmod 644 ./nginx/ssl/cert.pem
    chmod 600 ./nginx/ssl/key.pem
    echo -e "${GREEN}Self-signed certificate generated successfully!${NC}"
else
    echo -e "${YELLOW}Self-signed certificate already exists, skipping generation...${NC}"
fi

echo -e "${GREEN}### Starting services...${NC}"
docker-compose up -d

echo -e "${GREEN}### Setup complete!${NC}"
echo -e "${YELLOW}Access your API at: https://your-server-ip${NC}"
echo -e "${YELLOW}Note: Use -k flag with curl to skip certificate verification${NC}"
echo ""
echo -e "${YELLOW}To pull the Ollama model, run:${NC}"
echo -e "${GREEN}docker exec ollama ollama pull gemma2:9b${NC}"