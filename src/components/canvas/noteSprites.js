import { Assets, Container, Graphics, Sprite } from 'pixi.js';

import { lerp } from '../../util/interp';

const ANIM_DURATION = 200;

// TODO: Perhaps use blend modes instead of color-hardcoded textures (needs

export class HitNoteSprite extends Sprite {
  /**
   * @param {boolean} isVariation0 `false` assumes variation 1.
   */
  constructor(isVariation0) {
    super({
      texture: Assets.get(isVariation0 ? 'note_head_0' : 'note_head_1'),
      anchor: 0.5,
    });
  }

  /**
   * @param {number} hitTime
   * @param {number} elapsedTime
   */
  playHitAnimation(hitTime, elapsedTime) {
    this.alpha = lerp(1, 0, hitTime, hitTime + ANIM_DURATION, elapsedTime);
    this.scale.set(lerp(1, 3, hitTime, hitTime + 250, elapsedTime));
  }
}

export class HoldNoteSprite extends Container {
  /**
   * @param {boolean} isVariation0 `false` assumes variation 1.
   */
  constructor(isVariation0) {
    super();

    this._head = new Sprite({
      texture: Assets.get(isVariation0 ? 'note_head_0' : 'note_head_1'),
      anchor: 0.5,
    });

    this._tail = new Sprite({
      texture: Assets.get(
        isVariation0 ? 'hold_note_tail_0' : 'hold_note_tail_1',
      ),
      anchor: { x: 0.5, y: 1 },
    });

    this._tailMaskBody = new Graphics({ scale: -1 })
      .rect(-this._tail.width / 2, 0, this._tail.width, this._tail.height)
      .fill(0xff0000);

    this._tailMaskEnd = new Graphics()
      .circle(0, 0, this._tail.width / 2)
      .fill(0x00ff00);

    this._tailMask = new Container();
    this._tailMask.addChild(this._tailMaskBody);
    this._tailMask.addChild(this._tailMaskEnd);
    this._tail.mask = this._tailMask;

    // Set the mask dimensions based on the default tail height by default.
    this.tailLength = this._tail.height;

    this.addChild(this._tail);
    this.addChild(this._head);
    this.addChild(this._tailMask);
  }

  get tailLength() {
    return this._tail.height - this._tail.width;
  }

  set tailLength(v) {
    this._tail.height = v;

    const endRadius = this._tail.width / 2;
    this._tailMaskBody.height = this._tail.height - endRadius;
    this._tailMaskEnd.y = -this._tailMaskBody.height;
  }

  /**
   * @param {number} releaseTime
   * @param {number} elapsedTime
   */
  playHitAnimation(releaseTime, elapsedTime) {
    this.alpha = lerp(
      1,
      0,
      releaseTime,
      releaseTime + ANIM_DURATION,
      elapsedTime,
    );
    this.scale.set(lerp(1, 3, releaseTime, releaseTime + 250, elapsedTime));
  }
}

export class TrickNoteSprite extends Sprite {
  /**
   * @param {boolean} isVariation0 `false` assumes variation 1.
   */
  constructor(isVariation0) {
    super({
      texture: Assets.get(
        isVariation0 ? 'trick_note_head_0' : 'trick_note_head_1',
      ),
      anchor: 0.5,
    });
  }

  /**
   * @param {number} hitTime
   * @param {number} elapsedTime
   */
  playHitAnimation(hitTime, elapsedTime) {
    this.alpha = lerp(1, 0, hitTime, hitTime + ANIM_DURATION, elapsedTime);
    this.scale.set(lerp(1, 3, hitTime, hitTime + 250, elapsedTime));
  }
}
