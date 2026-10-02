import * as migration_20260930_235140_initial from './20260930_235140_initial';
import * as migration_20261001_161241_imagens_vercel_blob from './20261001_161241_imagens_vercel_blob';
import * as migration_20261002_134058_contato_whatsapp from './20261002_134058_contato_whatsapp';
import * as migration_20261002_140150_ordem_feed from './20261002_140150_ordem_feed';

export const migrations = [
  {
    up: migration_20260930_235140_initial.up,
    down: migration_20260930_235140_initial.down,
    name: '20260930_235140_initial',
  },
  {
    up: migration_20261001_161241_imagens_vercel_blob.up,
    down: migration_20261001_161241_imagens_vercel_blob.down,
    name: '20261001_161241_imagens_vercel_blob',
  },
  {
    up: migration_20261002_134058_contato_whatsapp.up,
    down: migration_20261002_134058_contato_whatsapp.down,
    name: '20261002_134058_contato_whatsapp',
  },
  {
    up: migration_20261002_140150_ordem_feed.up,
    down: migration_20261002_140150_ordem_feed.down,
    name: '20261002_140150_ordem_feed'
  },
];
