"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_1 = __importDefault(require("./billing"));
const reminders_1 = __importDefault(require("./reminders"));
const trades_1 = __importDefault(require("./trades"));
const router = express_1.default.Router();
router.use('/billing', billing_1.default);
router.use('/reminders', reminders_1.default);
router.use('/trades', trades_1.default);
router.get('/', (req, res) => {
    res.json({ message: 'API v1', version: '1.0.0' });
});
exports.default = router;
//# sourceMappingURL=index.js.map