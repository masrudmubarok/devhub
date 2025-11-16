import express from 'express'
import { AdminController } from '../controllers/AdminController'
import { authenticateJWT, requireAdmin } from '../middleware/authMiddleware'

const router = express.Router()
const adminController = new AdminController()

// All admin routes require authentication + admin role
router.use(authenticateJWT)
router.use(requireAdmin)

router.get('/health', (req, res) => adminController.healthCheck(req, res))
router.get('/users', (req, res) => adminController.listUsers(req, res))
router.get('/stats', (req, res) => adminController.getStats(req, res))
router.put('/users/:id', (req, res) => adminController.updateUser(req, res))
router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res))

export default router
