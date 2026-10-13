ALTER TABLE demo_requests ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'skipped';
ALTER TABLE demo_requests ADD COLUMN verification_risk TEXT;
ALTER TABLE demo_requests ADD COLUMN verification_summary TEXT;
ALTER TABLE demo_requests ADD COLUMN verification_findings TEXT;
ALTER TABLE demo_requests ADD COLUMN verification_sources TEXT;
ALTER TABLE demo_requests ADD COLUMN verification_checked_at TEXT;
