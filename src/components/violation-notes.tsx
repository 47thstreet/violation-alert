'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PropertyNote, ViolationNoteType } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/toast';

interface ViolationNotesProps {
  violationSourceId: string;
  propertyId: string;
  tenantId: string;
}

const violationNoteTypes: ViolationNoteType[] = ['general', 'action-taken', 'follow-up', 'escalation', 'resolved'];

const violationNoteTypeLabels: Record<ViolationNoteType, string> = {
  general: 'General',
  'action-taken': 'Action Taken',
  'follow-up': 'Follow-up',
  escalation: 'Escalation',
  resolved: 'Resolved',
};

const violationNoteTypeColors: Record<ViolationNoteType, string> = {
  general: 'bg-gray-100 text-gray-700',
  'action-taken': 'bg-green-100 text-green-700',
  'follow-up': 'bg-blue-100 text-blue-700',
  escalation: 'bg-red-100 text-red-700',
  resolved: 'bg-purple-100 text-purple-700',
};

export function ViolationNotes({ violationSourceId, propertyId, tenantId }: ViolationNotesProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<ViolationNoteType>('general');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [violationSourceId]);

  async function loadNotes() {
    const { data } = await supabase
      .from('property_notes')
      .select('*')
      .eq('violation_id', violationSourceId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (data) setNotes(data as PropertyNote[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    const { error } = await supabase.from('property_notes').insert({
      property_id: propertyId,
      tenant_id: tenantId,
      violation_id: violationSourceId,
      content: content.trim(),
      note_type: 'violation' as const,
      violation_note_type: noteType,
      author_name: authorName || null,
    });

    if (error) {
      toast.error('Failed to add note');
    } else {
      setContent('');
      toast.success('Note added');
      loadNotes();
    }
    setSubmitting(false);
  }

  async function togglePin(note: PropertyNote) {
    await supabase.from('property_notes').update({ pinned: !note.pinned }).eq('id', note.id);
    loadNotes();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return;
    await supabase.from('property_notes').delete().eq('id', id);
    toast.success('Note deleted');
    loadNotes();
  }

  // Determine the display type for a note
  function getDisplayType(note: PropertyNote): ViolationNoteType {
    return (note as unknown as Record<string, unknown>).violation_note_type as ViolationNoteType || 'general';
  }

  return (
    <div>
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as ViolationNoteType)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {violationNoteTypes.map((t) => (
              <option key={t} value={t}>
                {violationNoteTypeLabels[t]}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          placeholder="Add a note about this violation..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {/* Notes feed */}
      <div className="space-y-2">
        {notes.map((note) => {
          const displayType = getDisplayType(note);
          return (
            <div
              key={note.id}
              className={`bg-white border rounded-lg p-4 ${
                note.pinned ? 'border-indigo-200 ring-1 ring-indigo-100' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {note.pinned && (
                    <span className="text-xs text-indigo-500 font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616L17 11.5a1 1 0 01-.553.894l-4.447 2.224V19a1 1 0 11-2 0v-4.382l-4.447-2.224A1 1 0 015 11.5l.786-3.989-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 4.323V3a1 1 0 011-1z" />
                      </svg>
                      Pinned
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${violationNoteTypeColors[displayType]}`}
                  >
                    {violationNoteTypeLabels[displayType]}
                  </span>
                  {note.author_name && (
                    <span className="text-sm font-medium text-gray-700">{note.author_name}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0 ml-4">
                  <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                  <button
                    onClick={() => togglePin(note)}
                    className="hover:text-gray-700 transition-colors"
                    title={note.pinned ? 'Unpin' : 'Pin'}
                  >
                    {note.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="hover:text-gray-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
            </div>
          );
        })}
        {notes.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">
            No notes yet. Add one above to start tracking this violation.
          </p>
        )}
      </div>
    </div>
  );
}
