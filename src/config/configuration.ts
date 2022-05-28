export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  indexer: {
    url: process.env.SLP_INDEXER || 'https://api.fullstack.cash/v5/psf/slp',
    jwt: process.env.JWT_TOKEN,
  },
  fullstack: {
    url: 'https://api.fullstack.cash/v5/',
  },
});
