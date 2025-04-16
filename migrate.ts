import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';

// ბაზის კავშირის სტრინგი
const connectionString = process.env.DATABASE_URL || 'sqlite://./dev.db';
const sqliteFilename = connectionString.replace('sqlite://', '');

// უფრო მარტივი პირდაპირი მიდგომა
async function createTablesDirectly() {
  console.log('Creating tables directly instead of using migrations...');
  try {
    // ფაილის პირდაპირ შექმნა თუ საჭიროა
    if (!fs.existsSync(sqliteFilename)) {
      const dir = path.dirname(sqliteFilename);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(sqliteFilename, '');
    }

    // შევუერთდეთ SQLite-ს
    const sqlite = new Database(sqliteFilename);
    
    // შევქმნათ ცხრილები პირდაპირ
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        category TEXT NOT NULL,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        unit TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        video_url TEXT,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );
    `);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating tables directly:', error);
    return false;
  }
}

async function main() {
  console.log('Starting database migration...');
  console.log(`Using SQLite database: ${sqliteFilename}`);

  try {
    // პირდაპირი მიდგომა, რადგან მიგრაციები ვერ მუშაობს
    const success = await createTablesDirectly();
    
    if (success) {
      console.log('✅ Database schema created successfully');
      process.exit(0);
    } else {
      console.log('❌ Failed to create database schema');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main(); 