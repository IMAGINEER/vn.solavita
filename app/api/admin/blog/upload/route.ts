// POST /api/admin/blog/upload
//
// Multipart upload endpoint used by the PostEditor. Accepts a single
// image file (multipart/form-data `file`), uploads to the
// `post-images-uk` Supabase Storage bucket via service_role, and
// returns the public URL + storage path.
//
// Auth: requireApiAdmin() - rejects with 401 if no active UK admin
// session. This is the same gate as every other /api/admin/blog/*
// route - keeps the admin surface closed.
//
// Response: { success: true, url: string, path: string } on success.

import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { requireApiAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // multipart parsing + node crypto

const BUCKET = 'post-images-uk'
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB - matches bucket policy

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

// Map mime → extension. svg goes through .svg; everything else gets
// a sanitized extension matching its real type.
const EXT_FOR: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

function safeFilename(name: string): string {
  // Strip any path traversal + non-ASCII; the editor only ever sends
  // our generated names but defensively sanitize anyway.
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
}

export async function POST(req: NextRequest) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid multipart body' },
      { status: 400 },
    )
  }

  const file = form.get('file')
  // `File` lives on the global scope in Next.js Node runtime but TS lib
  // for DOM isn't loaded here; check via duck-typing instead.
  if (
    !file ||
    typeof file === 'string' ||
    typeof (file as Blob).arrayBuffer !== 'function'
  ) {
    return NextResponse.json(
      { success: false, error: 'Missing "file" field' },
      { status: 400 },
    )
  }

  const blob = file as Blob & { name?: string; type?: string; size?: number }
  const mime = blob.type ?? ''
  const size = blob.size ?? 0
  const originalName = (blob.name ?? 'image').replace(/\.[^.]+$/, '')

  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json(
      { success: false, error: `Unsupported mime type: ${mime}` },
      { status: 400 },
    )
  }
  if (size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, error: 'File too large (max 5 MB)' },
      { status: 400 },
    )
  }

  const ext = EXT_FOR[mime] ?? 'bin'
  const objectName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeFilename(originalName)}.${ext}`
  // Folder per post id is required when known - editor passes
  // `folder` form field. If absent (new post, no id yet) we use
  // `drafts/`; the admin can re-upload once the post id is known.
  const folderRaw = form.get('folder')
  const folder = typeof folderRaw === 'string' && folderRaw.length > 0
    ? folderRaw.replace(/[^a-zA-Z0-9/_-]/g, '_')
    : 'drafts'
  const path = `${folder.replace(/^\/+|\/+$/g, '')}/${objectName}`

  const buffer = Buffer.from(await blob.arrayBuffer())
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: mime,
      cacheControl: '31536000', // 1y - public, hash-addressed by uuid
      upsert: false,
    })
  if (upErr) {
    return NextResponse.json(
      { success: false, error: `Upload failed: ${upErr.message}` },
      { status: 500 },
    )
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({
    success: true,
    url: pub.publicUrl,
    path,
  })
}
