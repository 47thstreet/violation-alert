'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PropertyNote, ResolutionTracking } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface ViolationActivityProps {
  violationId: string; // DB violation id
  violationSourceId: string; // source_id used for notes
}

interface ActivityEvent {
  id: string;
  type: 'system' | 'note';
  icon: 'open' | 'research' | 'progress' | 'submit' | 'resolve' | 'dismiss' | 'contractor' | 'note';
  title: string;
  description: string | null;
  timestamp: string;
  color: string;
}

const ICON_COLORS: Record<ActivityEvent['icon'], string> = {
  open: 'bg-red-500',
  research: 'bg-purple-500',
  progress: 'bg-yellow-500',
  submit: 'bg-blue-500',
  resolve: 'bg-green-500',
  dismiss: 'bg-gray-400',
  contractor: 'bg-orange-500',
  note: 'bg-gray-300',
};

const ICON_SVG: Record<ActivityEvent['icon'], string> = {
  open: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
  research: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  progress: 'M13 10V3L4 14h7v7l9-11h-7z',
  submit: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  resolve: 'M5 13l4 4L19 7',
  dismiss: 'M6 18L18 6M6 6l12 12',
  contractor: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  note: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
};

export function ViolationActivity({ violationId, violationSourceId }: ViolationActivityProps) {
  const supabase = createClient();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, [violationId, violationSourceId]);

  async function loadActivity() {
    setLoading(true);
    const allEvents: ActivityEvent[] = [];

    // 1. Get resolution tracking data for system events
    const { data: resolution } = await supabase
      .from('resolution_tracking')
      .select('*')
      .eq('violation_id', violationId)
      .single();

    if (resolution) {
      const res = resolution as ResolutionTracking;

      // Resolution started
      if (res.started_at) {
        allEvents.push({
          id: `res-started-${res.id}`,
          type: 'system',
          icon: 'progress',
          title: 'Resolution started',
          description: res.resolution_method === 'diy'
            ? 'Started DIY resolution'
            : res.resolution_method === 'hired_pro'
            ? 'Hired a professional contractor'
            : `Resolution method: ${res.resolution_method}`,
          timestamp: res.started_at,
          color: 'text-yellow-700',
        });
      }

      // Status-based events
      if (res.status === 'researching') {
        allEvents.push({
          id: `res-research-${res.id}`,
          type: 'system',
          icon: 'research',
          title: 'Researching resolution',
          description: 'Looking into how to resolve this violation',
          timestamp: res.updated_at || res.created_at,
          color: 'text-purple-700',
        });
      }

      if (res.submitted_at) {
        allEvents.push({
          id: `res-submitted-${res.id}`,
          type: 'system',
          icon: 'submit',
          title: 'Resolution submitted',
          description: 'Submitted to the agency for review',
          timestamp: res.submitted_at,
          color: 'text-blue-700',
        });
      }

      if (res.resolved_at) {
        allEvents.push({
          id: `res-resolved-${res.id}`,
          type: 'system',
          icon: 'resolve',
          title: 'Violation resolved',
          description: res.resolution_notes || 'This violation has been resolved',
          timestamp: res.resolved_at,
          color: 'text-green-700',
        });
      }

      if (res.status === 'dismissed') {
        allEvents.push({
          id: `res-dismissed-${res.id}`,
          type: 'system',
          icon: 'dismiss',
          title: 'Violation dismissed',
          description: 'This violation was dismissed',
          timestamp: res.updated_at || res.created_at,
          color: 'text-gray-500',
        });
      }

      if (res.contractor_id) {
        allEvents.push({
          id: `res-contractor-${res.id}`,
          type: 'system',
          icon: 'contractor',
          title: 'Contractor matched',
          description: 'A contractor has been assigned to this violation',
          timestamp: res.updated_at || res.created_at,
          color: 'text-orange-700',
        });
      }

      // Created event (violation opened/tracked)
      allEvents.push({
        id: `res-created-${res.id}`,
        type: 'system',
        icon: 'open',
        title: 'Violation tracked',
        description: 'Resolution tracking started for this violation',
        timestamp: res.created_at,
        color: 'text-red-700',
      });
    }

    // 2. Get notes as activity events
    const { data: notes } = await supabase
      .from('property_notes')
      .select('*')
      .eq('violation_id', violationSourceId)
      .order('created_at', { ascending: false });

    if (notes) {
      for (const note of notes as PropertyNote[]) {
        const noteType = (note as unknown as Record<string, unknown>).violation_note_type as string || 'general';
        allEvents.push({
          id: `note-${note.id}`,
          type: 'note',
          icon: 'note',
          title: `${note.author_name || 'User'} added a ${noteType.replace('-', ' ')} note`,
          description: note.content.length > 120
            ? note.content.substring(0, 120) + '...'
            : note.content,
          timestamp: note.created_at,
          color: 'text-gray-600',
        });
      }
    }

    // Sort all events by timestamp descending (newest first)
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setEvents(allEvents);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">
        No activity yet. Start a resolution or add a note to begin tracking.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-0">
        {events.map((event, idx) => (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full ${ICON_COLORS[event.icon]} flex items-center justify-center`}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={ICON_SVG[event.icon]} />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className={`text-sm font-medium ${event.color}`}>{event.title}</p>
                <span className="text-xs text-gray-500 shrink-0">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
