'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PropertyDocument, DocumentType } from '@/lib/supabase/types';

interface DocumentsListProps {
  propertyId: string;
  tenantId: string;
}

const docTypes: DocumentType[] = ['insurance', 'permit', 'cof_o', 'lease', 'inspection', 'correspondence', 'other'];
const docTypeLabels: Record<DocumentType, string> = {
  insurance: 'Insurance',
  permit: 'Permit',
  cof_o: 'Certificate of Occupancy',
  lease: 'Lease',
  inspection: 'Inspection',
  correspondence: 'Correspondence',
  other: 'Other',
};

export function DocumentsList({ propertyId, tenantId }: DocumentsListProps) {
  const supabase = createClient();
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', document_type: 'other' as DocumentType, file_url: '', expiry_date: '', notes: '' });

  useEffect(() => { loadDocuments(); }, []);

  async function loadDocuments() {
    const { data } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('uploaded_at', { ascending: false });
    if (data) setDocuments(data as PropertyDocument[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('property_documents').insert({
      property_id: propertyId,
      tenant_id: tenantId,
      name: form.name,
      document_type: form.document_type,
      file_url: form.file_url || null,
      expiry_date: form.expiry_date || null,
      notes: form.notes || null,
    });
    setForm({ name: '', document_type: 'other', file_url: '', expiry_date: '', notes: '' });
    setShowForm(false);
    loadDocuments();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this document record?')) return;
    await supabase.from('property_documents').delete().eq('id', id);
    loadDocuments();
  }

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const expiringSoon = (date: string | null) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return d > now && d.getTime() - now.getTime() < thirtyDays;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Document'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Document Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <select value={form.document_type} onChange={e => setForm(f => ({ ...f, document_type: e.target.value as DocumentType }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              {docTypes.map(t => <option key={t} value={t}>{docTypeLabels[t]}</option>)}
            </select>
            <input placeholder="File URL (paste link)" value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Add Document
          </button>
        </form>
      )}

      <div className="space-y-2">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{doc.name}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {docTypeLabels[doc.document_type]}
                </span>
                {isExpired(doc.expiry_date) && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Expired</span>
                )}
                {expiringSoon(doc.expiry_date) && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Expiring Soon</span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                {doc.expiry_date && <span>Expires: {new Date(doc.expiry_date).toLocaleDateString()}</span>}
                <span>Added: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
              </div>
              {doc.file_url && (
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline mt-1 inline-block">
                  View File
                </a>
              )}
              {doc.notes && <p className="text-sm text-gray-500 mt-1">{doc.notes}</p>}
            </div>
            <button onClick={() => handleDelete(doc.id)} className="text-sm text-gray-500 hover:text-red-600 transition-colors ml-4 shrink-0">
              Delete
            </button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">No documents added yet.</p>
        )}
      </div>
    </div>
  );
}
