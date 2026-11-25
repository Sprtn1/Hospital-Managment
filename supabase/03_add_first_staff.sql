insert into public.staff_profiles (user_id, full_name, role, is_active)
values ('PASTE_AUTH_USER_UUID_HERE', 'Hospital Administrator', 'admin', true);

//To approve another user later, create the Auth user first and run another insert:

insert into public.staff_profiles (user_id, full_name, role, is_active)
values ('THE_NEW_USER_UUID', 'Staff Name', 'staff', true);

To block an account without deleting its records:

update public.staff_profiles
set is_active = false
where user_id = 'THE_USER_UUID';
