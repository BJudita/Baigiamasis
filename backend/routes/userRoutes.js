import express from "express";
import { handleCreateUser, handleGetAllUsers, handleUpdateUser, handleDeleteUser} from "../controllers/userController.js";
import { registerUserValidation } from "../middleware/userValidation.js";

const router = express.Router();

router.post('/', registerUserValidation, handleCreateUser);
router.get('/', handleGetAllUsers);
router.put('/:id', registerUserValidation, handleUpdateUser);
router.delete('/:id', handleDeleteUser);

export default router;
