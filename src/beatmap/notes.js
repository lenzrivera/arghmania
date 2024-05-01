import { TIMING_HEIGHT } from '../components/ScrollerCanvas.svelte';
import { MovingObject } from './objects';

/**
 * @abstract
 */
export class Note extends MovingObject {
  constructor(index, atTime, velocity, track) {
    super(atTime, velocity);

    this.index = index;
    this.track = track;
  }
}

export class HitNote extends Note {}

export class HoldNote extends Note {
  constructor(index, atTime, untilTime, velocity, track) {
    super(index, atTime, velocity, track);

    this.untilTime = untilTime;
  }

  get duration() {
    return this.untilTime - this.atTime;
  }
}

export class TrickNote extends Note {
  constructor(index, atTime, velocity, track, toTrack) {
    super(index, atTime, velocity, track);

    this.toTrack = toTrack;
  }

  get switchStartTime() {
    // TODO
    return this.atTime - (TIMING_HEIGHT * 0.65) / this.velocity;
  }

  get switchEndTime() {
    // TODO
    return this.atTime - (TIMING_HEIGHT * 0.25) / this.velocity;
  }
}
