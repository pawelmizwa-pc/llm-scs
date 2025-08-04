#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}### Setting up Ollama API Service...${NC}"

# Stop and disable Apache2 if it's running (common on Ubuntu EC2)
if systemctl is-active --quiet apache2; then
    echo -e "${YELLOW}Stopping Apache2 to free up port 80...${NC}"
    sudo systemctl stop apache2
    sudo systemctl disable apache2
fi

# Also check for nginx
if systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}Stopping Nginx to free up port 80...${NC}"
    sudo systemctl stop nginx
    sudo systemctl disable nginx
fi

echo -e "${GREEN}### Starting services...${NC}"
docker compose up -d

echo -e "${GREEN}### Setup complete!${NC}"
echo -e "${YELLOW}Access your API at: http://your-server-ip${NC}"
echo ""
echo -e "${YELLOW}To pull the Ollama model, run:${NC}"
echo -e "${GREEN}docker exec ollama ollama pull gemma2:9b${NC}"