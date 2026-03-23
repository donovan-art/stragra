'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Calendar, Clock } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Appointment {
  id: string;
  title: string;
  datetime: string;
  duration: number;
}

interface CalendarBlockProps {
  compact?: boolean;
}

export function CalendarBlock({ compact }: CalendarBlockProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiFetch('/api/appointments');
      setAppointments(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-500" />
          Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No upcoming appointments</p>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-l-2 border-teal-500">
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium">{apt.title}</p>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date(apt.datetime).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  <span>({apt.duration} min)</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
