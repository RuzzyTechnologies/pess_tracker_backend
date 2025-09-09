const { Router } = require("express");

const UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signUp);

router.post("/login", userController.loginUser)

router.get("/user/:id", auth, userController.getUserById)

router.get("/users/all", auth, userController.getAllUsers);

router.patch("/user/id", auth, userController.updateUser);

router.patch("/user/id", auth, userController.updateUserPassword);

router.delete("/user/id", auth, userController.deleteUser)

module.exports = router;





router.patch()