#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7d952ef4cc940f8304a324e5f1e5cff04b74de041fdd59550da15b714b2b634b/contract';
import endContract from '../../snapshots/7d952ef4cc940f8304a324e5f1e5cff04b74de041fdd59550da15b714b2b634b/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: "public" }),
      this.createTable({
        schema: "public",
        table: "conversation",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("duration", "int4", { codecRef: { codecId: "pg/int4@1" } }),
          col("endedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("startedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("status", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("topicId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("user1Id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("user2Id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "conversation_status_check_1f356f23",
            "\"status\" IN ('WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED')",
          ),
          checkExpression(
            "conversation_different_users_check",
            '"user1Id" <> "user2Id"',
          ),
        ],
      }),
      this.createTable({
        schema: "public",
        table: "groupDiscussion",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("duration", "int4", { codecRef: { codecId: "pg/int4@1" } }),
          col("endedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("maxParticipants", "int4", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("startedAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("status", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("topicId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("updatedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "groupDiscussion_status_check_1f356f23",
            "\"status\" IN ('WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED')",
          ),
          checkExpression(
            "max_participants_positive_check",
            '"maxParticipants" > 0',
          ),
        ],
      }),
      this.createTable({
        schema: "public",
        table: "groupParticipant",
        columns: [
          col("groupDiscussionId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("joinedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("leftAt", "timestamptz", {
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("userId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
        ],
        constraints: [primaryKey(["id"])],
      }),
      this.createTable({
        schema: "public",
        table: "rating",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("rating", "int4", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("reviewedUserId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("reviewerId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "rating_value_check",
            '"rating" >= 1 AND "rating" <= 5',
          ),
        ],
      }),
      this.createTable({
        schema: "public",
        table: "topic",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("description", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("title", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("updatedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
        ],
        constraints: [primaryKey(["id"])],
      }),
      this.createTable({
        schema: "public",
        table: "user",
        columns: [
          col("bio", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("email", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("interests", "text[]", {
            notNull: true,
            codecRef: { codecId: "pg/text@1", many: true },
          }),
          col("isDeleted", "bool", {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: "pg/bool@1" },
          }),
          col("isEmailVerified", "bool", {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: "pg/bool@1" },
          }),
          col("languageProficiency", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("name", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("password", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("rating", "float8", {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: "pg/float8@1" },
          }),
          col("totalRatings", "int4", {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("updatedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("username", "text", { codecRef: { codecId: "pg/text@1" } }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "user_interests_elem_not_null_4b23e016",
            'array_position("interests", NULL) IS NULL',
          ),
          checkExpression(
            "user_languageProficiency_check_9f8a2a3d",
            "\"languageProficiency\" IN ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'PROFICIENT')",
          ),
        ],
      }),
      this.addUnique({
        schema: "public",
        table: "groupParticipant",
        constraint: "groupParticipant_userId_groupDiscussionId_key",
        columns: ["userId", "groupDiscussionId"],
      }),
      this.addUnique({
        schema: "public",
        table: "user",
        constraint: "user_email_key",
        columns: ["email"],
      }),
      this.addUnique({
        schema: "public",
        table: "user",
        constraint: "user_username_key",
        columns: ["username"],
      }),
      this.createIndex({
        schema: "public",
        table: "conversation",
        index: "conversation_status_idx_e98638ab",
        columns: ["status"],
      }),
      this.createIndex({
        schema: "public",
        table: "conversation",
        index: "conversation_topicId_idx_6f05808f",
        columns: ["topicId"],
      }),
      this.createIndex({
        schema: "public",
        table: "conversation",
        index: "conversation_user1Id_idx_db150192",
        columns: ["user1Id"],
      }),
      this.createIndex({
        schema: "public",
        table: "conversation",
        index: "conversation_user2Id_idx_d408a8bd",
        columns: ["user2Id"],
      }),
      this.createIndex({
        schema: "public",
        table: "groupDiscussion",
        index: "groupDiscussion_status_idx_e98638ab",
        columns: ["status"],
      }),
      this.createIndex({
        schema: "public",
        table: "groupDiscussion",
        index: "groupDiscussion_topicId_idx_6f05808f",
        columns: ["topicId"],
      }),
      this.createIndex({
        schema: "public",
        table: "groupParticipant",
        index: "groupParticipant_groupDiscussionId_idx_772d1f81",
        columns: ["groupDiscussionId"],
      }),
      this.createIndex({
        schema: "public",
        table: "groupParticipant",
        index: "groupParticipant_userId_idx_a489d58a",
        columns: ["userId"],
      }),
      this.createIndex({
        schema: "public",
        table: "rating",
        index: "rating_reviewedUserId_idx_ad1640bd",
        columns: ["reviewedUserId"],
      }),
      this.createIndex({
        schema: "public",
        table: "rating",
        index: "rating_reviewerId_idx_25a27b4e",
        columns: ["reviewerId"],
      }),
      this.addForeignKey({
        schema: "public",
        table: "conversation",
        foreignKey: {
          name: "conversation_topicId_fkey",
          columns: ["topicId"],
          references: { schema: "public", table: "topic", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "conversation",
        foreignKey: {
          name: "conversation_user1Id_fkey",
          columns: ["user1Id"],
          references: { schema: "public", table: "user", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "conversation",
        foreignKey: {
          name: "conversation_user2Id_fkey",
          columns: ["user2Id"],
          references: { schema: "public", table: "user", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "groupDiscussion",
        foreignKey: {
          name: "groupDiscussion_topicId_fkey",
          columns: ["topicId"],
          references: { schema: "public", table: "topic", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "groupParticipant",
        foreignKey: {
          name: "groupParticipant_userId_fkey",
          columns: ["userId"],
          references: { schema: "public", table: "user", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "groupParticipant",
        foreignKey: {
          name: "groupParticipant_groupDiscussionId_fkey",
          columns: ["groupDiscussionId"],
          references: {
            schema: "public",
            table: "groupDiscussion",
            columns: ["id"],
          },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "rating",
        foreignKey: {
          name: "rating_reviewerId_fkey",
          columns: ["reviewerId"],
          references: { schema: "public", table: "user", columns: ["id"] },
        },
      }),
      this.addForeignKey({
        schema: "public",
        table: "rating",
        foreignKey: {
          name: "rating_reviewedUserId_fkey",
          columns: ["reviewedUserId"],
          references: { schema: "public", table: "user", columns: ["id"] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
