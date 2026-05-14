'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { MaintenanceRequest, MaintenancePriority, MaintenanceStatus, MaintenanceCategory } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/toast';

interface MaintenanceListProps {
  propertyId: string;
  tenantId: string;
}

const priorities: MaintenancePriority[] = ['low', 'medium', 'high', 'urgent'];
const statuses: MaintenanceStatus[] = ['open', 'assigned', 'in_progress', 'completed', 'cancelled'];
const categories: MaintenanceCategory[] = ['plumbing', 'electrical', 'hvac', 'structural', 'pest', 'other'];

const priorityColors: Record<MaintenancePriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const statusColors: Record<MaintenanceStatus, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export function MaintenanceList({ propertyId, tenantId }: MaintenanceListProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as MaintenancePriority,
    category: 'other' as MaintenanceCategory,
    unit_number: '',
    assigned_to: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { loadRequests(); }, []);

  async function loadRequests() {
    const { data } = await supabase
      .from('maintenance_requests')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    if (data) setRequests(data as MaintenanceRequest[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'Title is required.';
    if (!form.description.trim()) errors.description = 'Description is required (min 10 characters).';
    else if (form.description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    await supabase.from('maintenance_requests').insert({
      property_id: propertyId,
      tenant_id: tenantId,
      title: form.title,
      description: form.description || null,
      priority: form.priority,
      category: form.category,
      unit_number: form.unit_number || null,
      assigned_to: form.assigned_to || null,
    });
    setForm({ title: '', description: '', priority: 'medium', category: 'other', unit_number: '', assigned_to: '' });
    setFormErrors({});
    setShowForm(false);
    toast.success('Maintenance request created');
    loadRequests();
  }

  async function updateStatus(id: string, status: MaintenanceStatus) {
    const update: Record<string, unknown> = { status };
    if (status === 'completed') update.completed_at = new Date().toISOString();
    await supabase.from('maintenance_requests').update(update).eq('id', id);
    toast.success(`Status updated to ${status.replace('_', ' ')}`);
    loadRequests();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this maintenance request?')) return;
    await supabase.from('maintenance_requests').delete().eq('id', id);
    loadRequests();
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const openCount = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{openCount} open request{openCount !== 1 ? 's' : ''}</p>
          <select value={filter} onChange={e => setFilter(e.target.value as MaintenanceStatus | 'all')}
            className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option value="all">All ({requests.length})</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')} ({requests.filter(r => r.status === s).length})</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <input required placeholder="Title *" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormErrors(fe => ({ ...fe, title: '' })); }}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.title ? 'border-red-500' : ''}`} />
            {formErrors.title && <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <textarea required minLength={10} placeholder="Description * (min 10 characters)" value={form.description} onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setFormErrors(fe => ({ ...fe, description: '' })); }} rows={3}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.description ? 'border-red-500' : ''}`} />
            <div className="flex justify-between mt-1">
              {formErrors.description ? <p className="text-red-600 text-sm">{formErrors.description}</p> : <span />}
              <span className={`text-xs ${form.description.length < 10 ? 'text-gray-400' : 'text-green-600'}`}>{form.description.length} / 10 min</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as MaintenancePriority }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500">
              {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as MaintenanceCategory }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <input placeholder="Unit #" value={form.unit_number} onChange={e => setForm(f => ({ ...f, unit_number: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            <input placeholder="Assign to" value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Create Request
          </button>
        </form>
      )}

      <div className="space-y-2">
        {filtered.map(req => (
          <div key={req.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{req.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[req.priority]}`}>
                    {req.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[req.status]}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
                  <span>{req.category}</span>
                  {req.unit_number && <span>Unit {req.unit_number}</span>}
                  {req.assigned_to && <span>Assigned: {req.assigned_to}</span>}
                  <span>{formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <select
                  value={req.status}
                  onChange={e => updateStatus(req.id, e.target.value as MaintenanceStatus)}
                  className="border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-red-500"
                >
                  {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <button onClick={() => handleDelete(req.id)} className="text-sm text-gray-500 hover:text-red-600 transition-colors">Delete</button>
              </div>
            </div>
            {req.description && <p className="text-sm text-gray-600 mt-1">{req.description}</p>}
            {req.completed_at && (
              <p className="text-xs text-green-600 mt-2">
                Completed {formatDistanceToNow(new Date(req.completed_at), { addSuffix: true })}
              </p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">
            {filter === 'all' ? 'No maintenance requests yet.' : `No ${filter.replace('_', ' ')} requests.`}
          </p>
        )}
      </div>
    </div>
  );
}
