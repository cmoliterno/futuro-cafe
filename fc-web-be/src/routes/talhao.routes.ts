import { Router } from 'express';
import TalhaoController from '../controllers/TalhaoController';

const router = Router();

router.get('/analises/talhao/:talhaoId/ultima', TalhaoController.getUltimaAnaliseTalhao);

export default router; 