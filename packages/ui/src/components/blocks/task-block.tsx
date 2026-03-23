'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { CheckSquare, Plus } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string;
}

interface TaskBlockProps {
  compact?: boolean;
}

export function TaskBlock({ compact }: TaskBlockProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks');
      setTasks(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-teal-500" />
          Tasks
        </CardTitle>
        <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-400">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-4">No pending tasks</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <Checkbox className="mt-1 border-gray-300" />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                    {task.priority}
                  </Badge>
                  {task.due_date && (
                    <span className="text-zinc-500 text-xs">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
