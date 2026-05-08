import assert from 'node:assert/strict';
import knex from 'knex';
import { pgRegClassName } from './pg-sequence.utils';

const db = knex({ client: 'pg' });

try {
  const tableName = pgRegClassName(db, 'public.Mixed Case Table');
  const query = db
    .raw('SELECT pg_get_serial_sequence(?, ?) as seq;', [tableName, 'Id'])
    .toSQL();
  const sequenceValueQuery = db
    .raw(
      `SELECT last_value as last
                    FROM pg_sequences
                    WHERE format('%I.%I', schemaname, sequencename)::regclass = ?::regclass;`,
      ['public."Mixed Case Table_Id_seq"'],
    )
    .toSQL();

  assert.equal(tableName, '"public"."Mixed Case Table"');
  assert.equal(query.sql, 'SELECT pg_get_serial_sequence(?, ?) as seq;');
  assert.deepEqual(query.bindings, ['"public"."Mixed Case Table"', 'Id']);
  assert.equal(
    sequenceValueQuery.sql,
    `SELECT last_value as last
                    FROM pg_sequences
                    WHERE format('%I.%I', schemaname, sequencename)::regclass = ?::regclass;`,
  );
  assert.deepEqual(sequenceValueQuery.bindings, [
    'public."Mixed Case Table_Id_seq"',
  ]);
} finally {
  void db.destroy();
}
