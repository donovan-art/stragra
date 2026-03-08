import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Briefcase, Gavel, DollarSign } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'job' | 'meeting' | 'deadline' | 'payment';
  description?: string;
}

const mockEvents: Event[] = [
  { id: '1', title: 'Site Inspection - ABC Project', date: '2026-03-10', time: '09:00 AM', type: 'job', description: 'Initial walkthrough with GC' },
  { id: '2', title: 'Lien Filing Deadline', date: '2026-03-12', time: '11:59 PM', type: 'deadline', description: 'Last day to file preliminary notice' },
  { id: '3', title: 'Payment Due - Metro Construction', date: '2026-03-15', time: '05:00 PM', type: 'payment', description: '$45,000 outstanding' },
  { id: '4', title: 'GC Meeting - Horizon Builders', date: '2026-03-18', time: '02:00 PM', type: 'meeting', description: 'Review contract terms' },
  { id: '5', title: 'Permit Approval Follow-up', date: '2026-03-20', time: '10:00 AM', type: 'job', description: 'Call city planning office' },
  { id: '6', title: 'Retainage Payment Due', date: '2026-03-25', time: 'End of day', type: 'payment', description: '$12,500 final payment' },
];

const typeColors: Record<string, string> = {
  job: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  deadline: 'bg-red-500/20 text-red-400 border-red-500/30',
  payment: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const typeIcons: Record<string, React.ElementType> = {
  job: Briefcase,
  meeting: CalendarIcon,
  deadline: Gavel,
  payment: DollarSign,
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(e => e.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/os" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">subStragra</span>
          </Link>
        </div>
        <nav className="p-4">
          <Link href="/os" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1">
            <span>← Back to Dashboard</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <div className="flex items-center gap-4 bg-gray-900 rounded-lg p-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-900/50 rounded-lg" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDate(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            
            return (
              <div key={day} className={`aspect-square bg-gray-900 rounded-lg p-2 flex flex-col ${isToday ? 'ring-2 ring-teal-500' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'text-teal-400' : 'text-gray-400'}`}>{day}</span>
                <div className="flex-1 flex flex-col gap-1 mt-1">
                  {events.slice(0, 2).map(event => {
                    const Icon = typeIcons[event.type];
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-xs px-2 py-1 rounded border ${typeColors[event.type]} truncate text-left flex items-center gap-1`}
                      >
                        <Icon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{event.title}</span>
                      </button>
                    );
                  })}
                  {events.length > 2 && (
                    <span className="text-xs text-gray-500">+{events.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const Icon = typeIcons[selectedEvent.type];
                  return <Icon className={`w-6 h-6 ${typeColors[selectedEvent.type].split(' ')[1]}`} />;
                })()}
                <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  {selectedEvent.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {selectedEvent.time}
                </p>
                {selectedEvent.description && (
                  <p className="text-gray-400 pt-2 border-t border-gray-800">{selectedEvent.description}</p>
                )}
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="mt-6 w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
