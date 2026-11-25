# Hospital Management Database System

This repository contains the hosted version of the COE 418 Hospital Management Database project.

The website is hosted using GitHub Pages. Supabase provides PostgreSQL, authentication, the Data API, row-level security, views, and database triggers.

## Main Features

- Staff email and password login
- Approved-staff authorization
- Dashboard with live database totals
- Add, search, update, and delete operations
- Column filters and sortable table headings
- Pagination and selectable page sizes
- Live record and report result counts
- Status badges and direct row editing
- Human-readable patient, doctor, department, medication and billing labels instead of foreign-key numbers
- One-click data refresh and CSV export
- Light and dark interface themes
- Dashboard quick actions for common records
- Departments, doctors, patients, rooms, appointments, admissions, medical records, prescriptions, medications, bills, and payments
- Prepared joined reports
- CSV export
- Automatic room availability updates
- Automatic medication stock updates
- Automatic bill payment-status updates
- Responsive desktop and mobile layout

## Required Setup

Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) from beginning to end.

The short version is:

1. Create a Supabase project.
2. Run the four files in the `supabase` folder in the documented order.
3. Create a Supabase Auth user and approve it in `staff_profiles`.
4. Copy the project URL and publishable key into `js/config.js`.
5. Upload the repository contents to GitHub.
6. Enable GitHub Pages from the `main` branch and repository root.

## Project Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Staff login page |
| `app.html` | Main management application |
| `css/styles.css` | Responsive interface styling |
| `js/config.js` | Supabase URL and publishable key |
| `js/supabase-client.js` | Supabase browser client initialization |
| `js/login.js` | Login and session handling |
| `js/app.js` | Dashboard, CRUD, reports, and CSV export |
| `supabase/01_setup_database.sql` | PostgreSQL schema, triggers, views, RLS, grants, and indexes |
| `supabase/02_seed_data.sql` | Sample hospital records |
| `supabase/03_add_first_staff.sql` | Approves the first Auth user |
| `supabase/04_verify_setup.sql` | Database verification queries |
| `DEPLOYMENT_GUIDE.md` | Complete setup instructions |
| `SECURITY.md` | Required security rules |

## Local Preview

Open a terminal in the repository folder and run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

The Supabase project must already be configured for login and database access to work.

## Important

The publishable key or legacy anonymous key may be used in `js/config.js` because database access is protected by Supabase Auth and RLS.

Never place the service-role key, secret key, database password, or personal access token in this repository.
