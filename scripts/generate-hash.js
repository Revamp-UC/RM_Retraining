#!/usr/bin/env node
// Usage: node scripts/generate-hash.js [password]
// Default password: 123456

const bcrypt = require('bcryptjs');

const password = process.argv[2] ?? '123456';
bcrypt.hash(password, 12).then((hash) => {
  console.log('\nPassword:', password);
  console.log('Bcrypt hash (cost=12):');
  console.log(hash);
  console.log('\nUse this hash in scripts/seed.sql\n');
});
