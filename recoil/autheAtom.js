import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

export const autheAtom = atom({
  key: 'authentication',
  default: {
    isAuthenticated: false,
    user: {},
    accessToken: '',
  },
  effects_UNSTABLE: [persistAtom],
});
