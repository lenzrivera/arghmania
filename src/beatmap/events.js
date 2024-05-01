import { MovingObject, TimedObject } from './objects';

export class Line extends MovingObject {
  constructor(atTime, velocity) {
    super(atTime, velocity);
  }
}

export class TimingEvent extends TimedObject {
  constructor(atTime, bpmi, bpme) {
    super(atTime);

    this.beatsPerMinute = bpmi;
    this.beatsPerMeasure = bpme;
  }

  get timePerBeat() {
    // return Math.round(60000 / this.beatsPerMinute);
    return 60000 / this.beatsPerMinute;
  }

  get timePerMeasure() {
    // return Math.round(this.timePerBeat * this.beatsPerMeasure);
    return this.timePerBeat * this.beatsPerMeasure;
  }
}

export class SpacingEvent extends TimedObject {
  constructor(atTime, ar) {
    super(atTime);

    this.approachRate = ar;
  }
}
