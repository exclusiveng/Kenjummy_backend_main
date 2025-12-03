# Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Changes Completed
- [x] Fixed SSL configuration (conditional for dev/prod)
- [x] Removed subscribers directory reference
- [x] Fixed syntax errors in env.ts
- [x] Created database migrations
- [x] Added auto-migration runner for production
- [x] Build verified successfully

### 2. Files to Commit
```bash
# New files
src/config/migration.datasource.ts
src/migrations/1733235000000-InitialSchema.ts
src/migrations/  (directory)
MIGRATIONS_GUIDE.md

# Modified files
src/config/database.ts
src/config/env.ts
package.json
```

---

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Add database migrations and fix Render deployment issues"
git push origin main
```

### Step 2: Verify Render Environment Variables
Go to your Render dashboard and ensure these are set:

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ⚠️ **CRITICAL** |
| `DATABASE_URL` | (Auto-provided) | ✅ Auto-set |
| `PORT` | `3000` or empty | Optional |
| `FRONTEND_URL` | Your frontend URL | ✅ Required |

### Step 3: Deploy to Render
- Render will automatically detect the push and start deployment
- Or manually trigger deployment from Render dashboard

### Step 4: Monitor Deployment Logs
Watch for these success messages:

```
==> Building...
npm run build
✓ Build successful

==> Starting service...
Attempting to connect to database...
Environment: production
✅ Database connection successful
Connected to database: postgres
Running pending migrations...
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: CREATE TABLE "migrations" ...
query: SELECT * FROM "migrations" ...
query: START TRANSACTION
query: CREATE TABLE "users" ...
query: CREATE TABLE "bookings" ...
query: ALTER TABLE "bookings" ADD CONSTRAINT ...
query: CREATE INDEX "IDX_users_email" ...
query: CREATE INDEX "IDX_bookings_status" ...
query: CREATE INDEX "IDX_bookings_userId" ...
query: INSERT INTO "migrations" ...
query: COMMIT
✅ Migrations completed successfully
Server running on port 3000
Environment: production
```

---

## 🎯 Expected Results

### Database Tables Created
1. **users** - With all columns and email unique constraint
2. **bookings** - With all columns and foreign key to users
3. **migrations** - TypeORM tracking table

### Indexes Created
1. `IDX_users_email` - Fast user lookups
2. `IDX_bookings_status` - Fast status filtering
3. `IDX_bookings_userId` - Fast joins

---

## 🔍 Verification Steps

### 1. Check Render Logs
```
✅ Look for: "✅ Migrations completed successfully"
✅ Look for: "Server running on port 3000"
❌ Watch for: Any error messages
```

### 2. Test API Endpoints
```bash
# Health check
curl https://your-app.onrender.com/health

# Expected response:
{"status":"success","message":"Server is healthy"}
```

### 3. Test Database Connection
Try creating a user via your API:
```bash
curl -X POST https://your-app.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "TestPassword123"
  }'
```

---

## 🐛 Troubleshooting

### Issue: "No pending migrations" but tables don't exist
**Solution:** 
- Check if migrations table exists
- Manually run: `npm run migration:run` (if you have shell access)
- Or redeploy with fresh database

### Issue: "Migration failed" error
**Solution:**
- Check Render logs for specific SQL error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL version compatibility

### Issue: "SSL connection error"
**Solution:**
- Verify `NODE_ENV=production` is set in Render
- Check that SSL configuration is conditional

### Issue: Tables exist but migration fails
**Solution:**
- The migration may have partially run
- You may need to:
  1. Drop the database (Render dashboard)
  2. Create a new database
  3. Redeploy

---

## 📊 Database Access (Optional)

If you need to inspect the database directly:

### Via Render Dashboard
1. Go to your PostgreSQL database in Render
2. Click "Connect" → "External Connection"
3. Use provided credentials with a PostgreSQL client

### Via psql
```bash
psql <DATABASE_URL>

# Check tables
\dt

# Check migrations
SELECT * FROM migrations;

# Check users
SELECT id, email, role FROM users;
```

---

## 🎉 Success Criteria

Your deployment is successful when:

- [x] Build completes without errors
- [x] Server starts and connects to database
- [x] Migrations run successfully
- [x] All tables are created
- [x] Health endpoint returns 200 OK
- [x] API endpoints are accessible
- [x] No error logs in Render dashboard

---

## 📝 Post-Deployment

### Next Steps
1. Test all API endpoints
2. Verify CORS is working with frontend
3. Create initial admin user (if needed)
4. Monitor logs for any issues
5. Set up monitoring/alerts (optional)

### Ongoing Maintenance
- New schema changes → Create new migration
- Never edit existing migrations
- Always test migrations locally first
- Keep migrations small and focused

---

## 🆘 Need Help?

### Common Commands
```bash
# View logs
# (In Render dashboard → Logs tab)

# Restart service
# (In Render dashboard → Manual Deploy → Clear build cache & deploy)

# Check migration status
npm run migration:show

# Revert last migration (careful!)
npm run migration:revert
```

### Resources
- [TypeORM Migrations Docs](https://typeorm.io/migrations)
- [Render PostgreSQL Docs](https://render.com/docs/databases)
- `MIGRATIONS_GUIDE.md` - Detailed migration guide

---

*Ready to deploy! 🚀*
