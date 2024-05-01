import { Howl } from 'howler';

// @ts-ignore
import don_wav from '../assets/sfx/don.wav';
// @ts-ignore
import ka_wav from '../assets/sfx/ka.wav';

const primaryHitSound = new Howl({
  src: [don_wav],
  volume: 0.3,
});

const secondaryHitSound = new Howl({
  src: [ka_wav],
  volume: 0.15,
});

export const SfxPlayer = {
  playPrimaryHitSound() {
    primaryHitSound.play();
  },

  playSecondaryHitSound() {
    secondaryHitSound.play();
  },
};
