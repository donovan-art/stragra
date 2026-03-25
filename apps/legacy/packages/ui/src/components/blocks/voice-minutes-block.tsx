'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Phone, Mic, TrendingUp } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface VoiceStats {
  minutesUsed: number;
  minutesLimit: number;
  callCount: number;
  plan: 'SOLO' | 'PRO';
}

export function VoiceMinutesBlock() {
  const [stats, setStats] = useState<VoiceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [user, calls] = await Promise.all([
        apiFetch('/api/users/me'),
        apiFetch('/api/calls'),
      ]);

      const callList = Array.isArray(calls) ? calls : [];
      const totalSeconds = callList.reduce((sum: number, c: any) => sum + (c.duration || 0), 0);
      const minutesUsed = Math.round(totalSeconds / 60);
      const minutesLimit = user?.voiceMinutes || (user?.plan === 'PRO' ? 180 : 90);

      setStats({
        minutesUsed,
        minutesLimit,
        callCount: callList.length,
        plan: user?.plan || 'SOLO',
      });
    } catch {
      setStats({ minutesUsed: 0, minutesLimit: 90, callCount: 0, plan: 'SOLO' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
      </Card>
    );
  }

  const used = stats!.minutesUsed;
  const limit = stats!.minutesLimit;
  const remaining = Math.max(0, limit - used);
  const pct = Math.min(100, Math.round((used / limit) * 100));

  const barColor = pct >= 90 ? '#dc3545' : pct >= 70 ? '#ffc107' : '#28a745';

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          Voice Agent
        </CardTitle>
        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>
          {stats!.plan}
        </span>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Big number display */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{remaining}<span className="text-base font-normal text-gray-400 ml-1">min left</span></p>
            <p className="text-xs text-gray-500 mt-0.5">{used} of {limit} minutes used this month</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-700">{stats!.callCount}</p>
            <p className="text-xs text-gray-400">calls handled</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Usage</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          {pct >= 80 && (
            <p className="text-xs mt-1.5 font-medium" style={{ color: barColor }}>
              {pct >= 90 ? '⚠️ Almost out of minutes' : 'Running low — consider upgrading'}
            </p>
          )}
        </div>

        {/* Upgrade CTA for SOLO */}
        {stats!.plan === 'SOLO' && (
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <TrendingUp className="w-3.5 h-3.5" />
              Pro plan: 180 min/month
            </div>
            <a
              href="/settings?upgrade=true"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Upgrade →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
