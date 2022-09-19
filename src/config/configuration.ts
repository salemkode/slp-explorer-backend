import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT) || 3000,
  indexer: {
    url: process.env.SLP_INDEXER || 'https://api.fullstack.cash/v5/psf/slp',
  },
  fullstack: {
    url: 'https://api.fullstack.cash/v5/',
    email: process.env.FULLSTACK_EMAIL || '',
    password: process.env.FULLSTACK_PASSWORD || '',
  },
};
