#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1eac60839d8bf480c5d6069398f890139c9f491ab549accd9d47ceed0692c87d/contract';
import endContract from '../../snapshots/1eac60839d8bf480c5d6069398f890139c9f491ab549accd9d47ceed0692c87d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/308a21fa409ef92c5fbd783fe118bfe505d11b3c9fd3dc09cb9fafdf4b883ff0/contract';
import startContract from '../../snapshots/308a21fa409ef92c5fbd783fe118bfe505d11b3c9fd3dc09cb9fafdf4b883ff0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('agoraUid', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_agoraUid_key',
        columns: ['agoraUid'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
