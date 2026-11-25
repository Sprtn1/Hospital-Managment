insert into public.department (department_id, department_name, location, contact_info) values
(1, 'Cardiology', 'Building A - Floor 2', '01-555-201'),
(2, 'Pediatrics', 'Building B - Floor 1', '01-555-102'),
(3, 'Emergency', 'Main Building - Ground Floor', '01-555-911'),
(4, 'Orthopedics', 'Building A - Floor 3', '01-555-304');

insert into public.doctor (doctor_id, name, specialization, phone_number, email, department_id) values
(1, 'Rana Khoury', 'Cardiologist', '70-111-201', 'rana.khoury@hospital.com', 1),
(2, 'Karim Haddad', 'Pediatrician', '70-111-202', 'karim.haddad@hospital.com', 2),
(3, 'Maya Nassar', 'Emergency Physician', '70-111-203', 'maya.nassar@hospital.com', 3),
(4, 'Omar Saleh', 'Orthopedic Surgeon', '70-111-204', 'omar.saleh@hospital.com', 4),
(5, 'Lina Daher', 'Cardiologist', '70-111-205', 'lina.daher@hospital.com', 1);

update public.department set manager_doctor_id = 1 where department_id = 1;
update public.department set manager_doctor_id = 2 where department_id = 2;
update public.department set manager_doctor_id = 3 where department_id = 3;
update public.department set manager_doctor_id = 4 where department_id = 4;

insert into public.patient (patient_id, name, date_of_birth, gender, phone_number, address, blood_type, emergency_contact) values
(1, 'Ahmad Mansour', '1988-04-15', 'Male', '71-222-301', 'Beirut', 'O+', 'Nour Mansour 03-441-201'),
(2, 'Sara Hamdan', '1995-09-23', 'Female', '71-222-302', 'Saida', 'A+', 'Ali Hamdan 03-441-202'),
(3, 'Joseph Aoun', '1972-01-08', 'Male', '71-222-303', 'Jounieh', 'B-', 'Mira Aoun 03-441-203'),
(4, 'Lea Fares', '2016-06-12', 'Female', '71-222-304', 'Beirut', 'AB+', 'Rita Fares 03-441-204'),
(5, 'Rami Khalil', '2001-11-02', 'Male', '71-222-305', 'Aley', 'O-', 'Sami Khalil 03-441-205'),
(6, 'Dina Saad', '1983-03-30', 'Female', '71-222-306', 'Tripoli', 'A-', 'Hadi Saad 03-441-206');

insert into public.room (room_number, room_type, floor, capacity, availability_status) values
('A201', 'Private', 2, 1, 'Available'),
('A202', 'Shared', 2, 2, 'Available'),
('A301', 'Surgery Recovery', 3, 2, 'Available'),
('B101', 'Pediatric', 1, 2, 'Available'),
('E001', 'Emergency', 0, 1, 'Available'),
('E002', 'Emergency', 0, 1, 'Maintenance');

insert into public.appointment (appointment_id, patient_id, doctor_id, appointment_datetime, reason_for_visit, status) values
(1, 1, 1, '2026-12-01 10:00:00+02', 'Chest discomfort follow-up', 'Scheduled'),
(2, 2, 5, '2026-12-01 11:30:00+02', 'Blood pressure check', 'Scheduled'),
(3, 4, 2, '2026-12-02 09:00:00+02', 'Seasonal fever', 'Scheduled'),
(4, 3, 4, '2026-11-15 14:00:00+02', 'Knee pain examination', 'Completed'),
(5, 5, 3, '2026-11-20 18:00:00+02', 'Minor sports injury', 'Completed'),
(6, 6, 1, '2026-12-03 13:00:00+02', 'Cardiac test review', 'Scheduled');

insert into public.admission (admission_id, patient_id, doctor_id, room_number, admission_date, discharge_date) values
(1, 3, 4, 'A301', '2026-11-15', '2026-11-18'),
(2, 5, 3, 'E001', '2026-11-20', '2026-11-20'),
(3, 1, 1, 'A201', '2026-11-22', null);

insert into public.medical_record (record_id, patient_id, doctor_id, diagnosis, treatment_details, medical_notes, record_date) values
(1, 1, 1, 'Hypertension', 'Daily medication and low-salt diet', 'Review after one month', '2026-10-20'),
(2, 2, 5, 'Mild arrhythmia', 'Monitoring and blood tests', 'No urgent symptoms', '2026-10-27'),
(3, 3, 4, 'Meniscus injury', 'Arthroscopy and physiotherapy', 'Recovery progressing normally', '2026-11-15'),
(4, 4, 2, 'Viral infection', 'Rest, fluids and fever control', 'Parent informed about warning signs', '2026-11-05'),
(5, 5, 3, 'Ankle sprain', 'Ice, compression and pain relief', 'No fracture on X-ray', '2026-11-20'),
(6, 1, 1, 'Chest pain observation', 'ECG and blood testing', 'Patient kept for observation', '2026-11-22');

insert into public.prescription (prescription_id, patient_id, doctor_id, prescription_date) values
(1, 1, 1, '2026-10-20'),
(2, 3, 4, '2026-11-18'),
(3, 4, 2, '2026-11-05'),
(4, 5, 3, '2026-11-20');

insert into public.medication (medication_id, medication_name, description, quantity_available) values
(1, 'Amlodipine 5 mg', 'Blood pressure medication', 50),
(2, 'Paracetamol 500 mg', 'Pain and fever relief', 100),
(3, 'Amoxicillin 500 mg', 'Antibiotic capsules', 40),
(4, 'Ibuprofen 400 mg', 'Anti-inflammatory pain relief', 75),
(5, 'Aspirin 81 mg', 'Low-dose antiplatelet medication', 60),
(6, 'Diclofenac Gel', 'Topical pain relief', 30);

insert into public.prescription_item (prescription_item_id, prescription_id, medication_id, dosage, frequency, start_date, end_date) values
(1, 1, 1, '5 mg', 'Once daily', '2026-10-20', '2027-01-20'),
(2, 1, 5, '81 mg', 'Once daily', '2026-10-20', '2027-01-20'),
(3, 2, 4, '400 mg', 'Twice daily after food', '2026-11-18', '2026-11-25'),
(4, 3, 2, '500 mg', 'Every 8 hours when needed', '2026-11-05', '2026-11-10'),
(5, 4, 6, 'Apply thin layer', 'Three times daily', '2026-11-20', '2026-11-27');

insert into public.bill (bill_id, patient_id, appointment_id, admission_id, prescription_id, total_amount, issue_date, payment_status) values
(1, 1, 1, null, null, 75.00, '2026-11-23', 'Unpaid'),
(2, 3, null, 1, null, 1350.00, '2026-11-18', 'Unpaid'),
(3, 4, null, null, 3, 45.00, '2026-11-05', 'Unpaid'),
(4, 5, null, 2, null, 180.00, '2026-11-20', 'Unpaid'),
(5, 2, 2, null, null, 60.00, '2026-11-23', 'Unpaid');

insert into public.payment (payment_id, bill_id, payment_date, amount_paid, payment_method) values
(1, 2, '2026-11-18', 500.00, 'Insurance'),
(2, 2, '2026-11-19', 350.00, 'Card'),
(3, 3, '2026-11-05', 45.00, 'Cash'),
(4, 4, '2026-11-20', 180.00, 'Card');

select setval(pg_get_serial_sequence('public.department', 'department_id'), (select max(department_id) from public.department), true);
select setval(pg_get_serial_sequence('public.doctor', 'doctor_id'), (select max(doctor_id) from public.doctor), true);
select setval(pg_get_serial_sequence('public.patient', 'patient_id'), (select max(patient_id) from public.patient), true);
select setval(pg_get_serial_sequence('public.appointment', 'appointment_id'), (select max(appointment_id) from public.appointment), true);
select setval(pg_get_serial_sequence('public.admission', 'admission_id'), (select max(admission_id) from public.admission), true);
select setval(pg_get_serial_sequence('public.medical_record', 'record_id'), (select max(record_id) from public.medical_record), true);
select setval(pg_get_serial_sequence('public.prescription', 'prescription_id'), (select max(prescription_id) from public.prescription), true);
select setval(pg_get_serial_sequence('public.medication', 'medication_id'), (select max(medication_id) from public.medication), true);
select setval(pg_get_serial_sequence('public.prescription_item', 'prescription_item_id'), (select max(prescription_item_id) from public.prescription_item), true);
select setval(pg_get_serial_sequence('public.bill', 'bill_id'), (select max(bill_id) from public.bill), true);
select setval(pg_get_serial_sequence('public.payment', 'payment_id'), (select max(payment_id) from public.payment), true);
