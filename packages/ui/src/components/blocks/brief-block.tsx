'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Sparkles, RefreshCw, Sun, Moon } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Briefing {
  id: string;
  content: string;
  type: 'MORNING' | 'EVENING';
  tasks_summary: string;
  calendar_summary: string;
  priority_alerts: string;
  created_at: string;
}

export function BriefBlock() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchBriefing(); }, []);

  const fetchBriefing = async () => {
    try {
      const data = await apiFetch('/api/briefings');
      setBriefing(data && data.id ? data : null);
    } catch {
      setBriefing(null);
    } finally {
      setLoading(false);
    }
  };

  const generateBriefing = async () => {
    setGenerating(true);
    try {
      const data = await apiFetch('/api/briefings/generate', { method: 'POST' });
      setBriefing(data);
    } catch {
      // RunPod not configured yet — show placeholder
    } finally {
      setGenerating(false);
    }
  };

  const hour = new Date().getHours();
  const isMorning = hour < 17;

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          {isMorning
            ? <Sun className="w-4 h-4 text-yellow-500" />
            : <Moon className="w-4 h-4 text-indigo-500" />
          }
          {isMorning ? 'Morning Brief' : 'Evening Summary'}
          <span className="ml-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          </span>
        </CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={generateBriefing}
          disabled={generating}
          className="text-xs text-gray-500 hover:text-gray-800 h-7 px-2"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {briefing ? (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">{briefing.content}</p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {briefing.tasks_summary && (
                <div className="bg-blue-50 rounded p-2 text-center">
                  <p className="text-xs text-blue-600 font-medium">{briefing.tasks_summary}</p>
                </div>
              )}
              {briefing.calendar_summary && (
                <div className="bg-green-50 rounded p-2 text-center">
                  <p className="text-xs text-green-600 font-medium">{briefing.calendar_summary}</p>
                </div>
              )}
              {briefing.priority_alerts && (
                <div className="bg-orange-50 rounded p-2 text-center">
                  <p className="text-xs text-orange-600 font-medium">{briefing.priority_alerts}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Generated {new Date(briefing.created_at).toLocaleString([], {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm mb-3">No briefing yet for today</p>
            <Button
              size="sm"
              onClick={generateBriefing}
              disabled={generating}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs"
            >
              {generating ? 'Generating...' : `Generate ${isMorning ? 'Morning' : 'Evening'} Brief`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
