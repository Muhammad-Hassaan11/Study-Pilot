import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { applyMutation, initialData, type Mutation, type StudyData } from './model';

export class StoreError extends Error { constructor(message: string, public status: number) { super(message); } }
export function createStore(path: string) {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, student TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS requests (student TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE, id TEXT NOT NULL, PRIMARY KEY(student,id));`);
  const hash = (token: string) => createHash('sha256').update(token).digest('hex');
  function student(token: string) {
    const row = db.prepare('SELECT students.id, students.data FROM sessions JOIN students ON students.id=sessions.student WHERE token=? AND expires>?').get(hash(token), Date.now()) as { id: string; data: string } | undefined;
    if (!row) throw new StoreError('Your session has ended. Continue as a new guest to start a new workspace.', 401);
    return row;
  }
  return {
    create(timezone: string) {
      const token = randomBytes(32).toString('hex'), owner = randomUUID(), data = initialData(timezone);
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('INSERT INTO students VALUES (?,?)').run(owner, JSON.stringify(data));
        db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(hash(token), owner, Date.now() + 365 * 86400000);
        db.exec('COMMIT'); return { token, data };
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    read(token: string): StudyData { return JSON.parse(student(token).data); },
    mutate(token: string, requestId: string, revision: number, mutation: Mutation): StudyData {
      db.exec('BEGIN IMMEDIATE');
      try {
        const row = student(token), current: StudyData = JSON.parse(row.data);
        if (db.prepare('SELECT 1 FROM requests WHERE student=? AND id=?').get(row.id, requestId)) { db.exec('COMMIT'); return current; }
        if (current.revision !== revision) throw new StoreError('Your workspace changed in another tab. Reload the latest data, review your draft, then save again.', 409);
        let data: StudyData;
        try { data = applyMutation(current, mutation); } catch (error) { throw new StoreError(error instanceof Error ? error.message : 'Invalid input.', 400); }
        db.prepare('UPDATE students SET data=? WHERE id=?').run(JSON.stringify(data), row.id);
        db.prepare('INSERT INTO requests VALUES (?,?)').run(row.id, requestId);
        db.exec('COMMIT'); return data;
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    signout(token: string) { db.prepare('DELETE FROM sessions WHERE token=?').run(hash(token)); },
    delete(token: string) { const row = student(token); db.prepare('DELETE FROM students WHERE id=?').run(row.id); },
    close() { db.close(); }
  };
}
let store: ReturnType<typeof createStore> | undefined;
export function getStore() { return store ??= createStore(process.env.STUDYPILOT_DB_PATH || '.data/studypilot.sqlite'); }
