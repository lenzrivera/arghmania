import { Container } from 'pixi.js';

import { JudgementText } from './JudgementText';
import { URBar } from './URBar';

const ELEM_MARGIN = 27;

/**
 * Anchored at the center of all its children.
 */
export class JudgementDisplay extends Container {
  constructor() {
    super();

    this._judgementText = new JudgementText();
    this._judgementText.y = -ELEM_MARGIN;

    this._urBar = new URBar();
    this._urBar.y = ELEM_MARGIN;

    this.addChild(this._judgementText);
    this.addChild(this._urBar);
  }

  /**
   * @param {string} judgement
   * @param {number} timeDiff
   */
  display(judgement, timeDiff) {
    switch (judgement) {
      case 'perfect':
        this._judgementText.flashPerfect();
        break;

      case 'good':
        this._judgementText.flashGood();
        break;

      case 'ok':
        this._judgementText.flashOk();
        break;

      case 'miss':
        this._judgementText.flashMiss();
        break;
    }

    this._urBar.pushTimeDiff(timeDiff);
  }

  /**
   * @param {number} elapsedTime
   */
  update(elapsedTime) {
    this._judgementText.update(elapsedTime);
  }
}
