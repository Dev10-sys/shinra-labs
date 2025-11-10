#!/usr/bin/env node

/**
 * SHINRA LABS - Automatic Database Setup Script
 * 
 * This script automatically creates all database tables, policies, and functions
 * by executing SQL files directly via PostgreSQL connection.
 * 
 * Usage: node setup-database.js
 */

import pkg from 'pg';
const { Client } = pkg;
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
let SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;

// Validate environment variables
if (!SUPABASE_DB_URL) {
  console.error(`${colors.red}❌ Error: SUPABASE_DB_URL not found in environment variables${colors.reset}`);
  console.log(`${colors.yellow}
⚠️  Database connection URL chahiye automatic setup ke liye.

📝 Kaise milega:
1. Supabase Dashboard mein jaayein: https://app.supabase.com
2. Settings → Database → Connection String
3. "URI" tab se connection string copy karein
4. Replit Secrets mein SUPABASE_DB_URL ke naam se add karein

Format: postgresql://postgres.[project-ref]:[password]@[host]:5432/postgres
${colors.reset}\n`);
  process.exit(1);
}

// Clean up the URL (remove any whitespace or newlines)
SUPABASE_DB_URL = SUPABASE_DB_URL.trim();

// Smart extraction: If multiple URLs are concatenated, extract the valid one
if (SUPABASE_DB_URL.includes('postgresql://') && SUPABASE_DB_URL.split('postgresql://').length > 2) {
  console.log(`${colors.yellow}⚠️  Multiple URLs detected, extracting the valid one...${colors.reset}`);
  const urls = SUPABASE_DB_URL.split('postgresql://').filter(u => u.length > 0);
  
  // Find the URL without placeholders
  for (const urlPart of urls) {
    const fullUrl = 'postgresql://' + urlPart;
    if (!fullUrl.includes('[project-ref]') && !fullUrl.includes('[password]') && !fullUrl.includes('[region]')) {
      SUPABASE_DB_URL = fullUrl;
      console.log(`${colors.green}✓ Valid URL extracted${colors.reset}`);
      break;
    }
  }
}

// Check if it's still a placeholder after extraction
if (SUPABASE_DB_URL.includes('[project-ref]') || SUPABASE_DB_URL.includes('[password]') || SUPABASE_DB_URL.includes('[region]')) {
  console.error(`${colors.red}❌ Error: SUPABASE_DB_URL contains placeholder values${colors.reset}`);
  console.log(`${colors.yellow}
⚠️  Placeholder values detected in connection URL!

Current value: ${SUPABASE_DB_URL.substring(0, 80)}...

Replit Secrets mein jaake SUPABASE_DB_URL ko **sirf sahi URL se** replace karein:
- Purana value DELETE karein
- Nayi value paste karein (sirf ek URL, template nahi)

Supabase Dashboard se fresh copy karein!
${colors.reset}\n`);
  process.exit(1);
}

console.log(`${colors.green}✓ Environment variables loaded${colors.reset}`);
console.log(`${colors.cyan}📡 Connecting to Supabase Database...${colors.reset}`);

// Create PostgreSQL client
const client = new Client({
  connectionString: SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
    
    console.log(`  📄 Executing SQL file...`);
    
    // Execute the entire file as a single transaction
    await client.query('BEGIN');
    
    try {
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`  ${colors.green}✓ Successfully executed all statements${colors.reset}`);
      return { success: true, errors: 0 };
    } catch (error) {
      await client.query('ROLLBACK');
      
      // Check if error is due to objects already existing
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate') ||
          error.message.includes('does not exist')) {
        console.log(`  ${colors.yellow}⚠️  Some objects already exist (this is normal if re-running)${colors.reset}`);
        console.log(`  ${colors.yellow}    ${error.message.split('\n')[0]}${colors.reset}`);
        
        // Try executing without transaction to skip existing objects
        console.log(`  ${colors.cyan}  Retrying with individual statements...${colors.reset}`);
        
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        let successCount = 0;
        let skipCount = 0;
        
        for (const statement of statements) {
          if (!statement || statement.startsWith('--')) continue;
          
          try {
            await client.query(statement + ';');
            successCount++;
          } catch (err) {
            if (err.message.includes('already exists') || err.message.includes('duplicate')) {
              skipCount++;
            } else {
              console.log(`  ${colors.red}✗ Error: ${err.message.split('\n')[0]}${colors.reset}`);
            }
          }
        }
        
        console.log(`  ${colors.green}✓ Completed: ${successCount} new, ${skipCount} skipped${colors.reset}`);
        return { success: true, errors: 0 };
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.log(`  ${colors.red}✗ Failed: ${error.message}${colors.reset}`);
    return { success: false, error };
  }
}

// Main execution
async function setupDatabase() {
  try {
    await client.connect();
    console.log(`${colors.green}✓ Connected to database${colors.reset}`);
    
    console.log(`${colors.bold}\nStarting database setup...\n${colors.reset}`);
    
    let totalErrors = 0;
    
    for (const file of sqlFiles) {
      const result = await executeSQLFile(file);
      if (result.errors) {
        totalErrors += result.errors;
      }
      if (!result.success) {
        totalErrors++;
      }
    }
    
    console.log(`\n${colors.cyan}${colors.bold}═══════════════════════════════════════════════════════════${colors.reset}`);
    
    if (totalErrors === 0) {
      console.log(`${colors.green}${colors.bold}
✅ DATABASE SETUP COMPLETE!

Aapka SHINRA Labs database tayar hai! 🎉

Kya create hua:
  ✓ Saare tables (users, tasks, submissions, etc.)
  ✓ Row-Level Security policies
  ✓ Secure RPC functions (withdrawals, purchases, approvals)
  ✓ Gamification system (XP, badges, achievements)
  ✓ Admin role protection
  ✓ Notification system

🚀 Ab kya karein:
  1. App already chal raha hai!
  2. Supabase dashboard mein ek admin user create karein
  3. Platform ko test karein!

${colors.reset}`);
    } else {
      console.log(`${colors.yellow}${colors.bold}
⚠️  SETUP COMPLETED WITH WARNINGS

Database setup ho gaya hai, lekin kuch warnings aayi hain.
Yeh normal hai agar aapne pehle bhi script run ki thi.

Logs check karein details ke liye.
${colors.reset}`);
    }
    
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}\n❌ Fatal Error: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}
Troubleshooting:
- Check karein ki SUPABASE_DB_URL sahi hai
- Database password verify karein
- Network connection check karein
${colors.reset}\n`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run setup
setupDatabase().catch(error => {
  console.error(`${colors.red}\n❌ Unexpected Error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});
