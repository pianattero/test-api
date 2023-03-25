const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/login', authController.login)

router.post("/users", userController.create);
router.get("/users", userController.list);
router.get('/users/me', authMiddleware.isAuthenticated, userController.getCurrentUser)
router.get("/users/:id", userController.getUser);

module.exports = router;
