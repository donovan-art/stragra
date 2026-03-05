interface ReminderJob {
    id: string;
    type: string;
    data: unknown;
    scheduledAt: Date;
}
export declare function processReminderQueue(): void;
export declare function getQueueStatus(): {
    count: number;
    nextJob: ReminderJob | null;
};
export declare function addReminderJob(job: Omit<ReminderJob, 'id'>): ReminderJob;
export {};
//# sourceMappingURL=reminderQueue.d.ts.map