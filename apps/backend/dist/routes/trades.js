"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ trades: ['Electrician', 'Plumber', 'Painter', 'HVAC', 'Roofing', 'Concrete', 'Flooring', 'Drywall'] });
});
exports.default = router;
//# sourceMappingURL=trades.js.map