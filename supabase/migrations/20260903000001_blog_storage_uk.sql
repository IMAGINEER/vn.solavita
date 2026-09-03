-- ─────────────────────────────────────────────────────────────────────────────
-- UK blog image storage bucket.
--
-- Mirrors IT's `20260904000001_blog_storage.sql`, but with a separate bucket
-- name (`post-images-uk`) so the two apps upload into disjoint paths. Even
-- though both sites run on the same Supabase project, sharing a single
-- bucket would mix UK and IT cover images into the same flat namespace and
-- let the /api/admin/blog/upload route in one app write into the other
-- app's `posts/<postId>/...` prefix if it ever guessed a foreign post id.
-- Separate buckets eliminate that surface entirely.
--
-- Bucket: `post-images-uk`
--   - public read (so /blog/[cat]/[post] cover/body images render directly
--     via the public URL).
--   - service_role writes only. The admin /api/admin/blog/upload route
--     uploads on behalf of an authenticated admin and writes into
--     `posts/<postId>/<filename>` - the folder name acts as a soft tenant
--     boundary even though the service_role bypasses RLS.
--   - 5 MB hard cap, image/* mime types only.
--
-- Idempotent: INSERT ... on conflict (id) do update set, so re-running on
-- an environment where the bucket already exists is a no-op.
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images-uk',
  'post-images-uk',
  true,
  5 * 1024 * 1024,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public              = excluded.public,
  file_size_limit     = excluded.file_size_limit,
  allowed_mime_types  = excluded.allowed_mime_types;

-- Public read access for any object in the UK bucket.
drop policy if exists "post_images_uk_public_read" on storage.objects;
create policy "post_images_uk_public_read"
  on storage.objects for select
  using (bucket_id = 'post-images-uk');

-- Service role writes (insert / update / delete) are allowed by default
-- because storage.objects policies gate *authenticated* roles, while the
-- service_role bypasses RLS entirely. No additional policy required for
-- the admin upload route, which uses the service_role key.

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select id, name, public, file_size_limit from storage.buckets where id = 'post-images-uk';
