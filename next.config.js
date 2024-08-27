const path = require('path');
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
}

console.log('Env file loaded:', envPath);

console.log('Loading next.config.js');
console.log('OPENAI_API_KEY defined in next.config.js:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY prefix:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'Not available');

// Remove the regex check for the API key format
// const openAIKeyRegex = /^sk-[a-zA-Z0-9]{48}$/;
// if (!openAIKeyRegex.test(process.env.OPENAI_API_KEY)) {
//   console.error('Invalid OpenAI API key format');
//   throw new Error('Invalid OpenAI API key format');
// }

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