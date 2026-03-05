"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processReminderQueue = processReminderQueue;
exports.getQueueStatus = getQueueStatus;
exports.addReminderJob = addReminderJob;
const queue = [];
function processReminderQueue() {
    const now = new Date();
    const dueJobs = queue.filter(job => job.scheduledAt <= now);
    for (const job of dueJobs) {
        console.log(`Processing job: ${job.id}`);
        const index = queue.indexOf(job);
        if (index > -1) {
            queue.splice(index, 1);
        }
    }
}
function getQueueStatus() {
    const sorted = queue.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
    return {
        count: queue.length,
        nextJob: sorted[0] || null
    };
}
function addReminderJob(job) {
    const newJob = {
        ...job,
        id: Math.random().toString(36).substring(7)
    };
    queue.push(newJob);
    return newJob;
}
//# sourceMappingURL=reminderQueue.js.map