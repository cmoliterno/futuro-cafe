"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RegistrarController_1 = __importDefault(require("../controllers/mobile/RegistrarController"));
const RegistrarController_2 = __importDefault(require("../controllers/portal/RegistrarController"));
const CultivaresController_1 = __importDefault(require("../controllers/mobile/CultivaresController"));
const FazendasController_1 = __importDefault(require("../controllers/mobile/FazendasController"));
const TalhoesController_1 = __importDefault(require("../controllers/portal/TalhoesController"));
const EstatisticasController_1 = __importDefault(require("../controllers/portal/EstatisticasController"));
const router = (0, express_1.Router)();
// Mobile routes
router.use('/mobile/register', RegistrarController_1.default);
router.use('/mobile/cultivares', CultivaresController_1.default);
router.use('/mobile/fazendas', FazendasController_1.default);
// Portal routes
router.use('/portal/register', RegistrarController_2.default);
router.use('/portal/talhoes', TalhoesController_1.default);
router.use('/portal/estatisticas', EstatisticasController_1.default);
exports.default = router;
