#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}### Setting up Ollama API Service...${NC}"

echo -e "${GREEN}### Starting services...${NC}"
docker compose up -d

echo -e "${GREEN}### Setup complete!${NC}"
echo -e "${YELLOW}Access your API at: http://your-server-ip${NC}"
echo ""
echo -e "${YELLOW}To pull the Ollama model, run:${NC}"
echo -e "${GREEN}docker exec ollama ollama pull gemma2:9b${NC}"