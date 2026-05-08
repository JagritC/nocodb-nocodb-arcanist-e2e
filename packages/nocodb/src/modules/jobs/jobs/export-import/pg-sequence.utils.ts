import type { Knex } from 'knex';

export const pgRegClassName = (knex: Knex, tableName: string) =>
  knex.raw('??', [tableName]).toQuery();
