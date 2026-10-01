import * as migration_20260930_235140_initial from './20260930_235140_initial'

export const migrations = [
  {
    up: migration_20260930_235140_initial.up,
    down: migration_20260930_235140_initial.down,
    name: '20260930_235140_initial',
  },
]
