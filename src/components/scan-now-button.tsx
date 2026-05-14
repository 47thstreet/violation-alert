'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

interface ScanNowButtonProps {
  propertyId: string;
}

export function ScanNowButton({ propertyId }: ScanNowButtonProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [result, setResult] = useState<{ violations_found: number; agencies_count: number; errors: string[] } | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    };
  }, []);

  async function handleScan() {
    if (revertTimer.current) clearTimeout(revertTimer.current);
    setScanState('scanning');
    setResult(null);

    try {
      const res = await fetch('/api/properties/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      const data = await res.json();
      setResult(data);

      if (!res.ok) {
        setScanState('error');
        toast.error('Scan request failed');
      } else if (data.errors?.length > 0) {
        setScanState('success');
        toast.info(`Found ${data.violations_found} violation${data.violations_found !== 1 ? 's' : ''} (${data.errors.length} error${data.errors.length !== 1 ? 's' : ''})`);
      } else {
        setScanState('success');
        toast.success(`Scan complete — found ${data.violations_found} violation${data.violations_found !== 1 ? 's' : ''}`);
      }
      router.refresh();
    } catch {
      setScanState('error');
      toast.error('Scan request failed');
      setResult({ violations_found: 0, agencies_count: 0, errors: ['Scan request failed'] });
    }

    // Revert to idle after brief feedback
    revertTimer.current = setTimeout(() => setScanState('idle'), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Pulsing ring during scan */}
        {scanState === 'scanning' && (
          <div className="absolute -inset-1 rounded-lg border-2 border-indigo-400 animate-pulse pointer-events-none" />
        )}
        {/* Success ring */}
        {scanState === 'success' && (
          <div className="absolute -inset-1 rounded-lg border-2 border-emerald-400 pointer-events-none transition-opacity duration-500" />
        )}
        {/* Error ring */}
        {scanState === 'error' && (
          <div className="absolute -inset-1 rounded-lg border-2 border-red-400 pointer-events-none transition-opacity duration-500" />
        )}
        <button
          onClick={handleScan}
          disabled={scanState === 'scanning'}
          className="relative bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          {scanState === 'scanning' ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Scanning...
            </>
          ) : scanState === 'success' ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Done
            </>
          ) : scanState === 'error' ? (
            <>
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Failed
            </>
          ) : (
            'Scan Now'
          )}
        </button>
      </div>
      {result && scanState === 'idle' && (
        <span className="text-sm text-gray-600">
          Found {result.violations_found} violation{result.violations_found !== 1 ? 's' : ''}
          {result.errors.length > 0 && ` (${result.errors.length} error${result.errors.length !== 1 ? 's' : ''})`}
        </span>
      )}
    </div>
  );
}
