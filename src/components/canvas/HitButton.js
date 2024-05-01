import { Assets, Sprite } from 'pixi.js';

import { lerp } from '../../util/interp';

const ANIM_DURATION = 30;
const PRESSED_SCALE = 0.8;

export class HitButton extends Sprite {
  static get RADIUS() {
    return Assets.get('hit_button').width / 2;
  }

  /**
   * @param {number} tint
   */
  constructor(tint) {
    super({
      texture: Assets.get('hit_button'),
      anchor: 0.5,
      tint,
    });

    /**
     * When a hit button was last pressed or released.
     * @type {?number}
     */
    this._activateTime = null;

    /**
     * Allows the update() method to know whether to animate getting pressed
     * or released from _activateTime.
     */
    this._isHeld = false;
  }

  /**
   * @param {number} elapsedTime
   */
  hold(elapsedTime) {
    this._activateTime = elapsedTime;
    this._isHeld = true;
  }

  /**
   * @param {number} elapsedTime
   */
  release(elapsedTime) {
    this._activateTime = elapsedTime;
    this._isHeld = false;
  }

  /**
   * @param {number} elapsedTime
   */
  update(elapsedTime) {
    if (this._activateTime === null) {
      this.scale.set(1);
      return;
    }

    const scale = this._isHeld
      ? Math.max(
          lerp(
            1,
            PRESSED_SCALE,
            this._activateTime,
            this._activateTime + ANIM_DURATION,
            elapsedTime,
          ),
          PRESSED_SCALE,
        )
      : Math.min(
          lerp(
            PRESSED_SCALE,
            1,
            this._activateTime,
            this._activateTime + ANIM_DURATION,
            elapsedTime,
          ),
          1,
        );

    this.scale.set(scale);
  }
}
