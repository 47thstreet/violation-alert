'use client';

import { useState } from 'react';
import { BuildingDetailsForm } from '@/components/crm/building-details-form';
import { ContactsList } from '@/components/crm/contacts-list';
import { DocumentsList } from '@/components/crm/documents-list';
import { NotesList } from '@/components/crm/notes-list';
import { MaintenanceList } from '@/components/crm/maintenance-list';
import type { BuildingDetails } from '@/lib/supabase/types';

interface CrmTabsProps {
  propertyId: string;
  tenantId: string;
  buildingDetails: BuildingDetails | null;
}

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'documents', label: 'Documents' },
  { id: 'notes', label: 'Notes' },
  { id: 'maintenance', label: 'Maintenance' },
] as const;

type TabId = typeof tabs[number]['id'];

export function CrmTabs({ propertyId, tenantId, buildingDetails }: CrmTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="border-b border-gray-100">
        <nav className="flex gap-0 overflow-x-auto -mb-px px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-5 sm:p-8">
        {activeTab === 'details' && (
          <BuildingDetailsForm propertyId={propertyId} tenantId={tenantId} details={buildingDetails} />
        )}
        {activeTab === 'contacts' && (
          <ContactsList propertyId={propertyId} tenantId={tenantId} />
        )}
        {activeTab === 'documents' && (
          <DocumentsList propertyId={propertyId} tenantId={tenantId} />
        )}
        {activeTab === 'notes' && (
          <NotesList propertyId={propertyId} tenantId={tenantId} />
        )}
        {activeTab === 'maintenance' && (
          <MaintenanceList propertyId={propertyId} tenantId={tenantId} />
        )}
      </div>
    </div>
  );
}
