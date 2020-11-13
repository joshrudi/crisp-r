// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'UP',
        message: 'API Working!',
    });
});

var proxyController = require('./controllers/proxyController');

// proxy routes
router.route('/url/generate')
    .post(proxyController.generateUrl);

router.route('/url/getLongUrl')
    .post(proxyController.getLongUrl);

// Export API routes
module.exports = router;