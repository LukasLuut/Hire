import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { Address } from "../models/Address";
import { AddressController } from "../controllers/AddressController";

const router = Router();
const userController = new UserController();
const addressController = new AddressController();

router.get('/users', userController.list);
// router.get('/users/:id', userController.getUserById);
router.post('/users', userController.create);
// router.delete('/users/:id', userController.deleteUser)
router.post('/address', addressController.create);
router.get('/address', addressController.list);

export default router;