export class NoteHitInfo {
  constructor(note) {
    this._note = note;

    /**
     * @type {?number}
     */
    this.holdTime = null;

    /**
     * @type {?number}
     */
    this.releaseTime = null;

    /**
     * @type {?string}
     */
    this.judgement = null;
  }

  get note() {
    return this._note;
  }

  get holdDuration() {
    return this.releaseTime - this.holdTime;
  }

  /**
   * @param {number} timestamp
   */
  hasBeenHeldBy(timestamp) {
    return this.holdTime !== null && timestamp >= this.holdTime;
  }

  /**
   * @param {number} timestamp
   */
  hasBeenReleasedBy(timestamp) {
    return this.releaseTime !== null && timestamp >= this.releaseTime;
  }
}
