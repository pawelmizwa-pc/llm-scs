const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const { Ollama } = require('ollama');

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://ollama:11434'
});

fastify.register(cors, {
  origin: true
});

fastify.post('/api/chat', async (request, reply) => {
  try {
    const { model = 'gemma2:9b', messages, stream = false } = request.body;

    if (!messages || !Array.isArray(messages)) {
      return reply.code(400).send({ error: 'Messages array is required' });
    }

    if (stream) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      const response = await ollama.chat({
        model,
        messages,
        stream: true
      });

      for await (const part of response) {
        reply.raw.write(`data: ${JSON.stringify(part)}\n\n`);
      }

      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
    } else {
      const response = await ollama.chat({
        model,
        messages,
        stream: false
      });

      return reply.send(response);
    }
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

fastify.post('/api/generate', async (request, reply) => {
  try {
    const { model = 'gemma2:9b', prompt, stream = false } = request.body;

    if (!prompt) {
      return reply.code(400).send({ error: 'Prompt is required' });
    }

    if (stream) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      const response = await ollama.generate({
        model,
        prompt,
        stream: true
      });

      for await (const part of response) {
        reply.raw.write(`data: ${JSON.stringify(part)}\n\n`);
      }

      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
    } else {
      const response = await ollama.generate({
        model,
        prompt,
        stream: false
      });

      return reply.send(response);
    }
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

fastify.get('/api/models', async (request, reply) => {
  try {
    const models = await ollama.list();
    return reply.send(models);
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

fastify.post('/api/pull', async (request, reply) => {
  try {
    const { model } = request.body;

    if (!model) {
      return reply.code(400).send({ error: 'Model name is required' });
    }

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    const response = await ollama.pull({
      model,
      stream: true
    });

    for await (const progress of response) {
      reply.raw.write(`data: ${JSON.stringify(progress)}\n\n`);
    }

    reply.raw.write('data: [DONE]\n\n');
    reply.raw.end();
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

fastify.get('/health', async (request, reply) => {
  try {
    await ollama.list();
    return reply.send({ status: 'ok', ollama: 'connected' });
  } catch (error) {
    return reply.code(503).send({ status: 'error', ollama: 'disconnected', error: error.message });
  }
});

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();