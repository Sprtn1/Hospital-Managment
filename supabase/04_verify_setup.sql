select 'department' as table_name, count(*) as row_count from public.department
union all select 'doctor', count(*) from public.doctor
union all select 'patient', count(*) from public.patient
union all select 'room', count(*) from public.room
union all select 'appointment', count(*) from public.appointment
union all select 'admission', count(*) from public.admission
union all select 'medical_record', count(*) from public.medical_record
union all select 'prescription', count(*) from public.prescription
union all select 'medication', count(*) from public.medication
union all select 'prescription_item', count(*) from public.prescription_item
union all select 'bill', count(*) from public.bill
union all select 'payment', count(*) from public.payment
order by table_name;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
order by relname;

select room_number, availability_status
from public.room
order by room_number;

select bill_id, payment_status, total_amount, amount_paid, balance
from public.bill_balance
order by bill_id;
