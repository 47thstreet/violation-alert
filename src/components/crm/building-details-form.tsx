'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BuildingDetails, BuildingType } from '@/lib/supabase/types';

interface BuildingDetailsFormProps {
  propertyId: string;
  tenantId: string;
  details: BuildingDetails | null;
}

const buildingTypes: BuildingType[] = ['residential', 'commercial', 'mixed'];

export function BuildingDetailsForm({ propertyId, tenantId, details }: BuildingDetailsFormProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    year_built: details?.year_built ?? '',
    building_class: details?.building_class ?? '',
    building_type: details?.building_type ?? '',
    total_units: details?.total_units ?? '',
    total_sqft: details?.total_sqft ?? '',
    floors: details?.floors ?? '',
    lot_sqft: details?.lot_sqft ?? '',
    zoning: details?.zoning ?? '',
    owner_name: details?.owner_name ?? '',
    owner_phone: details?.owner_phone ?? '',
    owner_email: details?.owner_email ?? '',
    management_company: details?.management_company ?? '',
    insurance_provider: details?.insurance_provider ?? '',
    insurance_policy_number: details?.insurance_policy_number ?? '',
    insurance_expiry: details?.insurance_expiry ?? '',
    certificate_of_occupancy: details?.certificate_of_occupancy ?? '',
    last_inspection_date: details?.last_inspection_date ?? '',
    notes: details?.notes ?? '',
  });

  function update(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      property_id: propertyId,
      tenant_id: tenantId,
      year_built: form.year_built ? Number(form.year_built) : null,
      building_class: form.building_class || null,
      building_type: (form.building_type as BuildingType) || null,
      total_units: form.total_units ? Number(form.total_units) : null,
      total_sqft: form.total_sqft ? Number(form.total_sqft) : null,
      floors: form.floors ? Number(form.floors) : null,
      lot_sqft: form.lot_sqft ? Number(form.lot_sqft) : null,
      zoning: form.zoning || null,
      owner_name: form.owner_name || null,
      owner_phone: form.owner_phone || null,
      owner_email: form.owner_email || null,
      management_company: form.management_company || null,
      insurance_provider: form.insurance_provider || null,
      insurance_policy_number: form.insurance_policy_number || null,
      insurance_expiry: form.insurance_expiry || null,
      certificate_of_occupancy: form.certificate_of_occupancy || null,
      last_inspection_date: form.last_inspection_date || null,
      notes: form.notes || null,
    };

    if (details?.id) {
      await supabase.from('building_details').update(payload).eq('id', details.id);
    } else {
      await supabase.from('building_details').insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Building Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Building Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Year Built" value={form.year_built} onChange={v => update('year_built', v)} type="number" />
          <Field label="Building Class" value={form.building_class} onChange={v => update('building_class', v)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building Type</label>
            <select
              value={form.building_type}
              onChange={e => update('building_type', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="">Select...</option>
              {buildingTypes.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <Field label="Total Units" value={form.total_units} onChange={v => update('total_units', v)} type="number" />
          <Field label="Total Sq Ft" value={form.total_sqft} onChange={v => update('total_sqft', v)} type="number" />
          <Field label="Floors" value={form.floors} onChange={v => update('floors', v)} type="number" />
          <Field label="Lot Sq Ft" value={form.lot_sqft} onChange={v => update('lot_sqft', v)} type="number" />
          <Field label="Zoning" value={form.zoning} onChange={v => update('zoning', v)} />
        </div>
      </div>

      {/* Owner / Management */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Owner / Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Owner Name" value={form.owner_name} onChange={v => update('owner_name', v)} />
          <Field label="Owner Phone" value={form.owner_phone} onChange={v => update('owner_phone', v)} type="tel" />
          <Field label="Owner Email" value={form.owner_email} onChange={v => update('owner_email', v)} type="email" />
          <Field label="Management Company" value={form.management_company} onChange={v => update('management_company', v)} />
        </div>
      </div>

      {/* Insurance */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Insurance / Compliance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Insurance Provider" value={form.insurance_provider} onChange={v => update('insurance_provider', v)} />
          <Field label="Policy Number" value={form.insurance_policy_number} onChange={v => update('insurance_policy_number', v)} />
          <Field label="Insurance Expiry" value={form.insurance_expiry} onChange={v => update('insurance_expiry', v)} type="date" />
          <Field label="Certificate of Occupancy" value={form.certificate_of_occupancy} onChange={v => update('certificate_of_occupancy', v)} />
          <Field label="Last Inspection Date" value={form.last_inspection_date} onChange={v => update('last_inspection_date', v)} type="date" />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {saving ? 'Saving...' : 'Save Details'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved successfully</span>}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
      />
    </div>
  );
}
