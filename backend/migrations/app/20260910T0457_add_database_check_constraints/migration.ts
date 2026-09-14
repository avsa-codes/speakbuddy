#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/525466f9bf46efe87d92bef8b302f68a0117867febfed465781672227878e2d8/contract';
import startContract from '../../snapshots/525466f9bf46efe87d92bef8b302f68a0117867febfed465781672227878e2d8/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/6939203e0973f1a0c6199a936bb1bab3d9bd27d4a64486cc5cce620ede802c25/contract';
import endContract from '../../snapshots/6939203e0973f1a0c6199a936bb1bab3d9bd27d4a64486cc5cce620ede802c25/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
