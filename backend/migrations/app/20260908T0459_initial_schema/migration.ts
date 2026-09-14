#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract';
import endContract from '../../snapshots/95a5723d62f4382579eb1d16da83e4a848157e99cd0775a87e2e970a3e6c77b3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
