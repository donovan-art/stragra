'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Inbox, Mail } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Message {
  id: string;
  subject: string;
  from_address: string;
  from_name: string;
  read: boolean;
  created_at: string;
}

interface InboxBlockProps {
  compact?: boolean;
}

export function InboxBlock({ compact }: InboxBlockProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiFetch('/api/inbox');
      setMessages(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch inbox:', error);
      setMessages([]);
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
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Inbox className="w-5 h-5 text-teal-500" />
          Inbox
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No messages</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${message.read ? 'bg-gray-50' : 'bg-gray-50'}`}>
              <Mail className={`w-5 h-5 mt-0.5 ${message.read ? 'text-gray-400' : 'text-teal-500'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${message.read ? 'text-gray-500' : 'text-gray-800'}`}>
                  {message.subject || 'No subject'}
                </p>
                <p className="text-gray-500 text-xs truncate">{message.from_name || message.from_address}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
