"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reminderQueue_1 = require("../queue/reminderQueue");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'Reminders API' });
});
router.get('/queue', (req, res) => {
    const status = (0, reminderQueue_1.getQueueStatus)();
    res.json(status);
});
router.post('/queue/process', (req, res) => {
    (0, reminderQueue_1.processReminderQueue)();
    res.json({ message: 'Queue processed' });
});
router.post('/job', (req, res) => {
    const job = (0, reminderQueue_1.addReminderJob)({
        type: req.body.type || 'default',
        data: req.body.data || {},
        scheduledAt: new Date(req.body.scheduledAt || Date.now())
    });
    res.json(job);
});
exports.default = router;
//# sourceMappingURL=reminders.js.map