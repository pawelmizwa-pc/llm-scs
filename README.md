# Ollama API Service for AWS EC2

A simple Docker-based API service using Node.js Fastify that provides HTTP access to Ollama models on port 80.

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

- **Direct HTTP API**: Simple access on port 80
- **Model Flexibility**: Switch between different Ollama models via API
- **Streaming Support**: Real-time streaming responses for chat and generation
- **Docker Compose**: Easy deployment with all services containerized
- **Health Checks**: Automatic container health monitoring

## API Endpoints

All endpoints are served over HTTP on port 80:

### Health Check
```bash
curl http://your-server-ip/health
```

### Chat Completion
```bash
curl -X POST http://your-server-ip/api/chat \
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
curl -X POST http://your-server-ip/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "prompt": "Write a poem about AI"
  }'
```

### List Available Models
```bash
curl http://your-server-ip/api/models
```

### Pull New Model
```bash
curl -X POST http://your-server-ip/api/pull \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b"
  }'
```

## Streaming Responses

Add `"stream": true` to enable Server-Sent Events streaming:

```bash
curl -X POST http://your-server-ip/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'
```

## EC2 Security Group Configuration

Ensure your EC2 security group allows:
- Port 80 (HTTP) - API access
- Port 22 (SSH) - For management

## Docker Commands

```bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Restart services
docker compose restart

# List running containers
docker ps

# View specific service logs
docker logs ollama
docker logs ollama-api
```

## Using from Applications

### Node.js Example
```javascript
const response = await fetch('http://your-server-ip/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma2:9b',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data);
```

### Python Example
```python
import requests

response = requests.post(
    'http://your-server-ip/api/chat',
    json={
        'model': 'gemma2:9b',
        'messages': [{'role': 'user', 'content': 'Hello!'}]
    }
)

print(response.json())
```

### Streaming Example (Node.js)
```javascript
const response = await fetch('http://your-server-ip/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma2:9b',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      console.log(JSON.parse(data));
    }
  }
}
```

## Architecture

- **Ollama**: Runs the LLM models in a container
- **Node.js API**: Fastify server providing REST endpoints
- **Docker Compose**: Orchestrates both services

## Available Models

You can use any Ollama model. Popular options:
- `gemma2:9b` - Google's Gemma 2 9B model
- `llama2:7b` - Meta's Llama 2 7B model
- `mistral:7b` - Mistral 7B model
- `codellama:7b` - Code-focused Llama model

Pull new models with:
```bash
docker exec ollama ollama pull model-name
```

## Troubleshooting

### Port 80 Already in Use
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop common services
sudo systemctl stop apache2 nginx
```

### Cannot Connect
1. Check EC2 security group allows port 80
2. Verify services are running: `docker ps`
3. Check logs: `docker compose logs`

### Model Not Found
Pull the model first: `docker exec ollama ollama pull model-name`

### Container Health Issues
```bash
# Check container health
docker ps

# Restart unhealthy containers
docker compose restart

# View detailed logs
docker compose logs ollama
docker compose logs ollama-api
```

## Environment Variables

The API service uses these environment variables:
- `OLLAMA_HOST`: Ollama service URL (default: `http://ollama:11434`)
- `PORT`: API server port (default: `3000`, mapped to 80)