import * as migration_20260930_235140_initial from './20260930_235140_initial';
import * as migration_20261001_161241_imagens_vercel_blob from './20261001_161241_imagens_vercel_blob';

export const migrations = [
  {
    up: migration_20260930_235140_initial.up,
    down: migration_20260930_235140_initial.down,
    name: '20260930_235140_initial',
  },
  {
    up: migration_20261001_161241_imagens_vercel_blob.up,
    down: migration_20261001_161241_imagens_vercel_blob.down,
    name: '20261001_161241_imagens_vercel_blob'
  },
];
