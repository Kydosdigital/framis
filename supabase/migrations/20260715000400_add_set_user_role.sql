-- ============================================================
-- set_user_role — let a super admin promote/demote a user.
--
-- profiles UPDATE is owner-only (auth.uid() = id), so a super admin
-- cannot change someone else's role directly. Rather than widen that
-- policy (which would let a super admin rewrite any profile column),
-- this security-definer function is the single narrow path: it changes
-- `role` and nothing else, and only for a caller who is already a
-- super admin.
--
-- Guard: a super admin cannot demote themselves — that's the only way
-- to lock every super admin out of the assignment/track UI.
-- ============================================================
create or replace function public.set_user_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin () then
    raise exception 'Only super admins can change roles';
  end if;

  if p_role not in ('student', 'mentor', 'super_admin') then
    raise exception 'Invalid role: %', p_role;
  end if;

  if p_user_id = auth.uid () and p_role <> 'super_admin' then
    raise exception 'You cannot remove your own super admin role';
  end if;

  update public.profiles set role = p_role where id = p_user_id;

  if not found then
    raise exception 'No such user';
  end if;
end;
$$;

revoke all on function public.set_user_role (uuid, text) from public, anon;
grant execute on function public.set_user_role (uuid, text) to authenticated;
