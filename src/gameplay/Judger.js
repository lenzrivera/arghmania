import EventEmitter from 'eventemitter3';

import { HoldNote } from '../beatmap/notes';
import { JudgeQueue } from './JudgeQueue';

/**
 * Contains the upper bounds (inclusive) of each judgement.
 */
export const HitWindows = Object.freeze({
  PERFECT_UB: 60,
  GOOD_UB: 140,
  OK_UB: 160,
  MISS_UB: 180,
});

export class Judger extends EventEmitter {
  /**
   * @param {import('../beatmap/Beatmap').Beatmap} beatmap
   */
  constructor(beatmap) {
    super();

    /**
     * @type {import('../beatmap/Beatmap').Beatmap}
     */
    this._beatmap = beatmap;

    /**
     * @type {number}
     */
    this._elapsedTime = 0;

    /**
     * @type {JudgeQueue}
     */
    this._noteQueue = new JudgeQueue(beatmap._notes);

    /**
     * @type {HoldNoteJudgeInfo[]}
     */
    this._heldNotes = [];
  }

  /**
   * @param {number} trackIndex
   */
  holdKey(trackIndex) {
    if (!this._hasJudgableNoteAt(this._noteQueue.nextAtTime)) {
      return;
    }

    const noteToJudge = this._noteQueue.dequeue(trackIndex);

    if (!noteToJudge) {
      return;
    }

    if (noteToJudge instanceof HoldNote) {
      this._queueHoldNote(noteToJudge);
    } else {
      this._judgeHitOrTrickNote(noteToJudge);
    }

    this.emit('judgedhold', noteToJudge.index, this._elapsedTime);
  }

  /**
   * @param {number} trackIndex
   */
  releaseKey(trackIndex) {
    for (const [i, judgeInfo] of this._heldNotes.entries()) {
      const noteToJudge = judgeInfo.note;

      if (noteToJudge.track !== trackIndex) {
        continue;
      }

      this._judgeQueuedHoldNote(this._heldNotes[i]);
      this._heldNotes.splice(i, 1);

      this.emit('judgedrelease', noteToJudge.index, this._elapsedTime);
    }
  }

  /**
   * @param {number} elapsedTime
   */
  update(elapsedTime) {
    this._elapsedTime = elapsedTime;

    this._judgeNoLongerHittableNotes();
    this._tickHeldNoteCombos();
  }

  /**
   * @param {HoldNote} note
   */
  _computeHoldNoteTickInterval(note) {
    return this._beatmap.getTimingEvent(note.atTime).timePerBeat;
  }

  /**
   * @param {number} timestamp
   */
  _hasJudgableNoteAt(timestamp) {
    return this._elapsedTime >= timestamp - HitWindows.MISS_UB;
  }

  /**
   * @param {number} timestamp
   */
  _nextNoteNoLongerJudgableAt(timestamp) {
    return this._elapsedTime > timestamp + HitWindows.OK_UB;
  }

  /**
   * @param {import('../beatmap/notes').HitNote|import('../beatmap/notes').HoldNote} note
   */
  _judgeHitOrTrickNote(note) {
    const timeDiff = this._elapsedTime - note.atTime;
    const absTimeDiff = Math.abs(timeDiff);

    let judgement = 'miss';

    if (absTimeDiff <= HitWindows.PERFECT_UB) {
      judgement = 'perfect';
    } else if (absTimeDiff <= HitWindows.GOOD_UB) {
      judgement = 'good';
    } else if (absTimeDiff <= HitWindows.OK_UB) {
      judgement = 'ok';
    }

    // Combo processing MUST go first since judgement depends on it.
    if (judgement !== 'miss') {
      this.emit('judgedcombo');
    }

    this.emit('judgement', note.index, judgement, timeDiff);
  }

  /**
   * @param {HoldNote} note
   */
  _queueHoldNote(note) {
    const timeDiff = this._elapsedTime - note.atTime;

    if (
      Math.abs(timeDiff) >= HitWindows.OK_UB &&
      Math.abs(timeDiff) <= HitWindows.MISS_UB
    ) {
      this.emit('judgement', note.index, 'miss', timeDiff);
      this.emit('judgedrelease', note.index, this._elapsedTime);
      return;
    }

    const judgeInfo = new HoldNoteJudgeInfo(note, this._elapsedTime);
    this._heldNotes.push(judgeInfo);

    this.emit('judgedcombo');
  }

  _tickHeldNoteCombos() {
    for (const judgeInfo of this._heldNotes) {
      const ti = this._computeHoldNoteTickInterval(judgeInfo.note);
      const comboToAdd = Math.floor(
        (this._elapsedTime - judgeInfo.lastTickTime) / ti,
      );

      for (let i = 0; i < comboToAdd; i++) {
        this.emit('judgedcombo');
        judgeInfo.lastTickTime += ti;
      }
    }
  }

  /**
   * Excludes cases where the hold note was held for too long.
   * @param {HoldNoteJudgeInfo} judgeInfo
   */
  _judgeQueuedHoldNote(judgeInfo) {
    const note = judgeInfo.note;
    const holdTime = judgeInfo.holdTime;
    const releaseTime = this._elapsedTime;

    const holdTimeDiff = holdTime - note.atTime;
    const releaseTimeDiff = releaseTime - note.untilTime;
    const absHoldTimeDiff = Math.abs(holdTimeDiff);
    const absReleaseTimeDiff = Math.abs(releaseTimeDiff);

    const timeDiff = Math.max(absHoldTimeDiff, absReleaseTimeDiff);
    const signedTimeDiff =
      absHoldTimeDiff > absReleaseTimeDiff ? holdTimeDiff : releaseTimeDiff;

    let judgement = 'miss';

    if (timeDiff <= HitWindows.PERFECT_UB) {
      judgement = 'perfect';
    } else if (timeDiff <= HitWindows.GOOD_UB) {
      judgement = 'good';
    } else if (timeDiff <= HitWindows.OK_UB) {
      judgement = 'ok';
    }

    this.emit('judgement', judgeInfo.note.index, judgement, signedTimeDiff);
  }

  _judgeNoLongerHittableNotes() {
    // For notes that are no longer hit/holdable:
    while (this._nextNoteNoLongerJudgableAt(this._noteQueue.nextAtTime)) {
      const notes = this._noteQueue.dequeueNextAll();

      for (const note of notes) {
        this.emit('judgement', note.index, 'miss');
      }
    }

    // For hold notes that are held too long:
    for (const [i, judgeInfo] of this._heldNotes.entries()) {
      const noteToJudge = judgeInfo.note;

      if (this._elapsedTime > noteToJudge.untilTime + HitWindows.MISS_UB) {
        this.emit(
          'judgement',
          noteToJudge.index,
          'ok',
          this._elapsedTime - noteToJudge.untilTime,
        );
        this.emit('judgedrelease', noteToJudge.index, this._elapsedTime);

        this._heldNotes.splice(i, 1);
      }
    }
  }
}

class HoldNoteJudgeInfo {
  /**
   * @param {import('../beatmap/notes').HoldNote} note
   * @param {number} holdTime
   */
  constructor(note, holdTime) {
    /**
     * @type {import('../beatmap/notes').HoldNote}
     */
    this._note = note;

    /**
     * @type {number}
     */
    this._holdTime = holdTime;

    /**
     * @type {number}
     */
    this.lastTickTime = this._note.atTime;
  }

  get holdTime() {
    return this._holdTime;
  }

  get note() {
    return this._note;
  }
}
