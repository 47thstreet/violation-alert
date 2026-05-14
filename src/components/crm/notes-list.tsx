'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PropertyNote, NoteType } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/toast';

interface NotesListProps {
  propertyId: string;
  tenantId: string;
}

const noteTypes: NoteType[] = ['general', 'maintenance', 'violation', 'inspection', 'legal'];
const noteTypeColors: Record<NoteType, string> = {
  general: 'bg-gray-100 text-gray-700',
  maintenance: 'bg-orange-100 text-orange-700',
  violation: 'bg-red-100 text-red-700',
  inspection: 'bg-blue-100 text-blue-700',
  legal: 'bg-purple-100 text-purple-700',
};

export function NotesList({ propertyId, tenantId }: NotesListProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('general');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const { data } = await supabase
      .from('property_notes')
      .select('*')
      .eq('property_id', propertyId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (data) setNotes(data as PropertyNote[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await supabase.from('property_notes').insert({
      property_id: propertyId,
      tenant_id: tenantId,
      content: content.trim(),
      note_type: noteType,
      author_name: authorName || null,
    });
    setContent('');
    toast.success('Note added');
    loadNotes();
  }

  async function togglePin(note: PropertyNote) {
    await supabase.from('property_notes').update({ pinned: !note.pinned }).eq('id', note.id);
    loadNotes();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return;
    await supabase.from('property_notes').delete().eq('id', id);
    loadNotes();
  }

  return (
    <div>
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
        <div className="flex gap-3">
          <input placeholder="Your name (optional)" value={authorName} onChange={e => setAuthorName(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          <select value={noteType} onChange={e => setNoteType(e.target.value as NoteType)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500">
            {noteTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <textarea
          required
          placeholder="Write a note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          Add Note
        </button>
      </form>

      {/* Notes feed */}
      <div className="space-y-2">
        {notes.map(note => (
          <div key={note.id} className={`bg-white border rounded-lg p-4 ${note.pinned ? 'border-red-200 ring-1 ring-red-100' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {note.pinned && <span className="text-xs text-red-500 font-medium">Pinned</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${noteTypeColors[note.note_type]}`}>
                  {note.note_type}
                </span>
                {note.author_name && <span className="text-sm font-medium text-gray-700">{note.author_name}</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0 ml-4">
                <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                <button onClick={() => togglePin(note)} className="hover:text-red-600" title={note.pinned ? 'Unpin' : 'Pin'}>
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button onClick={() => handleDelete(note.id)} className="hover:text-red-600">Delete</button>
              </div>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">No notes yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
