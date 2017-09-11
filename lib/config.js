const config = {
  CACHE_TTL: parseInt(process.env.MCMAKLER_CACHE_TTL, 10) || 300000, // In milliseconds
};

export default config;
