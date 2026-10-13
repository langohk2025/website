ALTER TABLE demo_requests ADD COLUMN reply_draft_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE demo_requests ADD COLUMN reply_email_subject TEXT;
ALTER TABLE demo_requests ADD COLUMN reply_email_body TEXT;
ALTER TABLE demo_requests ADD COLUMN reply_whatsapp_body TEXT;
ALTER TABLE demo_requests ADD COLUMN reply_drafted_at TEXT;
