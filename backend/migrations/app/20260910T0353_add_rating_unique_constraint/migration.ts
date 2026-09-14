#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/525466f9bf46efe87d92bef8b302f68a0117867febfed465781672227878e2d8/contract';
import endContract from '../../snapshots/525466f9bf46efe87d92bef8b302f68a0117867febfed465781672227878e2d8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract';
import startContract from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addUnique({
        schema: 'public',
        table: 'rating',
        constraint: 'rating_reviewerId_reviewedUserId_key',
        columns: ['reviewerId', 'reviewedUserId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
