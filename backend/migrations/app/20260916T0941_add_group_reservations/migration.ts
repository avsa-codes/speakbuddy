#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/308a21fa409ef92c5fbd783fe118bfe505d11b3c9fd3dc09cb9fafdf4b883ff0/contract';
import endContract from '../../snapshots/308a21fa409ef92c5fbd783fe118bfe505d11b3c9fd3dc09cb9fafdf4b883ff0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/6939203e0973f1a0c6199a936bb1bab3d9bd27d4a64486cc5cce620ede802c25/contract';
import startContract from '../../snapshots/6939203e0973f1a0c6199a936bb1bab3d9bd27d4a64486cc5cce620ede802c25/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'groupReservation',
        columns: [
          col('cancelledAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('confirmedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('groupDiscussionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reservedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'groupReservation_status_check_6d3a3bcb',
            "\"status\" IN ('RESERVED', 'CONFIRMED', 'CANCELLED', 'EXPIRED')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'groupDiscussion',
        column: col('scheduledStartAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('profilePhoto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'groupReservation',
        constraint: 'groupReservation_userId_groupDiscussionId_key',
        columns: ['userId', 'groupDiscussionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'groupDiscussion',
        index: 'groupDiscussion_scheduledStartAt_idx_16bf47c9',
        columns: ['scheduledStartAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'groupReservation',
        index: 'groupReservation_groupDiscussionId_idx_772d1f81',
        columns: ['groupDiscussionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'groupReservation',
        index: 'groupReservation_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'groupReservation',
        index: 'groupReservation_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'groupReservation',
        foreignKey: {
          name: 'groupReservation_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'groupReservation',
        foreignKey: {
          name: 'groupReservation_groupDiscussionId_fkey',
          columns: ['groupDiscussionId'],
          references: { schema: 'public', table: 'groupDiscussion', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
