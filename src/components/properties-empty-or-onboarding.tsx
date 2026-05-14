'use client';

import { OnboardingWizard, useOnboardingComplete } from '@/components/onboarding-wizard';
import { EmptyState, BuildingIcon } from '@/components/empty-state';

export function PropertiesEmptyOrOnboarding() {
  const onboardingComplete = useOnboardingComplete();

  // Still loading localStorage — render empty state as fallback (no flash)
  if (onboardingComplete === null) {
    return (
      <EmptyState
        icon={<BuildingIcon />}
        title="No properties yet"
        description="Add your first NYC property to start monitoring violations"
        action={{ label: 'Add Property', href: '/properties/new' }}
      />
    );
  }

  // Onboarding not completed yet — show the wizard
  if (!onboardingComplete) {
    return <OnboardingWizard />;
  }

  // Onboarding was completed before — show normal empty state
  return (
    <EmptyState
      icon={<BuildingIcon />}
      title="No properties yet"
      description="Add your first NYC property to start monitoring violations"
      action={{ label: 'Add Property', href: '/properties/new' }}
    />
  );
}
