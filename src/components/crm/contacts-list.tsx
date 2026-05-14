'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PropertyContact, ContactRole } from '@/lib/supabase/types';
import { useToast } from '@/components/toast';

interface ContactsListProps {
  propertyId: string;
  tenantId: string;
}

const roles: ContactRole[] = ['owner', 'manager', 'tenant', 'superintendent', 'attorney', 'contractor'];

const roleColors: Record<ContactRole, string> = {
  owner: 'bg-blue-100 text-blue-700',
  manager: 'bg-purple-100 text-purple-700',
  tenant: 'bg-green-100 text-green-700',
  superintendent: 'bg-orange-100 text-orange-700',
  attorney: 'bg-red-100 text-red-700',
  contractor: 'bg-yellow-100 text-yellow-700',
};

export function ContactsList({ propertyId, tenantId }: ContactsListProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<PropertyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: 'tenant' as ContactRole, phone: '', email: '', unit_number: '', notes: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { loadContacts(); }, []);

  async function loadContacts() {
    const { data } = await supabase
      .from('property_contacts')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    if (data) setContacts(data as PropertyContact[]);
  }

  function resetForm() {
    setForm({ name: '', role: 'tenant', phone: '', email: '', unit_number: '', notes: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(contact: PropertyContact) {
    setForm({
      name: contact.name,
      role: contact.role,
      phone: contact.phone || '',
      email: contact.email || '',
      unit_number: contact.unit_number || '',
      notes: contact.notes || '',
    });
    setEditingId(contact.id);
    setShowForm(true);
  }

  function validateContactForm(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address.';
    if (form.phone) {
      const digits = form.phone.replace(/[\s\-().+]/g, '');
      if (!/^\d{10,15}$/.test(digits)) errors.phone = 'Please enter a valid phone number (10-15 digits).';
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateContactForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const payload = {
      property_id: propertyId,
      tenant_id: tenantId,
      name: form.name,
      role: form.role,
      phone: form.phone || null,
      email: form.email || null,
      unit_number: form.unit_number || null,
      notes: form.notes || null,
    };

    if (editingId) {
      await supabase.from('property_contacts').update(payload).eq('id', editingId);
      toast.success('Contact updated');
    } else {
      await supabase.from('property_contacts').insert(payload);
      toast.success('Contact added');
    }
    resetForm();
    loadContacts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this contact?')) return;
    await supabase.from('property_contacts').delete().eq('id', id);
    toast.success('Contact deleted');
    loadContacts();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input required placeholder="Name *" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.name ? 'border-red-500' : ''}`} />
              {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as ContactRole }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            <div>
              <input placeholder="Phone" value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setFormErrors(fe => ({ ...fe, phone: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.phone ? 'border-red-500' : ''}`} />
              {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            <div>
              <input placeholder="Email" type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormErrors(fe => ({ ...fe, email: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.email ? 'border-red-500' : ''}`} />
              {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <input placeholder="Unit #" value={form.unit_number} onChange={e => setForm(f => ({ ...f, unit_number: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            {editingId ? 'Update Contact' : 'Add Contact'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {contacts.map(c => (
          <div key={c.id} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{c.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[c.role]}`}>
                  {c.role}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                {c.phone && <span>{c.phone}</span>}
                {c.email && <span>{c.email}</span>}
                {c.unit_number && <span>Unit {c.unit_number}</span>}
              </div>
              {c.notes && <p className="text-sm text-gray-500 mt-1">{c.notes}</p>}
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button onClick={() => startEdit(c)} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-sm text-gray-500 hover:text-red-600 transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">No contacts added yet.</p>
        )}
      </div>
    </div>
  );
}
