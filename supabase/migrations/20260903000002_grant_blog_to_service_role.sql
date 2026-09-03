-- ─────────────────────────────────────────────────────────────────────────────
-- UK blog — grant table privileges on the 6 blog tables created in IT's
-- `20260904000000_blog_module.sql` and mirrored/extended in
-- `20260903000000_blog_module_uk_columns.sql`.
--
-- Why this exists as ONE migration (unlike IT's two-step):
--   IT's first attempt (`20260905000000_grant_blog_to_service_role.sql`)
--   forgot INSERT/UPDATE/DELETE on `blog_tags` and `blog_post_revisions`,
--   so it had to ship a follow-up (`20260905000001_grant_blog_tags_and_revisions_write.sql`)
--   after the admin UI blew up with `42501 permission denied for table
--   blog_post_revisions`. UK gets the full privilege set in a single
--   pass to avoid the same bug.
--
-- BYPASSRLS only bypasses row-level policies — the underlying table-level
-- SELECT/INSERT/UPDATE/DELETE privileges still have to be granted explicitly.
-- After running the original IT migration the admin /blog page would have
-- failed with `42501 permission denied for table blog_categories` because
-- the service_role client (used by lib/supabase.ts) had no GRANTs on these
-- new tables. This migration prevents that.
--
-- Privilege matrix:
--
--                         anon   authenticated   service_role
--   blog_categories       SELECT SELECT           SELECT, INSERT, UPDATE, DELETE
--   blog_tags             SELECT SELECT           SELECT, INSERT, UPDATE, DELETE
--   blog_authors          SELECT SELECT           SELECT, INSERT, UPDATE, DELETE
--   blog_posts            SELECT SELECT           SELECT, INSERT, UPDATE, DELETE
--   blog_post_tags        SELECT SELECT           SELECT, INSERT, DELETE  (no UPDATE)
--   blog_post_revisions    —     —                SELECT, INSERT         (no UPDATE/DELETE)
--
-- `anon` + `authenticated` only get SELECT — RLS policies further restrict
-- what each role can see (categories/tags/authors: all rows; posts: only
-- `status='published'`; revisions: nothing; join-table follows the post).
--
-- `service_role` writes without RLS interference; the admin API in
-- app/api/admin/blog/** uses the service_role key.
-- ─────────────────────────────────────────────────────────────────────────────

-- Public catalog tables: readable by anon + authenticated (RLS further
-- restricts posts to status='published'). service_role gets full CRUD.
grant select on public.blog_categories to anon, authenticated, service_role;
grant insert, update, delete on public.blog_categories to service_role;

grant select on public.blog_tags     to anon, authenticated, service_role;
grant insert, update, delete on public.blog_tags     to service_role;

grant select on public.blog_authors  to anon, authenticated, service_role;
grant insert, update, delete on public.blog_authors  to service_role;

-- Posts + their join table: anon + authenticated read published rows
-- (RLS filters); service_role gets full CRUD for the admin API.
grant select on public.blog_posts      to anon, authenticated, service_role;
grant insert, update, delete on public.blog_posts to service_role;

grant select on public.blog_post_tags  to anon, authenticated, service_role;
-- Note: no UPDATE on the join table — the admin form's tag diff strategy
-- is full DELETE + INSERT (see lib/data/blog.ts updatePost), so UPDATE
-- would never be exercised in production.
grant insert, delete on public.blog_post_tags to service_role;

-- Revisions are admin-only. RLS already says `using (false)` for everyone,
-- but we still have to GRANT SELECT so service_role can list them. INSERT
-- is needed by every createPost() / updatePost() snapshot. We deliberately
-- do NOT grant UPDATE or DELETE on revisions - the append-only history is
-- the whole point; if an admin ever needs to drop a bad revision, do it
-- via a one-off SQL grant + manual cleanup, not via the normal API.
grant select, insert on public.blog_post_revisions to service_role;

-- Verify
-- select grantee, privilege_type
-- from information_schema.role_table_grants
-- where table_schema='public' and table_name in (
--   'blog_categories','blog_tags','blog_authors',
--   'blog_posts','blog_post_tags','blog_post_revisions'
-- )
-- order by table_name, grantee, privilege_type;
