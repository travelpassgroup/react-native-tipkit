import { MMKV, Mode } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'tipkit',
  encryptionKey: 'tipkit-encryption-key',
  mode: Mode.MULTI_PROCESS,
});
