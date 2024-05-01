import { Assets, Container, Sprite } from 'pixi.js';

import { HitWindows } from '../../gameplay/Judger';

const BAR_LENGTH = 330;
const BAR_HEIGHT = 10;

const MARKER_SIZE = 17;

export class URBar extends Container {
  constructor() {
    super();

    this._okLine = new Sprite({
      texture: Assets.get('ur_bar_ok'),
      width: BAR_LENGTH,
      height: BAR_HEIGHT,
      anchor: 0.5,
    });

    this._goodLine = new Sprite({
      texture: Assets.get('ur_bar_good'),
      width: BAR_LENGTH * (HitWindows.GOOD_UB / HitWindows.OK_UB),
      height: BAR_HEIGHT,
      anchor: 0.5,
    });

    this._perfectLine = new Sprite({
      texture: Assets.get('ur_bar_perfect'),
      width: BAR_LENGTH * (HitWindows.PERFECT_UB / HitWindows.OK_UB),
      height: BAR_HEIGHT,
      anchor: 0.5,
    });

    this._markers = [];

    this.addChild(this._okLine, this._goodLine, this._perfectLine);

    for (let i = 0; i < 10; i++) {
      const x = new Sprite({
        texture: Assets.get('ur_bar_marker'),
        anchor: 0.5,
        width: MARKER_SIZE,
        height: MARKER_SIZE,
      });
      this._markers.push(x);
      this.addChild(x);
    }
  }

  /**
   * @param {number} timeDiff
   */
  pushTimeDiff(timeDiff) {
    if (Math.abs(timeDiff) > HitWindows.OK_UB) {
      return;
    }

    for (let i = 0; i < this._markers.length - 1; i++) {
      const c = this._markers[i];
      const d = this._markers[i + 1];

      c.x = d.x;
      c.alpha = 0.8 * Math.exp(0.3 * (i - 10)) + 0.2;
    }

    this._markers.at(-1).x = (timeDiff / HitWindows.OK_UB) * (BAR_LENGTH / 2);
  }
}
