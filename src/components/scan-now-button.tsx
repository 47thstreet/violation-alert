'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast';

interface ScanNowButtonProps {
  propertyId: string;
}

export function ScanNowButton({ propertyId }: ScanNowButtonProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ violations_found: number; agencies_count: number; errors: string[] } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function handleScan() {
    setScanning(true);
    setResult(null);

    try {
      const res = await fetch('/api/properties/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      const data = await res.json();
      setResult(data);
      if (data.errors?.length > 0) {
        toast.info(`Found ${data.violations_found} violation${data.violations_found !== 1 ? 's' : ''} (${data.errors.length} error${data.errors.length !== 1 ? 's' : ''})`);
      } else {
        toast.success(`Scan complete — found ${data.violations_found} violation${data.violations_found !== 1 ? 's' : ''}`);
      }
      // Refresh the page to show updated violations
      router.refresh();
    } catch {
      toast.error('Scan request failed');
      setResult({ violations_found: 0, agencies_count: 0, errors: ['Scan request failed'] });
    }
    setScanning(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleScan}
        disabled={scanning}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2"
      >
        {scanning ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Scanning...
          </>
        ) : (
          'Scan Now'
        )}
      </button>
      {result && !scanning && (
        <span className="text-sm text-gray-600">
          Found {result.violations_found} violation{result.violations_found !== 1 ? 's' : ''}
          {result.errors.length > 0 && ` (${result.errors.length} error${result.errors.length !== 1 ? 's' : ''})`}
        </span>
      )}
    </div>
  );
}
