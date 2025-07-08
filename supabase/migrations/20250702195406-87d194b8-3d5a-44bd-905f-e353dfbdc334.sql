-- Create missing candidates record for existing user
INSERT INTO candidates (id, profile_id, created_at, updated_at)
SELECT 
  '98760e89-bce5-4b27-bc65-00e47959bc7b'::uuid,
  '98760e89-bce5-4b27-bc65-00e47959bc7b'::uuid,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM candidates WHERE profile_id = '98760e89-bce5-4b27-bc65-00e47959bc7b'
);