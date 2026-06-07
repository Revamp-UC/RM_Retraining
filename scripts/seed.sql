-- SEED: Add initial RM users
-- Password hash below is bcrypt(12) of '123456'
-- Generate fresh hash: node -e "const b=require('bcryptjs'); b.hash('123456',12).then(console.log)"

-- Example RM users — replace with actual RM data
INSERT INTO users (mobile_number, name, password, is_active) VALUES
  ('9999999901', 'Ravi Kumar', '$2a$12$placeholder_hash_replace_me', true),
  ('9999999902', 'Priya Sharma', '$2a$12$placeholder_hash_replace_me', true),
  ('9999999903', 'Amit Singh', '$2a$12$placeholder_hash_replace_me', true)
ON CONFLICT (mobile_number) DO NOTHING;

-- Run this in Node.js to generate the actual bcrypt hash:
-- node -e "const b=require('bcryptjs'); b.hash('123456',12).then(h => console.log(h))"
-- Then replace placeholder_hash_replace_me with the actual hash
