# Database Migrations Setup Guide

## ✅ What Was Set Up

Your backend now has a complete database migration system that will:
- **Automatically create all database tables** in production (Render)
- **Run migrations automatically** when the server starts in production
- **Use synchronize mode** in development for easier local development

---

## 📁 Files Created

### 1. **Migration Configuration**
- `src/config/migration.datasource.ts` - TypeORM CLI configuration for migrations

### 2. **Initial Migration**
- `src/migrations/1733235000000-InitialSchema.ts` - Creates users and bookings tables

### 3. **Updated Files**
- `src/config/database.ts` - Now runs migrations automatically in production
- `package.json` - Added migration scripts

---

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- fullName (String)
- email (String, Unique)
- phone (String)
- role (Enum: 'user' | 'admin', Default: 'user')
- password (String, Hashed)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Bookings Table
```sql
- id (UUID, Primary Key)
- userId (UUID, Foreign Key -> users.id)
- serviceType (Enum: 'charter' | 'intercity' | 'vip' | 'hire')
- status (Enum: 'pending' | 'confirmed' | 'completed' | 'cancelled')
- fullName, phone, email (Strings)
- pickup, dropoff, departure, destination (Optional Strings)
- date, time (Optional Date/Time)
- vehicle, duration, specialRequest (Optional Strings)
- numberOfPassengers (Optional Integer)
- startDate, startTime, endDate, endTime (Optional Date/Time)
- purpose, travelTime (Optional Strings)
- days (Array of Strings)
- createdAt, updatedAt (Timestamps)
```

### Indexes Created
- `users.email` - For faster user lookups
- `bookings.status` - For faster status filtering
- `bookings.userId` - For faster user-booking joins

---

## 🚀 How It Works

### In Production (Render):
1. Server starts
2. Connects to PostgreSQL database
3. **Automatically runs all pending migrations**
4. Creates tables if they don't exist
5. Server becomes ready to accept requests

### In Development (Local):
1. Server starts
2. Connects to local PostgreSQL database
3. **Uses TypeORM synchronize mode** (auto-creates/updates tables)
4. No migrations needed locally

---

## 📝 Available Migration Commands

```bash
# Generate a new migration (after changing entities)
npm run migration:generate src/migrations/MigrationName

# Run pending migrations manually
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

---

## 🔧 What Happens on Render Deployment

When you deploy to Render, the following will happen automatically:

1. **Build Phase**: `npm run build`
   - Compiles TypeScript to JavaScript
   - Creates `dist/` folder

2. **Start Phase**: `npm start`
   - Runs `node dist/server.js`
   - Connects to Render PostgreSQL database
   - **Automatically runs migrations** ✅
   - Creates all tables and indexes
   - Server starts listening

### Expected Logs on Render:
```
Attempting to connect to database...
Environment: production
✅ Database connection successful
Connected to database: postgres
Running pending migrations...
✅ Migrations completed successfully
Server running on port 3000
Environment: production
```

---

## ⚙️ Environment Variables on Render

Make sure these are set in your Render dashboard:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | (Auto-provided by Render) | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `3000` (or leave empty) | Optional |
| `FRONTEND_URL` | Your frontend URL | ✅ Yes |

---

## 🔄 Adding New Migrations (Future Changes)

When you modify your entities (add columns, tables, etc.):

### Option 1: Manual Migration (Recommended for Production)
1. Create a new migration file in `src/migrations/`
2. Write the SQL queries in `up()` and `down()` methods
3. Commit and push to trigger Render deployment
4. Migration runs automatically on next deployment

### Option 2: Auto-Generate (Development Only)
```bash
npm run migration:generate src/migrations/DescriptiveName
```

---

## 🧪 Testing Migrations Locally

If you want to test migrations locally instead of using synchronize:

1. **Disable synchronize in development** (optional):
   ```typescript
   // In src/config/database.ts
   synchronize: false, // Change from true
   ```

2. **Run migrations manually**:
   ```bash
   npm run migration:run
   ```

3. **Check migration status**:
   ```bash
   npm run migration:show
   ```

---

## 🛡️ Migration Safety

✅ **Safe Practices:**
- Migrations run in a transaction (rollback on error)
- Migrations run only once (tracked in `migrations` table)
- Down migrations allow reverting changes
- Indexes improve query performance

⚠️ **Important Notes:**
- Never edit a migration that has already run in production
- Always create a new migration for schema changes
- Test migrations locally before deploying
- Keep migrations small and focused

---

## 📊 Migration Table

TypeORM automatically creates a `migrations` table to track which migrations have run:

```sql
migrations
- id (Integer)
- timestamp (Bigint)
- name (String)
```

This ensures migrations only run once and in the correct order.

---

## 🐛 Troubleshooting

### Migration Fails on Render
**Check Render logs for the error message:**
```bash
# In Render dashboard -> Logs
```

**Common issues:**
- SQL syntax error → Fix the migration file
- Column already exists → Migration already ran, create a new one
- Foreign key violation → Check data integrity

### Reset Database (Development Only)
```bash
# Revert all migrations
npm run migration:revert

# Or drop and recreate database
# Then run migrations again
npm run migration:run
```

---

## ✨ Summary

Your database migration system is now fully configured! 

**What you need to do:**
1. ✅ Commit all changes to Git
2. ✅ Push to your repository
3. ✅ Deploy to Render
4. ✅ Check Render logs to confirm migrations ran successfully

**What happens automatically:**
- Database tables are created on first deployment
- Future schema changes are applied via migrations
- No manual database setup required! 🎉

---

*Last Updated: 2025-12-03*
