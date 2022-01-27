const MainController = require('../controllers/main.controller')

module.exports = (app) => {
    app.get("/index", MainController.index)
    app.get("/webhook", MainController.webhookCheck)
    app.post("/webhook", MainController.webhook)
}
