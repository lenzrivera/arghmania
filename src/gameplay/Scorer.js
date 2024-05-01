import EventEmitter from 'eventemitter3';
import { stdev } from 'stats-lite';
import { readable } from 'svelte/store';

const MAX_SCORE = 1000000;

export class Scorer extends EventEmitter {
  /**
   * @param {number} noteCount
   */
  constructor(noteCount) {
    super();

    /**
     * The score difference to apply for each perfect note judgement. Getting all
     * note judgements perfect would yield the maximum score.
     * @type {number}
     */
    this._deltaScore = MAX_SCORE / noteCount;

    /**
     * @type {number}
     */
    this._maxPossibleCombo = noteCount;

    /**
     * @type {number[]}
     */
    this._timeDiffs = [];

    /**
     * @type {number}
     */
    this._combo = 0;

    /**
     * @type {number}
     */
    this._score = 0;

    /**
     * @type {number}
     */
    this._maxCombo = 0;

    /**
     * Maximum possible combo at the current time (this includes hold note tick
     * combos).
     * @type {number}
     */
    this._judgedCombo = 0;

    /**
     * @type {number}
     */
    this._numPerfect = 0;

    /**
     * @type {number}
     */
    this._numMissed = 0;

    /**
     * @type {number}
     */
    this._numGood = 0;

    /**
     * @type {number}
     */
    this._numOk = 0;
  }

  get accuracy() {
    const numJudgedNotes =
      this._numPerfect + this._numGood + this._numOk + this._numMissed;

    if (numJudgedNotes === 0) {
      return 100;
    }

    const wPerfect = 300 * this._numPerfect;
    const wGood = 100 * this._numGood;
    const wOk = 50 * this._numOk;

    return 100 * ((wPerfect + wGood + wOk) / (300 * numJudgedNotes));
  }

  get combo() {
    return this._combo;
  }

  get maxCombo() {
    return this._maxCombo;
  }

  get missCount() {
    return this._numMissed;
  }

  get score() {
    return this._score;
  }

  get unstableRate() {
    return stdev(this._timeDiffs) || 0;
  }

  considerCombo() {
    this._judgedCombo += 1;

    this._combo += 1;
    this._maxCombo = Math.max(this._combo, this._maxCombo);

    this.emit('statsupdate');
  }

  /**
   * @param {'perfect'|'good'|'ok'|'miss'} judgement
   * @param {number} timeDiff
   */
  considerJudgement(judgement, timeDiff) {
    this._timeDiffs.push(timeDiff);

    const comboWeight = this._combo / (this._judgedCombo || 1);

    switch (judgement) {
      case 'perfect':
        this._numPerfect += 1;
        this._score += (300 / 300) * comboWeight * this._deltaScore;
        break;

      case 'good':
        this._numGood += 1;
        this._score += (100 / 300) * comboWeight * this._deltaScore;
        break;

      case 'ok':
        this._numOk += 1;
        this._score += (50 / 300) * comboWeight * this._deltaScore;
        break;

      case 'miss':
        this._combo = 0;
        this._numMissed += 1;
        break;
    }

    this.emit('statsupdate');
  }
}

/**
 * @param {number} maxPossibleCombo
 * @returns {[Scorer, import('svelte/store').Readable<object>]}
 */
export function createScorer(maxPossibleCombo) {
  const scorer = new Scorer(maxPossibleCombo);

  const stats = readable(
    {
      score: scorer.score,
      accuracy: scorer.accuracy,
      combo: scorer.combo,
      maxCombo: scorer.maxCombo,
      misses: scorer.missCount,
      unstableRate: scorer.unstableRate,
    },
    set => {
      function handleUpdate() {
        set({
          score: scorer.score,
          accuracy: scorer.accuracy,
          combo: scorer.combo,
          maxCombo: scorer.maxCombo,
          misses: scorer.missCount,
          unstableRate: scorer.unstableRate,
        });
      }

      scorer.on('statsupdate', handleUpdate);
      return () => scorer.off('statupdate', handleUpdate);
    },
  );

  return [scorer, stats];
}
