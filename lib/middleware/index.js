var blogAssets = require('./blog-assets'),
	blogBody = require('./blog-body'),
	blogLogging = require('./blog-logging'),
	blogRoutes = require('./blog-routes');

module.exports = function(app, config) {
  blogAssets(app, config);
  blogBody(app, config);
  blogLogging(app, config);
  blogRoutes(app, config);
};