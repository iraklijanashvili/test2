CREATE TABLE recipes (
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
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        unit TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );
CREATE TABLE steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );
CREATE TABLE news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        video_url TEXT,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );
