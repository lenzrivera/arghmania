import { Container } from 'pixi.js';

import { HitNote, HoldNote, TrickNote } from '../../beatmap/notes';
import { HitNoteSprite, HoldNoteSprite, TrickNoteSprite } from './noteSprites';
import { Scroller } from './Scroller';
import { NoteHitInfo } from './util/NoteHitInfo';
import { lerp } from '../../util/interp';
import { BOTTOM_MARGIN } from '../ScrollerCanvas.svelte';

const MARGIN = 150;

export class NoteRenderer extends Container {
  constructor(beatmap) {
    super();

    this._beatmap = beatmap;

    this._noteHitInfos = generateNoteHitInfos(beatmap.notes);
  }

  get beatmap() {
    return this._beatmap;
  }

  set beatmap(v) {
    this._beatmap = v;
    this._noteHitInfos = generateNoteHitInfos(this._beatmap.notes);
  }

  /**
   * @param {number} noteIndex
   * @param {number} holdTime
   */
  holdNote(noteIndex, holdTime) {
    const noteData = this._noteHitInfos.find(nd => nd.note.index === noteIndex);
    noteData.holdTime = holdTime;
  }

  /**
   * @param {number} noteIndex
   * @param {string} judgement
   */
  judgeNote(noteIndex, judgement) {
    const noteData = this._noteHitInfos.find(nd => nd.note.index === noteIndex);
    noteData.judgement = judgement;
  }

  /**
   * @param {number} noteIndex
   * @param {number} releaseTime
   */
  releaseNote(noteIndex, releaseTime) {
    const noteData = this._noteHitInfos.find(nd => nd.note.index === noteIndex);
    noteData.releaseTime = releaseTime;
  }

  update(elapsedTime) {
    this.removeChildren();

    for (const noteHitInfo of this._noteHitInfos) {
      const note = noteHitInfo.note;
      const noteY = note.velocity * (elapsedTime - note.atTime);

      // TODO: Replace 900 with actual render height

      if (note instanceof HitNote) {
        if (noteY > BOTTOM_MARGIN + MARGIN || noteY < -900 - MARGIN) {
          continue;
        }

        this._renderHitNote(noteHitInfo, elapsedTime);
      } else if (note instanceof HoldNote) {
        const headY = noteY;
        const tailY = note.velocity * (elapsedTime - note.untilTime);

        if (tailY > BOTTOM_MARGIN + MARGIN || headY < -900 - MARGIN) {
          continue;
        }

        this._renderHoldNote(noteHitInfo, elapsedTime);
      } else if (note instanceof TrickNote) {
        if (noteY > BOTTOM_MARGIN + MARGIN || noteY < -900 - MARGIN) {
          continue;
        }

        this._renderTrickNote(noteHitInfo, elapsedTime);
      }
    }
  }

  /**
   * @param {number} elapsedTime
   */
  _renderHitNote(noteHitInfo, elapsedTime) {
    const note = noteHitInfo.note;

    const noteSprite = new HitNoteSprite(variationFromTrack(note.track));
    noteSprite.x = Scroller.getTrackX(note.track);

    if (!noteHitInfo.hasBeenHeldBy(elapsedTime)) {
      noteSprite.y = note.velocity * (elapsedTime - note.atTime);
    } else {
      noteSprite.y = note.velocity * (noteHitInfo.holdTime - note.atTime);
      noteSprite.playHitAnimation(noteHitInfo.holdTime, elapsedTime);
    }

    this.addChild(noteSprite);
  }

  /**
   * @param {number} elapsedTime
   */
  _renderHoldNote(noteHitInfo, elapsedTime) {
    const note = noteHitInfo.note;

    const noteSprite = new HoldNoteSprite(variationFromTrack(note.track));
    noteSprite.x = Scroller.getTrackX(note.track);
    this.addChild(noteSprite);

    if (noteHitInfo.judgement === 'miss') {
      const durationFromHold = noteHitInfo.holdTime - note.atTime;
      const durationFromRelease = elapsedTime - noteHitInfo.releaseTime;

      // Start moving down from hold position.
      noteSprite.y = note.velocity * (durationFromRelease + durationFromHold);
      noteSprite.tailLength =
        note.velocity * (note.duration - noteHitInfo.holdDuration);
      noteSprite.alpha = 0.5;

      return;
    }

    if (!noteHitInfo.hasBeenHeldBy(elapsedTime)) {
      noteSprite.y = note.velocity * (elapsedTime - note.atTime);
      noteSprite.tailLength = note.velocity * note.duration;
    } else {
      if (!noteHitInfo.hasBeenReleasedBy(elapsedTime)) {
        noteSprite.y = note.velocity * (noteHitInfo.holdTime - note.atTime);

        const durationHeld = elapsedTime - noteHitInfo.holdTime;
        noteSprite.tailLength = note.velocity * (note.duration - durationHeld);
      } else {
        noteSprite.y = note.velocity * (noteHitInfo.holdTime - note.atTime);

        const durationHeld = noteHitInfo.releaseTime - noteHitInfo.holdTime;
        noteSprite.tailLength = note.velocity * (note.duration - durationHeld);

        noteSprite.playHitAnimation(noteHitInfo.releaseTime, elapsedTime);
      }
    }
  }

  /**
   * @param {number} elapsedTime
   */
  _renderTrickNote(noteHitInfo, elapsedTime) {
    const note = noteHitInfo.note;

    const noteSprite = new TrickNoteSprite(variationFromTrack(note.toTrack));

    // TODO: perhaps allow setting of:
    // what % of height to start and end switching ([0, 1])

    if (elapsedTime < note.switchStartTime) {
      noteSprite.x = Scroller.getTrackX(note.track);
    } else if (elapsedTime < note.switchEndTime) {
      noteSprite.x = lerp(
        Scroller.getTrackX(note.track),
        Scroller.getTrackX(note.toTrack),
        note.switchStartTime,
        note.switchEndTime,
        elapsedTime,
      );
    } else {
      noteSprite.x = Scroller.getTrackX(note.toTrack);
    }

    if (!noteHitInfo.hasBeenHeldBy(elapsedTime)) {
      noteSprite.y = note.velocity * (elapsedTime - note.atTime);
    } else {
      noteSprite.y = note.velocity * (noteHitInfo.holdTime - note.atTime);
      noteSprite.playHitAnimation(noteHitInfo.holdTime, elapsedTime);
    }

    this.addChild(noteSprite);
  }
}

/**
 * @param {number} track
 */
function variationFromTrack(track) {
  // Refer to noteSprites; variation is so far a boolean.
  return track === 0 || track === 3;
}

function generateNoteHitInfos(notes) {
  return notes.map(note => new NoteHitInfo(note));
}
