-- Add violation_id and violation_note_type columns to property_notes for violation-specific notes
ALTER TABLE property_notes ADD COLUMN IF NOT EXISTS violation_id text;
ALTER TABLE property_notes ADD COLUMN IF NOT EXISTS violation_note_type text;
CREATE INDEX IF NOT EXISTS idx_property_notes_violation ON property_notes(violation_id) WHERE violation_id IS NOT NULL;
