function parseGcsPath(input) {
  if (!input || typeof input !== 'string') return null;
  // Accept: gs://bucket/path, /bucket/path, bucket/path, or just path
  // For this implementation, user will provide 'path/to/object' so return trimmed input.
  const cleaned = input.replace(/^gs:\/\//, '').replace(/^\//, '');
  // If bucket included, strip it (we use GCS_BUCKET env var)
  const parts = cleaned.split('/');
  if (parts.length > 1 && parts[0].includes('.')) {
    // pretty naive bucket detection: bucket names often contain dots — but don't rely on it
  }
  // If the user accidentally passed bucket/path, and bucket matches env var we could strip, but
  // for simplicity assume they pass object path relative to configured bucket.
  return cleaned;
}

module.exports = { parseGcsPath };
