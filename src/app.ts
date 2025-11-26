import http from 'node:http';

import { PORT } from '@/config';
import log from '@/log';

import type { IncomingMessage, ServerResponse } from 'node:http';

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  log('requested', {
    url: request.url,
    method: request.method,
    headers: request.headers,
  });

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf8',
  });

  response.write('<h1>Привет, мир!</h1>', 'utf8');

  response.end();
});

server.listen(PORT);

log('Server started on PORT:', `http://localhost:${PORT}`);
