import { Container, Graphics } from 'pixi.js';
import { BASE_WIDTH } from '../ScrollerCanvas.svelte';

// A note on the canvas coordinate system:
// y = 0 -> hit line
// y < 0 -> going up from hit line
// y > 0 -> going down from hit line

const LINE_GRAPHICS = new Graphics()
  .roundRect(0, 0, BASE_WIDTH, 7, 5)
  .fill(0xe8e8e8);
const NON_MEASURE_LINE_SCALE = 0.25;

export class LineRenderer extends Container {
  /**
   * @param {import('../../beatmap/Beatmap').Beatmap} beatmap
   */
  constructor(beatmap) {
    super({
      alpha: 0.39,
      blendMode: 'overlay',
    });

    /**
     * @type {number}
     */
    this.elapsedTime = 0;

    /**
     * @type {number}
     */
    this.hitLineToTopDist = 0;

    /**
     * @type {number}
     */
    this.hitLineToBottomDist = 0;

    /**
     * @type {import('../../beatmap/Beatmap').Beatmap}
     */
    this.beatmap = beatmap;

    /**
     * @type {number}
     */
    this._measureDivision = 1;
  }

  get measureDivision() {
    return this._measureDivision;
  }

  set measureDivision(v) {
    if (Math.log2(v) % 1 !== 0) {
      throw new Error('Measure division must be a power of 2.');
    }

    this._measureDivision = v;
  }

  update() {
    // TODO: Reuse line sprites when possible.
    this.removeChildren();

    for (const line of this._getVisibleLines()) {
      const { atTime, isMeasure, velocity } = line;

      const lineSprite = LINE_GRAPHICS.clone(true);
      lineSprite.scale.y = isMeasure ? 1 : NON_MEASURE_LINE_SCALE;
      lineSprite.pivot.y = lineSprite.height / 2;
      lineSprite.y = velocity * (this.elapsedTime - atTime);

      this.addChild(lineSprite);
    }
  }

  getPreviousLineTime() {
    const currTimingEvtIndex = this.beatmap.getTimingEventIndex(
      this.elapsedTime,
    );
    const currTimingEvt = this.beatmap.timingEvents[currTimingEvtIndex];

    // TODO: AVERT YOUR EYES HAHA. This assumes the use case in EditorView.
    // This will break otherwise >:) Needs refactoring to be less state-ful.
    const orig = this.elapsedTime;

    this.elapsedTime = this.elapsedTime - currTimingEvt.timePerMeasure;
    let prev = this.elapsedTime;

    while (true) {
      prev = Math.max(this.elapsedTime, this.beatmap.startTimestamp);
      this.elapsedTime = this.getNextLineTime();

      if (this.elapsedTime >= orig) {
        this.elapsedTime = prev;
        return prev;
      }
    }
  }

  getNextLineTime() {
    let currTimingEvtIndex = this.beatmap.getTimingEventIndex(this.elapsedTime);
    let currTimingEvt = this.beatmap.timingEvents[currTimingEvtIndex];

    let prevMeasureTime = Math.max(
      nearestPriorMultiple(
        currTimingEvt.timePerMeasure,
        currTimingEvt.atTime,
        this.elapsedTime,
      ),
      this.beatmap.timingEvents[0].atTime,
    );
    let currLineTime = prevMeasureTime;
    let currBeat = 0;

    while (true) {
      if (Math.round(currLineTime) > Math.round(this.elapsedTime)) {
        return currLineTime;
      }

      const interval = currTimingEvt.timePerBeat * (4 / this._measureDivision);
      const assumedNextLineTime = Math.min(
        currLineTime + interval,
        prevMeasureTime + currTimingEvt.timePerMeasure,
      );

      const nextTimingEvtIndex =
        this.beatmap.getTimingEventIndex(assumedNextLineTime);

      if (nextTimingEvtIndex !== currTimingEvtIndex) {
        const nextTimingEvt = this.beatmap.timingEvents[nextTimingEvtIndex];
        currTimingEvtIndex = nextTimingEvtIndex;
        currTimingEvt = nextTimingEvt;
        currLineTime = nextTimingEvt.atTime;
        currBeat = 0;
      } else {
        currLineTime = assumedNextLineTime;
        currBeat =
          (currBeat + 1) %
          Math.ceil(
            currTimingEvt.beatsPerMeasure * (this._measureDivision / 4),
          );
      }

      if (currBeat === 0) {
        prevMeasureTime = currLineTime;
      }
    }
  }

  *_getVisibleLines() {
    for (const evtIndex of this.beatmap.timingEvents.keys()) {
      if (this._timingEventNotInDisplayBounds(evtIndex)) {
        continue;
      }

      const startLineTime = this._getEarliestMeasureLineTime(evtIndex);
      yield* this._getVisibleLinesForTimingEvent(evtIndex, startLineTime);
    }
  }

  /**
   * @param {number} timingEvtIndex
   */
  _timingEventNotInDisplayBounds(timingEvtIndex) {
    const timingEvt = this.beatmap.timingEvents[timingEvtIndex];

    if (this._getAssumedLineY(timingEvt.atTime) < -this.hitLineToTopDist) {
      return true;
    }

    const nextEvtIndex = timingEvtIndex + 1;

    if (nextEvtIndex === this.beatmap.timingEvents.length) {
      return false;
    }

    const nextEvt = this.beatmap.timingEvents[nextEvtIndex];
    return this._getAssumedLineY(nextEvt.atTime) > this.hitLineToBottomDist;
  }

  /**
   * @param {number} lineAtTime
   */
  _getAssumedLineY(lineAtTime) {
    const objVelocity = this.beatmap.getVelocity(lineAtTime);
    return objVelocity * (this.elapsedTime - lineAtTime);
  }

  /**
   * @param {number} timingEvtIndex
   */
  _getEarliestMeasureLineTime(timingEvtIndex) {
    const timingEvt = this.beatmap.timingEvents[timingEvtIndex];
    const velocity = this.beatmap.getVelocity(this.elapsedTime);

    const lineAtBottomBorderTime =
      this.hitLineToBottomDist / velocity + this.elapsedTime;

    // Subtract by time per measure to handle cases where a new timing event
    // is at the same time as the final line of the previous timing event.
    // Otherwise, the previous timing event lines may no longer be rendered
    // prematurely.
    const priorMeasureLineTime =
      nearestPriorMultiple(
        timingEvt.timePerMeasure,
        timingEvt.atTime,
        lineAtBottomBorderTime,
      ) - timingEvt.timePerMeasure;

    return Math.max(priorMeasureLineTime, timingEvt.atTime);
  }

  /**
   * @param {number} timingEvtIndex
   * @param {number} startLineTime
   */
  *_getVisibleLinesForTimingEvent(timingEvtIndex, startLineTime) {
    const currTimingEvt = this.beatmap.timingEvents[timingEvtIndex];

    const nextTimingEvtIndex = timingEvtIndex + 1;
    const nextTimingEvt = this.beatmap.timingEvents[nextTimingEvtIndex];

    let currLineTime = startLineTime;
    let currBeat = 0;

    let prevMeasureTime = currLineTime;

    while (true) {
      if (nextTimingEvt && Math.round(currLineTime) >= nextTimingEvt.atTime) {
        break;
      }

      const currVel = this.beatmap.getVelocity(currLineTime);
      const linePos = currVel * (this.elapsedTime - currLineTime);

      if (linePos < -this.hitLineToTopDist) {
        break;
      }

      yield {
        atTime: currLineTime,
        velocity: currVel,
        isMeasure: currBeat === 0,
      };

      // const prevMeasureTime = nearestPriorMultiple(
      //   timeToTicks(currTimingEvt.timePerMeasure),
      //   timeToTicks(currTimingEvt.atTime),
      //   currLineTime,
      // );

      const interval = currTimingEvt.timePerBeat * (4 / this._measureDivision);
      const assumedNextLineTime = Math.min(
        currLineTime + interval,
        prevMeasureTime + currTimingEvt.timePerMeasure,
      );

      currLineTime = assumedNextLineTime;
      currBeat =
        (currBeat + 1) %
        Math.ceil(currTimingEvt.beatsPerMeasure * (this._measureDivision / 4));

      if (currBeat === 0) {
        prevMeasureTime = currLineTime;
      }
    }
  }
}

/**
 * @param {number} multiple
 * @param {number} start
 * @param {number} value
 */
function nearestPriorMultiple(multiple, start, value) {
  return Math.floor((value - start) / multiple) * multiple + start;
}
