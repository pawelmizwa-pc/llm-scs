# Ollama API Service for AWS EC2

A Docker-based API service using Node.js Fastify that provides HTTPS access to Ollama models with self-signed SSL certificates.

## Quick Start

```bash
# Clone the repository to your EC2 instance
git clone <repository-url>
cd llm-scs

# Run the setup script
./setup.sh

# Pull the Ollama model
docker exec ollama ollama pull gemma2:9b
```

## Features

- **HTTPS with Self-Signed SSL**: Secure API access without requiring a domain
- **Model Flexibility**: Switch between different Ollama models via API
- **Streaming Support**: Real-time streaming responses for chat and generation
- **Docker Compose**: Easy deployment with all services containerized
- **Nginx Reverse Proxy**: SSL termination and proper request handling

## API Endpoints

All endpoints are served over HTTPS. Use the `-k` flag with curl to skip certificate verification:

### Chat Completion
```bash
curl -k -X POST https://your-ec2-ip/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ]
  }'
```

### Generate Text
```bash
curl -k -X POST https://your-ec2-ip/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "prompt": "Write a poem about AI"
  }'
```

### List Available Models
```bash
curl -k https://your-ec2-ip/api/models
```

### Pull New Model
```bash
curl -k -X POST https://your-ec2-ip/api/pull \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b"
  }'
```

### Health Check
```bash
curl -k https://your-ec2-ip/health
```

## Streaming Responses

Add `"stream": true` to enable Server-Sent Events streaming:

```bash
curl -k -X POST https://your-ec2-ip/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'
```

## EC2 Security Group Configuration

Ensure your EC2 security group allows:
- Port 80 (HTTP) - Redirects to HTTPS
- Port 443 (HTTPS) - Main API access
- Port 22 (SSH) - For management

## Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# List running containers
docker ps
```

## Using from Applications

### Node.js Example
```javascript
// Disable certificate verification for self-signed cert
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const response = await fetch('https://your-ec2-ip/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma2:9b',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
```

### Python Example
```python
import requests
import urllib3

# Disable SSL warnings for self-signed cert
urllib3.disable_warnings()

response = requests.post(
    'https://your-ec2-ip/api/chat',
    json={
        'model': 'gemma2:9b',
        'messages': [{'role': 'user', 'content': 'Hello!'}]
    },
    verify=False  # Skip certificate verification
)
```

## Architecture

- **Ollama**: Runs the LLM models
- **Node.js API**: Fastify server providing REST endpoints
- **Nginx**: Reverse proxy with SSL termination
- **Docker Compose**: Orchestrates all services

## Troubleshooting

### Certificate Warning in Browser
This is expected with self-signed certificates. For API access, use the `-k` flag with curl or configure your HTTP client to accept self-signed certificates.

### Cannot Connect
1. Check EC2 security groups allow ports 80 and 443
2. Verify services are running: `docker ps`
3. Check logs: `docker-compose logs`

### Model Not Found
Pull the model first: `docker exec ollama ollama pull model-name`