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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="border-b">
        <nav className="flex gap-0 overflow-x-auto -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 sm:p-6">
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
