import { TrickNote } from '../beatmap/notes';

export class JudgeQueue {
  /**
   * @param {import('../beatmap/notes').Note[]} notes
   */
  constructor(notes) {
    /**
     * @type {import('../beatmap/notes').Note[][]}
     */
    this._queue = groupNotesByHitTime(notes);
  }

  get nextAtTime() {
    if (this._queue.length === 0) {
      return Number.POSITIVE_INFINITY;
    }

    return this._queue[0][0].atTime;
  }

  /**
   * @param {number} trackIndex
   */
  dequeue(trackIndex) {
    if (this._queue.length === 0) {
      throw new Error('Cannot dequeue empty JudgeQueue.');
    }

    const nextGroup = this._queue[0];
    const nextNoteIndex = nextGroup.findIndex(n => {
      if (n instanceof TrickNote) {
        return n.toTrack === trackIndex;
      }

      return n.track === trackIndex;
    });

    if (nextNoteIndex === -1) {
      return null;
    }

    const nextNote = nextGroup[nextNoteIndex];
    nextGroup.splice(nextNoteIndex, 1);

    if (nextGroup.length === 0) {
      this._queue.shift();
    }

    return nextNote;
  }

  /**
   * @returns {?import('../beatmap/notes').Note[]}
   */
  dequeueNextAll() {
    if (this._queue.length === 0) {
      throw new Error('Cannot dequeue empty JudgeQueue.');
    }

    return this._queue.shift();
  }
}

/**
 * This assumes the the notes are already sorted by hitTime.
 * @param {import('../beatmap/notes').Note[]} notes
 */
function groupNotesByHitTime(notes) {
  const queue = [];

  for (let i = 0; i < notes.length; ) {
    const timeGroup = [notes[i]];
    i += 1;

    while (i < notes.length && timeGroup[0].atTime === notes[i].atTime) {
      timeGroup.push(notes[i]);
      i += 1;
    }

    queue.push(timeGroup);
  }

  return queue;
}
