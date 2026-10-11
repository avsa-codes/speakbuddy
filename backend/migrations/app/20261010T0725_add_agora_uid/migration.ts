#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1eac60839d8bf480c5d6069398f890139c9f491ab549accd9d47ceed0692c87d/contract';
import endContract from '../../snapshots/1eac60839d8bf480c5d6069398f890139c9f491ab549accd9d47ceed0692c87d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract';
import startContract from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract.json' with { type: 'json' };
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
        column: col('agoraUid', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('profilePhoto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'conversation',
        constraint: 'conversation_duration_non_negative_check_d99cb446',
        expression: 'duration >= 0',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'conversation',
        constraint: 'conversation_no_self_conversation_check_19b24f66',
        expression: '"user1Id" <> "user2Id"',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'conversation',
        constraint: 'conversation_valid_time_range_check_3308ff50',
        expression: '"endedAt" >= "startedAt"',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'groupDiscussion',
        constraint: 'group_discussion_duration_non_negative_check_d99cb446',
        expression: 'duration >= 0',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'groupDiscussion',
        constraint: 'group_discussion_max_participants_positive_check_b7b64f10',
        expression: '"maxParticipants" > 0',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'groupDiscussion',
        constraint: 'group_discussion_valid_time_range_check_3308ff50',
        expression: '"endedAt" >= "startedAt"',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'groupParticipant',
        constraint: 'group_participant_valid_time_range_check_85679688',
        expression: '"leftAt" >= "joinedAt"',
      }),
      this.addUnique({
        schema: 'public',
        table: 'groupReservation',
        constraint: 'groupReservation_userId_groupDiscussionId_key',
        columns: ['userId', 'groupDiscussionId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'rating',
        constraint: 'rating_no_self_rating_check_0ea4c0dd',
        expression: '"reviewerId" <> "reviewedUserId"',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'rating',
        constraint: 'rating_rating_range_check_a517f074',
        expression: 'rating >= 1 AND rating <= 5',
      }),
      this.addUnique({
        schema: 'public',
        table: 'rating',
        constraint: 'rating_reviewerId_reviewedUserId_key',
        columns: ['reviewerId', 'reviewedUserId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_rating_range_check_4dac77a4',
        expression: 'rating >= 0 AND rating <= 5',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_total_ratings_non_negative_check_9b4f1fed',
        expression: '"totalRatings" >= 0',
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_agoraUid_key',
        columns: ['agoraUid'],
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
