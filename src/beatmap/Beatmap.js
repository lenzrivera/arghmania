import { TIMING_HEIGHT } from '../components/ScrollerCanvas.svelte';

// TODO: Use a mix-in pattern to separate timing/spacing events from notes.

export class Beatmap {
  /**
   * @param {import('./BeatmapMetadata').BeatmapMetadata} metadata
   */
  constructor(metadata, notes, timingEvents, spacingEvents) {
    /**
     * @type {import('./BeatmapMetadata').BeatmapMetadata}
     */
    this._metadata = metadata;

    /**
     * @type {import('./notes').Note[]}
     */
    this._notes = notes;

    /**
     * @type {import('./events').TimingEvent[]}
     */
    this._timingEvents = timingEvents;

    /**
     * @type {import('./events').SpacingEvent[]}
     */
    this._spacingEvents = spacingEvents;
  }

  get meta() {
    return this._metadata;
  }

  get notes() {
    return this._notes;
  }

  get timingEvents() {
    return this._timingEvents;
  }

  get startTimestamp() {
    return -this._timingEvents[0].timePerMeasure;
  }

  get endTimestamp() {
    if (this._notes.length === 0) {
      return this._timingEvents.at(-1).timePerMeasure;
    }

    return this._notes.at(-1).atTime + this._timingEvents.at(-1).timePerMeasure;
  }

  /**
   * @param {number} atTime
   */
  getApproachRate(atTime) {
    const currAREvtIndex = getActiveTimedObjectIndex(
      this._spacingEvents,
      atTime,
    );
    return this._spacingEvents[currAREvtIndex].approachRate;
  }

  /**
   * @param {number} hitLineToTopDist
   */
  getInitialTimestamp(hitLineToTopDist) {
    // Beatmap playback should start before t = 0 when there is a note early
    // in the map that must be given more time to scroll down to the hit line
    // for the player to react.

    // noteVel is essentially ms/px, so we divide to get ms time for a note
    // to reach the hit line from the top line.
    const noteVel = this.getVelocity(this._notes[0].atTime);
    return Math.min(0, this._notes[0].atTime - hitLineToTopDist / noteVel);
  }

  /**
   * @param {number} atTime
   */
  getTimingEvent(atTime) {
    return this._timingEvents[this.getTimingEventIndex(atTime)];
  }

  /**
   * @param {number} atTime
   */
  getTimingEventIndex(atTime) {
    return getActiveTimedObjectIndex(this._timingEvents, atTime);
  }

  /**
   * @param {number} atTime
   */
  getVelocity(atTime) {
    const currTimingEvt = this._timingEvents[this.getTimingEventIndex(atTime)];
    const currAR = this.getApproachRate(atTime);

    return (TIMING_HEIGHT * currAR) / currTimingEvt.timePerMeasure;
  }
}

/**
 * @param {import('./objects').TimedObject[]} timedObjects
 * @param {number} atTime
 */
function getActiveTimedObjectIndex(timedObjects, atTime) {
  // if (atTime < timedObjects[0].atTime) {
  //   // TODO: Specific exception subclass?
  //   throw new Error('Time preceeds first timing event.');
  // }

  if (atTime < 0 || timedObjects.length === 1) {
    return 0;
  }

  for (let i = 1; i < timedObjects.length; i++) {
    const currObj = timedObjects[i];
    const prevObj = timedObjects[i - 1];

    // Period without transition:
    if (atTime >= prevObj.atTime && atTime < currObj.atTime) {
      return i - 1;
    }
  }

  // Time is after last event:
  return timedObjects.length - 1;
}
