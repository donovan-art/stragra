'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Users, User } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface CRMBlockProps {
  compact?: boolean;
}

export function CRMBlock({ compact }: CRMBlockProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const data = await apiFetch('/api/contacts');
      setContacts(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-500" />
          Recent Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No contacts yet</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium truncate">{contact.name}</p>
                <p className="text-gray-500 text-xs truncate">{contact.email || contact.phone}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
