'use client';

import { motion } from 'motion/react';
import { PropertyCard } from '@/components/property-card';
import type { Property } from '@/lib/supabase/types';

interface AnimatedPropertyGridProps {
  properties: Property[];
  violationCounts: Record<string, number>;
}

export function AnimatedPropertyGrid({ properties, violationCounts }: AnimatedPropertyGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PropertyCard
            property={property}
            violationCount={violationCounts[property.id] || 0}
          />
        </motion.div>
      ))}
    </div>
  );
}
