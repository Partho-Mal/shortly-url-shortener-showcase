# 📘 Database Schema & Queries

> This is a **lightweight showcase DB schema** used for the Shortly demo.
> Includes **Users, URLs, and URL Visits**. No subscription tables.

---

## 👤 Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%'),

  password TEXT, -- Nullable for OAuth users

  username TEXT UNIQUE NOT NULL,

  provider TEXT DEFAULT 'local' CHECK (provider IN ('local', 'google')),
  provider_id TEXT UNIQUE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Password & Provider Validation

```sql
ALTER TABLE users ADD CONSTRAINT password_or_provider_id_check
CHECK (
  (provider = 'local' AND password IS NOT NULL AND provider_id IS NULL) OR
  (provider != 'local' AND password IS NULL AND provider_id IS NOT NULL)
);
```

---

## 🔁 Trigger for `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
```

```sql
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔗 URLs Table

```sql
CREATE TABLE urls (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL CHECK (length(slug) BETWEEN 4 AND 100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

```sql
ALTER TABLE urls ADD COLUMN expires_at TIMESTAMP;
ALTER TABLE urls ADD COLUMN click_count INTEGER DEFAULT 0;
ALTER TABLE urls ADD COLUMN last_clicked_at TIMESTAMP;
```

---

## 📊 URL Visits Table

```sql
CREATE TABLE url_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id TEXT REFERENCES urls(id) ON DELETE CASCADE,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    referer TEXT,
    user_agent TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    browser TEXT,
    os TEXT,
    device TEXT,
    is_unique BOOLEAN DEFAULT FALSE
);
```

---

## 🔍 Notes

* `urls` relates to `users` through `user_id`.
* `url_visits` tracks analytics such as IP, UA, city, country.
* `click_count` + `last_clicked_at` are stored in `urls` for faster lookup.
* No subscription or payment-related structures exist in this version.

---

## ✅ Key Points

* Simplified schema designed for rapid evaluation.
* Clean separation: `users`, `urls`, and `url_visits`.
* Minimal triggers — only `updated_at` automated.
* Foreign key protections (`ON DELETE CASCADE`) ensure cleanup.
