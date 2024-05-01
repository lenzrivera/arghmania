import { Howl } from 'howler';

const CROSSFADE_DURATION = 350;
const FADE_DURATION = 700;

let currSong = new Howl({
  src: [''],
});

export const SongPlayer = Object.freeze({
  get currentSong() {
    return currSong;
  },

  get playing() {
    return currSong.playing();
  },

  /**
   * @param {string} audioURI
   */
  crossfade(audioURI) {
    const nextSong = new Howl({
      src: [audioURI],
      loop: true,
    });

    const handleNextSongLoad = () => {
      // Base case when no song is currently being played:
      if (!currSong.playing()) {
        currSong = nextSong;

        currSong.play();
        currSong.fade(0, 1, CROSSFADE_DURATION);

        return;
      }

      nextSong.play();

      currSong.fade(1, 0, CROSSFADE_DURATION);
      nextSong.fade(0, 1, CROSSFADE_DURATION);

      currSong = nextSong;
    };

    if (nextSong.state() === 'loaded') {
      handleNextSongLoad();
    } else {
      nextSong.once('load', handleNextSongLoad);
    }
  },

  /**
   * @param {string} audioURI
   */
  load(audioURI) {
    return new Promise(resolve => {
      currSong = new Howl({
        src: [audioURI],
      });

      if (currSong.state() === 'loaded') {
        return resolve();
      }

      currSong.once('load', resolve);
    });
  },

  pause() {
    return new Promise(resolve => {
      if (!this.playing) {
        return resolve();
      }

      currSong.once('fade', () => {
        currSong.pause();
        currSong.volume(1);

        resolve();
      });
      currSong.fade(1, 0, FADE_DURATION);
    });
  },

  pauseImmediately() {
    currSong.pause();
  },

  play() {
    return new Promise(resolve => {
      currSong.once('play', resolve);
      currSong.play();
    });
  },

  /**
   * @param {number} timestamp
   */
  seek(timestamp) {
    currSong.seek(timestamp / 1000);
  },
});
