# GitHub Pages and Supabase Deployment Guide

Complete each section in order. Do not skip the staff-profile or Data API steps.

## 1 Create a Supabase Project

1. Open [Supabase](https://supabase.com/dashboard).
2. Select **New project**.
3. Choose your organization.
4. Enter a project name such as `hospital-management-db`.
5. Create and safely store the database password.
6. Choose the closest available region.
7. Select **Create new project**.
8. Wait until the database is ready.

## 2 Create the Database

The first SQL file resets the hospital tables. Run it only on a new project or when you intentionally want to erase and recreate this project database.

1. In Supabase, open **SQL Editor**.
2. Select **New query**.
3. Open `supabase/01_setup_database.sql` from this repository.
4. Copy the entire file into the SQL Editor.
5. Select **Run**.
6. Confirm that the query finishes without errors.
7. Create another new query.
8. Open `supabase/02_seed_data.sql`.
9. Copy the entire file into the SQL Editor.
10. Select **Run**.

The database now contains the schema and sample hospital information.

## 3 Create the First Login

1. Open **Authentication** in Supabase.
2. Open **Users**.
3. Select **Add user**.
4. Choose **Create new user**.
5. Enter the staff email and a strong temporary password.
6. Enable automatic email confirmation if the form provides that option.
7. Create the user.
8. Open the created user and copy its UUID.

## 4 Approve the Login as Hospital Staff

Creating an Auth user is not enough. The user must also appear in `staff_profiles`.

1. Open `supabase/03_add_first_staff.sql`.
2. Replace `PASTE_AUTH_USER_UUID_HERE` with the UUID copied from Authentication.
3. Change `Hospital Administrator` to the real staff name if desired.
4. Keep the role as `admin` for the first account.
5. Copy the edited statement into a new Supabase SQL Editor query.
6. Select **Run**.

To approve another user later, create the Auth user first and run another insert:

```sql
insert into public.staff_profiles (user_id, full_name, role, is_active)
values ('THE_NEW_USER_UUID', 'Staff Name', 'staff', true);
```

To block an account without deleting its records:

```sql
update public.staff_profiles
set is_active = false
where user_id = 'THE_USER_UUID';
```

## 5 Confirm Data API Access

Supabase projects created under the current Data API rules may not automatically expose newly created tables.

1. In the Supabase dashboard, open **Integrations**.
2. Open **Data API** and then its settings.
3. Confirm that the `public` schema is exposed.
4. Confirm that these tables are available to the Data API:
   - `staff_profiles`
   - `department`
   - `doctor`
   - `patient`
   - `room`
   - `appointment`
   - `admission`
   - `medical_record`
   - `prescription`
   - `medication`
   - `prescription_item`
   - `bill`
   - `payment`
5. Confirm that these views are available:
   - `patient_history`
   - `upcoming_appointments`
   - `bill_balance`
   - `current_admissions`
   - `available_rooms`
   - `low_medication_stock`
   - `doctors_by_department`
   - `prescription_details`

The setup SQL already grants the required permissions and enables RLS. This dashboard step makes the selected entities reachable through the Data API.

## 6 Verify the Database

1. Open `supabase/04_verify_setup.sql`.
2. Copy it into a new SQL Editor query.
3. Select **Run**.
4. Confirm that every hospital table has records.
5. Confirm that `rls_enabled` is `true` for every listed project table.
6. Confirm that room `A201` is `Occupied` and the discharged admission rooms are `Available`.
7. Confirm that bills 3 and 4 are `Paid`, bill 2 is `Partially Paid`, and bills 1 and 5 are `Unpaid`.

Expected sample counts:

| Table | Count |
| --- | ---: |
| department | 4 |
| doctor | 5 |
| patient | 6 |
| room | 6 |
| appointment | 6 |
| admission | 3 |
| medical_record | 6 |
| prescription | 4 |
| medication | 6 |
| prescription_item | 5 |
| bill | 5 |
| payment | 4 |

## 7 Copy the Supabase Project Values

1. Open your Supabase project settings or the project **Connect** panel.
2. Find the project URL.
3. Copy the browser-safe **publishable key**.
4. If your project only displays the legacy key names, copy the browser-safe `anon` public key.
5. Never copy the service-role key or secret key into this project.

Open `js/config.js` and replace both placeholders:

```javascript
window.APP_CONFIG = {
  supabaseUrl: "https://your-project-reference.supabase.co",
  supabasePublishableKey: "your-browser-safe-publishable-key"
};
```

Save the file.

## 8 Test Locally

1. Open a terminal inside the repository folder.
2. Run:

```bash
python -m http.server 8000
```

3. Visit `http://localhost:8000`.
4. Sign in using the Auth email and password created earlier.
5. Confirm that the dashboard loads.
6. Open Patients and confirm that six sample patients appear.
7. Add a temporary record, edit it, and delete it.
8. Open Reports and run each report.

If login succeeds but no data appears, review sections 4 and 5.

## 9 Create the GitHub Repository

1. Sign in to [GitHub](https://github.com).
2. Select **New repository**.
3. Enter a name such as `hospital-management-database`.
4. Select **Public** if you are using GitHub Free Pages.
5. Create the repository without adding a generated README because this package already contains one.

## 10 Upload the Files

The repository root must directly contain `index.html`. Do not upload one outer folder that contains all the files.

The correct GitHub layout is:

```text
index.html
app.html
README.md
DEPLOYMENT_GUIDE.md
SECURITY.md
css/
js/
supabase/
```

You may upload the files through GitHub's **Add file** and **Upload files** interface, or use Git:

```bash
git init
git add .
git commit -m "Add hospital management web application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## 11 Enable GitHub Pages

1. Open the repository on GitHub.
2. Select **Settings**.
3. Open **Pages** under **Code, planning, and automation**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch.
6. Select the `/(root)` folder.
7. Select **Save**.
8. Wait for the Pages deployment to finish.
9. Select **Visit site** when GitHub displays the website URL.

The URL normally has this form:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

## 12 Configure the Supabase Site URL

1. In Supabase, open **Authentication**.
2. Open **URL Configuration**.
3. Set **Site URL** to the complete GitHub Pages URL.
4. Add the same GitHub Pages URL to the allowed redirect URLs.
5. Also keep `http://localhost:8000` as an allowed redirect URL while testing locally.
6. Save the settings.

The current login uses email and password and does not require an email redirect after the administrator creates and confirms the user. These URL settings keep confirmation and recovery flows ready for later use.

## 13 Final Test

1. Open the GitHub Pages URL in a private browser window.
2. Confirm that the login page appears.
3. Sign in with the approved staff account.
4. Confirm that the dashboard totals appear.
5. Test adding and deleting one temporary patient.
6. Test the available-room and outstanding-bill reports.
7. Sign out and confirm that `app.html` cannot be used without signing in again.

## Common Errors

### Configuration message on the login page

`js/config.js` still contains placeholder values.

### Invalid API key

The wrong key was copied. Use the publishable key or legacy anonymous public key, not the service-role or secret key.

### Table not found or schema-cache error

The SQL file did not finish, or the table is not enabled in Data API settings. Recheck sections 2 and 5.

### Permission denied for table

Run `supabase/01_setup_database.sql` again only if this is a new disposable project. On a project containing important data, inspect the GRANT statements instead of resetting it.

### Login works but the app says the account is not approved

The Auth user's UUID was not inserted into `staff_profiles`, or `is_active` is false. Repeat section 4.

### Login works but all tables are empty

The staff profile is missing, RLS is blocking the account, or `02_seed_data.sql` was not run.

### GitHub Pages shows 404

Confirm that `index.html` is at the repository root and Pages is configured for `main` and `/(root)`.

### Changes are not visible

Wait for the latest Pages deployment to finish, then refresh the page without cache.
