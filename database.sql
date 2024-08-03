PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE roasts (
  id integer PRIMARY KEY AUTOINCREMENT,
  gh_username text NOT NULL,
  response text NOT NULL,
  created_at text NOT NULL,
  country text NOT NULL
);
DELETE FROM sqlite_sequence;
CREATE INDEX gh_username_idx ON roasts (gh_username);
