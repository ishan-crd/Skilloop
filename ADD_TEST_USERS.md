# Add Test Users to Database

## Quick Fix for "No more profiles to show"

### Option 1: Run the SQL Script (Recommended)
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `insert-test-users.sql`
4. Click **"Run"**
5. This will add 7 test users with different roles

### Option 2: Use Fallback Profiles (Already Added)
I've already added fallback profiles in the code, so you should see:
- **Sarah Johnson** (Founder)
- **Alex Chen** (Freelancer) 
- **Maria Rodriguez** (Student)

### Why You're Seeing "No more profiles to show"
1. **Database is empty** - No test users added yet
2. **RLS blocking queries** - Row Level Security might be blocking the query
3. **Role filtering** - Your role might not match any available profiles

### To Add Real Test Users:
Run this in Supabase SQL Editor:

```sql
-- Copy the entire contents of insert-test-users.sql and run it
```

This will add users like:
- Ananya Sharma (Freelancer)
- Sam Mathews (Founder)
- Dev Singh (Student)
- Rachit Singh (Company)
- Ishan Gupta (Freelancer)
- Ruchita Singh (Student)
- Manasvi Aggarwal (Founder)

### Check Your Role
Make sure your onboarding role matches what profiles you can see:
- **Freelancer** → sees Founders
- **Founder** → sees Students and Freelancers
- **Company** → sees Founders, Students, and Freelancers
- **Student** → sees Founders, Freelancers, and Companies
