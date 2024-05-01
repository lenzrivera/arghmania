import { Assets, Sprite } from 'pixi.js';

import { lerp } from '../../util/interp';

const FADE_DURATION = 75;
const TEXT_SCALE = 0.55;

export class JudgementText extends Sprite {
  constructor() {
    super({
      anchor: 0.5,
      scale: TEXT_SCALE,
    });

    /**
     * @type {number}
     */
    this._elapsedTime = 0;

    /**
     * @type {number}
     */
    this._lastFlashTimestamp = 0;
  }

  flashPerfect() {
    this.texture = Assets.get('judgement_text_great');
    this._lastFlashTimestamp = this._elapsedTime;
  }

  flashGood() {
    this.texture = Assets.get('judgement_text_good');
    this._lastFlashTimestamp = this._elapsedTime;
  }

  flashOk() {
    this.texture = Assets.get('judgement_text_ok');
    this._lastFlashTimestamp = this._elapsedTime;
  }

  flashMiss() {
    this.texture = Assets.get('judgement_text_miss');
    this._lastFlashTimestamp = this._elapsedTime;
  }

  /**
   * @param {number} elapsedTime
   */
  update(elapsedTime) {
    this._elapsedTime = elapsedTime;

    this.alpha = Math.min(
      lerp(
        0,
        1,
        this._lastFlashTimestamp,
        this._lastFlashTimestamp + FADE_DURATION,
        this._elapsedTime,
      ),
      1,
    );

    this.scale = Math.min(
      lerp(
        0.2,
        TEXT_SCALE,
        this._lastFlashTimestamp,
        this._lastFlashTimestamp + FADE_DURATION * 1.5,
        this._elapsedTime,
      ),
      TEXT_SCALE,
    );
  }
}
