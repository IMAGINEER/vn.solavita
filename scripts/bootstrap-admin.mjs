// scripts/bootstrap-admin.mjs
//
// One-shot script that creates the first UK admin user.
//   - Generates a 24-char random password (mixed case + digits + symbols,
//     excluding confusable chars 0/O, 1/l/I)
//   - Hashes with scrypt + random salt (matching lib/auth.ts format)
//   - INSERTs into public.admin_users
//
// Run with:
//   node --env-file=.env.local scripts/bootstrap-admin.mjs [username]
//
// The script prints the plaintext password to stdout — capture it on
// first run, never commit it. After running, change the password via
// a future /admin/users UI (TODO) or re-run this script to overwrite.

import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const SCRYPT_KEYLEN = 64
const USERNAME = process.argv[2] || 'Chuangwei123'

// Alphanumeric (excluding 0/1/O/I for readability), 4 symbols mixed in.
// Total alphabet = 26 + 26 + 8 + 4 = 64; safe to use `byte % 64`.
const ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZ' + // 25 — drop I/O
  'abcdefghjkmnpqrstuvwxyz' +  // 25 — drop i/l/o
  '23456789' +                 //  8
  '!@#$%^&*'                   //  8 symbols

function generatePassword(length = 24) {
  // Generate enough random bytes; reject the few with `byte >= 252` so
  // modulo bias is below 0.4%. Length 24 → ~144 bits of entropy.
  const out = []
  while (out.length < length) {
    const buf = crypto.randomBytes(length * 2)
    for (const byte of buf) {
      if (byte < 252 && out.length < length) {
        out.push(ALPHABET[byte % ALPHABET.length])
      }
    }
  }
  return out.join('')
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.')
  console.error('   Run with: node --env-file=.env.local scripts/bootstrap-admin.mjs')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const password = generatePassword(24)
const passwordHash = hashPassword(password)

const { error } = await supabase.from('admin_users').insert({
  username: USERNAME,
  password_hash: passwordHash,
  role: 'admin',
  is_active: true,
})

if (error) {
  // If the migration hasn't been applied yet, this surfaces as
  // "relation 'public.admin_users' does not exist". Tell the user
  // clearly so they can run the SQL file.
  if (/relation .*admin_users.* does not exist/i.test(error.message)) {
    console.error('❌ admin_users table not found.')
    console.error('   Apply supabase/migrations/20260901000000_admin_auth.sql')
    console.error('   via Supabase → SQL Editor first.')
    process.exit(2)
  }
  if (/duplicate key/i.test(error.message)) {
    console.error(`❌ User "${USERNAME}" already exists.`)
    console.error('   To reset: DELETE FROM admin_users WHERE username = $1;', USERNAME)
    process.exit(3)
  }
  console.error('❌ Insert failed:', error.message)
  process.exit(1)
}

console.log('')
console.log('✅ Admin user created.')
console.log('')
console.log('   Username:', USERNAME)
console.log('   Password:', password)
console.log('')
console.log('⚠️  Copy the password NOW — it is not stored in plaintext anywhere.')
console.log('   You can change it later via the admin UI (TODO).')