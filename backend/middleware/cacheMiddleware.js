const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  
  // Store the original json method
  const originalJson = res.json;
  
  // Override the json method
  res.json = function(data) {
    cache.set(key, data);
    return originalJson.call(this, data);
  };
  
  next();
}

module.exports = cacheMiddleware;