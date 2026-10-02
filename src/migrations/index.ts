import * as migration_20260930_235140_initial from './20260930_235140_initial';
import * as migration_20261001_161241_imagens_vercel_blob from './20261001_161241_imagens_vercel_blob';
import * as migration_20261002_134058_contato_whatsapp from './20261002_134058_contato_whatsapp';
import * as migration_20261002_140150_ordem_feed from './20261002_140150_ordem_feed';
import * as migration_20261002_141521_formulario_contato from './20261002_141521_formulario_contato';
import * as migration_20261002_144740_como_eu_trabalho from './20261002_144740_como_eu_trabalho';
import * as migration_20261002_150425_instagram from './20261002_150425_instagram';
import * as migration_20261002_152720_tecnologias from './20261002_152720_tecnologias';
import * as migration_20261002_154200_recomendacoes from './20261002_154200_recomendacoes';
import * as migration_20261002_162615_curtidas from './20261002_162615_curtidas';
import * as migration_20261002_165054_visualizacoes from './20261002_165054_visualizacoes';

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
    name: '20261002_140150_ordem_feed',
  },
  {
    up: migration_20261002_141521_formulario_contato.up,
    down: migration_20261002_141521_formulario_contato.down,
    name: '20261002_141521_formulario_contato',
  },
  {
    up: migration_20261002_144740_como_eu_trabalho.up,
    down: migration_20261002_144740_como_eu_trabalho.down,
    name: '20261002_144740_como_eu_trabalho',
  },
  {
    up: migration_20261002_150425_instagram.up,
    down: migration_20261002_150425_instagram.down,
    name: '20261002_150425_instagram',
  },
  {
    up: migration_20261002_152720_tecnologias.up,
    down: migration_20261002_152720_tecnologias.down,
    name: '20261002_152720_tecnologias',
  },
  {
    up: migration_20261002_154200_recomendacoes.up,
    down: migration_20261002_154200_recomendacoes.down,
    name: '20261002_154200_recomendacoes',
  },
  {
    up: migration_20261002_162615_curtidas.up,
    down: migration_20261002_162615_curtidas.down,
    name: '20261002_162615_curtidas',
  },
  {
    up: migration_20261002_165054_visualizacoes.up,
    down: migration_20261002_165054_visualizacoes.down,
    name: '20261002_165054_visualizacoes'
  },
];
