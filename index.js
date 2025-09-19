const express = require('express');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const { parseGcsPath } = require('./lib/path');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const PROXY_TOKEN = process.env.PROXY_TOKEN;
const GCS_BUCKET = process.env.GCS_BUCKET;

if (!PROXY_TOKEN) {
  console.warn('Warning: PROXY_TOKEN is not set. The server will reject all requests.');
}
if (!GCS_BUCKET) {
  console.warn('Warning: GCS_BUCKET is not set. The server will not be able to access objects.');
}

const storage = new Storage();

app.post('/', async (req, res) => {
  try {
    const { token, path } = req.body || {};
    if (!token || !path) {
      return res.status(400).json({ error: 'Missing token or path in request body' });
    }
    if (token !== PROXY_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!GCS_BUCKET) {
      return res.status(500).json({ error: 'Server misconfigured: missing GCS_BUCKET' });
    }

    // parse path; user supplies 'path/to/object'
    const objectPath = parseGcsPath(path);
    if (!objectPath) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const bucket = storage.bucket(GCS_BUCKET);
    const file = bucket.file(objectPath);

    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: 'Not found' });
    }

    const [meta] = await file.getMetadata();
    const contents = await file.download();
    const buffer = contents[0];

    if (meta && meta.contentType) {
      res.setHeader('Content-Type', meta.contentType);
    }
    res.send(buffer);
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/healthz', (req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`GCS proxy listening on port ${PORT}`);
});
