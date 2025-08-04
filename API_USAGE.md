# Ollama API Service

## Setup on EC2

1. SSH into your EC2 instance
2. Install Docker and Docker Compose
3. Clone/copy this project to your server
4. Run: `docker-compose up -d`

## API Endpoints

### Chat Completion
```bash
curl -X POST http://your-ec2-ip:3000/api/chat \
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
curl -X POST http://your-ec2-ip:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "prompt": "Write a poem about AI"
  }'
```

### List Available Models
```bash
curl http://your-ec2-ip:3000/api/models
```

### Pull New Model
```bash
curl -X POST http://your-ec2-ip:3000/api/pull \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b"
  }'
```

### Health Check
```bash
curl http://your-ec2-ip:3000/health
```

## Streaming Responses

Add `"stream": true` to chat or generate requests:

```bash
curl -X POST http://your-ec2-ip:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2:9b",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Pull gemma2:9b model after starting
docker exec ollama ollama pull gemma2:9b
```