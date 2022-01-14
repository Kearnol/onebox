const MainController = require('../controllers/main.controller')

module.exports = (app) => {
    app.get("/index", MainController.index)
}