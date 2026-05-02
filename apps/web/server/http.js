import { getRequestIp, getRequestOrigin } from './utils/requestContext.js';

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
}

export function readJsonBody(req) {
  return readRawBody(req).then((raw) => {
    const text = raw.toString('utf-8');
    return text ? JSON.parse(text) : {};
  });
}

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export function getRequestContext(req) {
  return {
    ip: getRequestIp(req),
    origin: getRequestOrigin(req)
  };
}
