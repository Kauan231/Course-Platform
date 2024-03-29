const { Router } = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const EnrollController = require('../controllers/enrollController');

const router = Router();
const userController = new UserController();
const enrollController = new EnrollController()

router.post('/register', (req, res) => { userController.Register(req, res); });
router.post('/logout', (req, res) => { userController.Logout(req, res); });
router.post('/login', (req, res) => { userController.Login(req, res); });

router.use('/user', authMiddleware);

router.post('/user/enroll', (req, res) => { enrollController.Create(req, res); });
router.delete('/user/:userid/enroll/:courseid', (req, res) => { enrollController.Delete(req, res); });
router.get('/user/:userid/courses', (req, res) => { enrollController.Read(req, res); });

router.delete('/user/:id', (req, res) => { userController.Delete(req, res); });

module.exports = router;
