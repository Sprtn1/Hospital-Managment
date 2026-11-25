# Security Rules

## Safe to Place in the Frontend

- Supabase project URL
- Supabase publishable key
- Legacy Supabase anonymous public key

These browser values are protected by authentication, explicit grants, and row-level security.

## Never Place in GitHub or Browser JavaScript

- Supabase service-role key
- Supabase secret key
- Database password
- Personal access token
- GitHub token
- Staff passwords

## Access Model

An account must satisfy both conditions:

1. It exists in Supabase Auth.
2. Its Auth UUID exists in `staff_profiles` with `is_active = true`.

RLS applies the same approved-staff requirement to every hospital table. The staff profile table only allows a signed-in user to read their own profile. Staff approval and deactivation are performed through the Supabase SQL Editor by the project administrator.

## Public Repository Warning

GitHub Pages is public. Do not place real patient names, phone numbers, addresses, diagnoses, passwords, or other confidential hospital data in repository files.

The included records are fictional sample data for the course project.
