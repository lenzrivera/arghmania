import { Container } from 'pixi.js';

import { HitButton } from './HitButton';
import { Scroller, INNER_COL_COLOR, OUTER_COL_COLOR } from './Scroller';

export class HitButtonRenderer extends Container {
  static HIT_BUTTON_MARGIN = 0.3;

  constructor() {
    super();

    const button0 = new HitButton(OUTER_COL_COLOR);
    button0.x = Scroller.getTrackX(0);

    const button1 = new HitButton(INNER_COL_COLOR);
    button1.x = Scroller.getTrackX(1);

    const button2 = new HitButton(INNER_COL_COLOR);
    button2.x = Scroller.getTrackX(2);

    const button3 = new HitButton(OUTER_COL_COLOR);
    button3.x = Scroller.getTrackX(3);

    this._buttons = [button0, button1, button2, button3];
    this._buttons.forEach(btn => this.addChild(btn));
  }

  /**
   * @param {number} trackIndex
   * @param {number} elapsedTime
   */
  holdButton(trackIndex, elapsedTime) {
    if (!this._buttons[trackIndex]) {
      throw new Error('Track index has no corresponding button.');
    }

    this._buttons[trackIndex].hold(elapsedTime);
  }

  /**
   * @param {number} trackIndex
   * @param {number} elapsedTime
   */
  releaseButton(trackIndex, elapsedTime) {
    this._buttons[trackIndex].release(elapsedTime);
  }

  /**
   * @param {number} elapsedTime
   */
  update(elapsedTime) {
    this._buttons.forEach(btn => btn.update(elapsedTime));
  }
}
