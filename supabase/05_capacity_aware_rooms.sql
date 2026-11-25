alter table public.room
drop constraint if exists room_availability_status_check;

alter table public.room
add constraint room_availability_status_check
check (availability_status in ('Available', 'Beds Available', 'Occupied', 'Maintenance'));

drop trigger if exists admission_room_check on public.admission;
drop trigger if exists admission_room_occupied on public.admission;
drop trigger if exists admission_room_released on public.admission;
drop trigger if exists admission_room_reoccupied on public.admission;
drop trigger if exists admission_room_changed on public.admission;
drop trigger if exists admission_deleted_room_released on public.admission;
drop trigger if exists admission_room_status_insert on public.admission;
drop trigger if exists admission_room_status_update on public.admission;
drop trigger if exists admission_room_status_delete on public.admission;

drop function if exists private.occupy_room_after_admission();
drop function if exists private.release_room_after_discharge();
drop function if exists private.change_admission_room();
drop function if exists private.release_room_after_admission_delete();
drop function if exists private.refresh_admission_room_status();
drop function if exists private.refresh_room_status(text);
drop function if exists private.check_room_available();

create function private.check_room_available()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
    current_status text;
    room_capacity integer;
    active_admissions integer;
    should_check boolean;
begin
    should_check := new.discharge_date is null;

    if tg_op = 'UPDATE' then
        should_check := should_check and (
            new.room_number is distinct from old.room_number
            or old.discharge_date is not null
        );
    end if;

    if should_check then
        select availability_status, capacity
        into current_status, room_capacity
        from public.room
        where room_number = new.room_number
        for update;

        if current_status = 'Maintenance' then
            raise exception 'The selected room is under maintenance';
        end if;

        select count(*)
        into active_admissions
        from public.admission
        where room_number = new.room_number
          and discharge_date is null
          and admission_id is distinct from new.admission_id;

        if active_admissions >= room_capacity then
            raise exception 'The selected room has no available beds';
        end if;
    end if;

    return new;
end;
$$;

create function private.refresh_room_status(target_room_number text)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
    room_capacity integer;
    current_status text;
    active_admissions integer;
begin
    select capacity, availability_status
    into room_capacity, current_status
    from public.room
    where room_number = target_room_number
    for update;

    if current_status = 'Maintenance' then
        return;
    end if;

    select count(*)
    into active_admissions
    from public.admission
    where room_number = target_room_number
      and discharge_date is null;

    update public.room
    set availability_status = case
        when active_admissions = 0 then 'Available'
        when active_admissions < room_capacity then 'Beds Available'
        else 'Occupied'
    end
    where room_number = target_room_number;
end;
$$;

create function private.refresh_admission_room_status()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
    if tg_op = 'DELETE' then
        if old.discharge_date is null then
            perform private.refresh_room_status(old.room_number);
        end if;
        return old;
    end if;

    if tg_op = 'UPDATE' and old.discharge_date is null and (
        new.discharge_date is not null
        or old.room_number is distinct from new.room_number
    ) then
        perform private.refresh_room_status(old.room_number);
    end if;

    if new.discharge_date is null then
        perform private.refresh_room_status(new.room_number);
    end if;

    return new;
end;
$$;

create trigger admission_room_check
before insert or update of room_number, discharge_date on public.admission
for each row execute function private.check_room_available();

create trigger admission_room_status_insert
after insert on public.admission
for each row execute function private.refresh_admission_room_status();

create trigger admission_room_status_update
after update of room_number, discharge_date on public.admission
for each row execute function private.refresh_admission_room_status();

create trigger admission_room_status_delete
after delete on public.admission
for each row execute function private.refresh_admission_room_status();

update public.room r
set availability_status = case
    when r.availability_status = 'Maintenance' then 'Maintenance'
    when (
        select count(*)
        from public.admission a
        where a.room_number = r.room_number
          and a.discharge_date is null
    ) = 0 then 'Available'
    when (
        select count(*)
        from public.admission a
        where a.room_number = r.room_number
          and a.discharge_date is null
    ) < r.capacity then 'Beds Available'
    else 'Occupied'
end;

drop view if exists public.available_rooms;

create view public.available_rooms with (security_invoker = true) as
select r.room_number, r.room_type, r.floor, r.capacity,
       count(a.admission_id)::integer as occupied_beds,
       (r.capacity - count(a.admission_id))::integer as beds_available,
       r.availability_status
from public.room r
left join public.admission a
       on a.room_number = r.room_number
      and a.discharge_date is null
where r.availability_status <> 'Maintenance'
group by r.room_number, r.room_type, r.floor, r.capacity, r.availability_status
having count(a.admission_id) < r.capacity;

grant select on public.available_rooms to authenticated;
