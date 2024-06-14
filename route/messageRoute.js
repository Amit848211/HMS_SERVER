import express from "express"
import { getsAllMessage, sendMessage } from "../controller/messageController.js"
import { isAdminAuthenticated } from "../middleware/auth.js"




const router = express.Router()

router.post("/send",sendMessage)
router.get("/detail",isAdminAuthenticated,getsAllMessage)

export default router;