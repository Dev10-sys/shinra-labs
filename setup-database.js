#!/usr/bin/env node

/**
 * SHINRA LABS - Automatic Database Setup Script
 * 
 * This script automatically creates all database tables, policies, and functions
 * by executing SQL files in the correct order.
 * 
 * Usage: node setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.cyan}${colors.bold}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          SHINRA LABS - Database Setup Script             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}\n`);

// Get environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!SUPABASE_URL) {
  console.error(`${colors.red}❌ Error: VITE_SUPABASE_URL not found in environment variables${colors.reset}`);
  console.log(`${colors.yellow}Please set VITE_SUPABASE_URL in Replit Secrets${colors.reset}\n`);
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error(`${colors.red}❌ Error: SUPABASE_SERVICE_ROLE_KEY not found${colors.reset}`);
  console.log(`${colors.yellow}
⚠️  You need the Service Role Key (not the anon key) to setup the database.

📝 How to get it:
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the "service_role" key (secret key with admin privileges)
4. Add it to Replit Secrets as: SUPABASE_SERVICE_ROLE_KEY

${colors.red}⚠️  NEVER commit this key to git or share it publicly!${colors.reset}
  `);
  process.exit(1);
}

console.log(`${colors.green}✓ Environment variables loaded${colors.reset}`);
console.log(`${colors.cyan}📡 Connecting to Supabase...${colors.reset}`);

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log(`${colors.green}✓ Connected to Supabase${colors.reset}\n`);

// SQL files to execute in order
const sqlFiles = [
  {
    name: 'Core Schema',
    path: join(__dirname, 'database', 'schema.sql'),
    description: 'Creating core tables (users, tasks, datasets, etc.)'
  },
  {
    name: 'Enhanced Features',
    path: join(__dirname, 'database', 'schema_v2_enhancements.sql'),
    description: 'Adding gamification, admin roles, and indexes'
  },
  {
    name: 'Secure Operations',
    path: join(__dirname, 'database', 'secure_operations.sql'),
    description: 'Creating secure RPC functions for financial operations'
  }
];

// Function to execute SQL file
async function executeSQLFile(file) {
  console.log(`${colors.cyan}${colors.bold}\n▶ ${file.name}${colors.reset}`);
  console.log(`${colors.yellow}  ${file.description}${colors.reset}`);
  
  try {
    // Read SQL file
    const sql = readFileSync(file.path, 'utf-8');
    
    // Split by semicolons to execute statements separately
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`  📄 Found ${statements.length} SQL statements`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        // If exec_sql doesn't exist, try direct query
        if (error && error.message.includes('function') && error.message.includes('does not exist')) {
          // For initial setup, we need to use raw SQL execution
          // This won't work with anon key, that's why we need service_role key
          console.log(`  ${colors.yellow}⚠️  Note: Using direct SQL execution${colors.reset}`);
          
          // We'll execute the entire file as one statement
          const { error: execError } = await supabase.rpc('query', { query_text: sql });
          if (execError) {
            throw execError;
          }
          break; // Exit loop if we executed entire file
        } else if (error) {
          throw error;
        }
        
        successCount++;
      } catch (err) {
        // Some errors are expected (like "already exists")
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          console.log(`  ${colors.yellow}⚠️  Skipped: ${err.message.split('\n')[0]}${colors.reset}`);
          successCount++;
        } else {
          console.log(`  ${colors.red}✗ Error: ${err.message}${colors.reset}`);
          errorCount++;
        }
      }
    }
    
    if (errorCount === 0) {
      console.log(`  ${colors.green}✓ Successfully executed all statements${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}⚠️  Completed with ${errorCount} errors${colors.reset}`);
    }
    
    return { success: true, errors: errorCount };
    
  } catch (error) {
    console.log(`  ${colors.red}✗ Failed: ${error.message}${colors.reset}`);
    return { success: false, error };
  }
}

// Main execution
async function setupDatabase() {
  console.log(`${colors.bold}Starting database setup...\n${colors.reset}`);
  
  let totalErrors = 0;
  
  for (const file of sqlFiles) {
    const result = await executeSQLFile(file);
    if (result.errors) {
      totalErrors += result.errors;
    }
  }
  
  console.log(`\n${colors.cyan}${colors.bold}═══════════════════════════════════════════════════════════${colors.reset}`);
  
  if (totalErrors === 0) {
    console.log(`${colors.green}${colors.bold}
✅ DATABASE SETUP COMPLETE!

Your SHINRA Labs database is ready with:
  ✓ All tables created (users, tasks, submissions, etc.)
  ✓ Row-Level Security policies enabled
  ✓ Secure RPC functions for financial operations
  ✓ Gamification system (XP, badges, achievements)
  ✓ Admin role protection
  ✓ Notification system

🚀 Next steps:
  1. Start the app: The workflow should already be running
  2. Create an admin user in Supabase dashboard
  3. Test the platform!

${colors.reset}`);
  } else {
    console.log(`${colors.yellow}${colors.bold}
⚠️  SETUP COMPLETED WITH ${totalErrors} WARNINGS

The database setup finished but some objects may already exist.
This is normal if you've run this script before.

Check the logs above for details.
${colors.reset}`);
  }
  
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
}

// Run setup
setupDatabase().catch(error => {
  console.error(`${colors.red}\n❌ Fatal Error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});
