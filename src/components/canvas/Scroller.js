import { Container } from 'pixi.js';

import {
  BASE_HEIGHT,
  BASE_WIDTH,
  BOTTOM_MARGIN,
} from '../ScrollerCanvas.svelte';
import { HitButton } from './HitButton';
import { HitButtonRenderer } from './HitButtonRenderer';
import { LineRenderer } from './LineRenderer';
import { NoteRenderer } from './NoteRenderer';

export const OUTER_COL_COLOR = 0xf14a81;
export const INNER_COL_COLOR = 0xe73fe9;

export class Scroller extends Container {
  constructor(beatmap, elapsedTime) {
    super();

    this._beatmap = beatmap;
    this._elapsedTime = elapsedTime;
    this._measureDivision = 1;

    this._lines = new LineRenderer(beatmap);
    this._lines.measureDivision = this._measureDivision;

    this._hitButtons = new HitButtonRenderer();

    this._notes = new NoteRenderer(beatmap);

    this.addChild(this._lines);
    this.addChild(this._hitButtons);
    this.addChild(this._notes);

    this._updateFromElapsedTime();
  }

  static getTrackX(trackIndex) {
    // TODO: Explain this

    const spaceLeft = BASE_WIDTH - 8 * HitButton.RADIUS;
    const margin = (spaceLeft * HitButtonRenderer.HIT_BUTTON_MARGIN) / 2;
    const gap = (spaceLeft * (1 - HitButtonRenderer.HIT_BUTTON_MARGIN)) / 3;

    return (
      margin + HitButton.RADIUS + (gap + 2 * HitButton.RADIUS) * trackIndex
    );
  }

  get beatmap() {
    return this._beatmap;
  }

  set beatmap(v) {
    this._beatmap = v;
    this._lines.beatmap = this._beatmap;
    this._notes.beatmap = this._beatmap;

    this._updateFromElapsedTime();
  }

  get elapsedTime() {
    return this._elapsedTime;
  }

  set elapsedTime(v) {
    this._elapsedTime = v;
    this._updateFromElapsedTime();
  }

  get measureDivision() {
    return this._measureDivision;
  }

  set measureDivision(v) {
    this._measureDivision = v;
    this._lines.measureDivision = this._measureDivision;

    this._lines.update();
  }

  get hitButtons() {
    return this._hitButtons;
  }

  get lines() {
    return this._lines;
  }

  get notes() {
    return this._notes;
  }

  _updateFromElapsedTime() {
    this._lines.elapsedTime = this._elapsedTime;
    this._lines.hitLineToBottomDist = BOTTOM_MARGIN;

    // TODO: Some delays in how values are set in pixi stuff is necessitating
    // this stupid condition. Can probably be made cleaner.
    this._lines.hitLineToTopDist =
      !this.parent || this.parent.pivot.y === 0
        ? BASE_HEIGHT
        : -this.parent.pivot.y;

    this._lines.update();
    this._notes.update(this._elapsedTime);
    this._hitButtons.update(this._elapsedTime);
  }
}
