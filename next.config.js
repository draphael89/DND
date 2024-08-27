const path = require('path');
const dotenv = require('dotenv');

// Load .env.local file
const envPath = path.join(__dirname, '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
}

console.log('Env file loaded:', envPath);
console.log('OPENAI_API_KEY defined:', !!process.env.OPENAI_API_KEY);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  publicRuntimeConfig: {
    OPENAI_API_KEY_DEFINED: !!process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig;