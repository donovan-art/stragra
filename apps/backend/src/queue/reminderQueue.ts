interface ReminderJob {
  id: string;
  type: string;
  data: unknown;
  scheduledAt: Date;
}

const queue: ReminderJob[] = [];

export function processReminderQueue(): void {
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

export function getQueueStatus(): { count: number; nextJob: ReminderJob | null } {
  const sorted = queue.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  return {
    count: queue.length,
    nextJob: sorted[0] || null
  };
}

export function addReminderJob(job: Omit<ReminderJob, 'id'>): ReminderJob {
  const newJob: ReminderJob = {
    ...job,
    id: Math.random().toString(36).substring(7)
  };
  queue.push(newJob);
  return newJob;
}
