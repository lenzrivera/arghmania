import yaml, { YAMLException } from 'js-yaml';

import { Beatmap } from './Beatmap';
import { BeatmapMetadata } from './BeatmapMetadata';
import { validateBeatmapJSON } from './BeatmapValidator';
import { HitNote, HoldNote, TrickNote } from './notes';
import { SpacingEvent, TimingEvent } from './events';

// TODO: Have a specific type declaration for beatmaps.

export const BeatmapParser = {
  /**
   * @param {import('./beatmapStore').BeatmapFile} beatmapFile
   */
  checkStructure(beatmapFile) {
    try {
      /**
       * @type {object}
       */
      const beatmapJson = yaml.load(beatmapFile.yaml);
      const validationMsg = validateBeatmapJSON(beatmapJson);

      if (validationMsg) {
        return validationMsg;
      }

      return '';
    } catch (e) {
      if (e instanceof YAMLException) {
        return `YAML Error: ${e.message}`;
      }

      return `Other Error: ${e.message}`;
    }
  },

  /**
   * @param {import('./beatmapStore').BeatmapFile} beatmapFile
   */
  parseMetadata(beatmapFile) {
    try {
      /**
       * @type {object}
       */
      const beatmapJson = yaml.load(beatmapFile.yaml);

      return new BeatmapMetadata({
        title: beatmapJson?.meta?.title || '[error]',
        artist: beatmapJson?.meta?.artist || '[error]',
        audioURI: beatmapFile.assets?.audio?.uri || '',
        backgroundURI: beatmapFile.assets?.background?.uri || '',
      });
    } catch (e) {
      if (e instanceof YAMLException) {
        return new BeatmapMetadata({
          title: '[error]',
          artist: '[error]',
          audioURI: '',
          backgroundURI: '',
        });
      }
    }
  },

  /**
   * Assumes that beatmapText is well-formed and has no errors.
   * `BeatmapParser.checkStructure()` should be called first before this.
   *
   * @param {import('./beatmapStore').BeatmapFile} beatmapFile
   */
  parseWhole(beatmapFile) {
    /**
     * @type {object}
     */
    const beatmapJson = yaml.load(beatmapFile.yaml);

    // TODO: There's probably a cleaner way to do this. Thinking of a mixin for
    // events and another for notes; combination of both is the main Beatmap object.
    const meta = this.parseMetadata(beatmapFile);
    const beatmap = new Beatmap(meta, [], ...parseEvents(beatmapJson));

    for (const [i, note] of beatmapJson.notes.entries()) {
      if (note.type === 'hit') {
        beatmap._notes.push(
          new HitNote(i, note.at, beatmap.getVelocity(note.at), note.track),
        );
      } else if (note.type === 'hold') {
        beatmap._notes.push(
          new HoldNote(
            i,
            note.at,
            note.until,
            beatmap.getVelocity(note.at),
            note.track,
          ),
        );
      } else if (note.type === 'trick') {
        beatmap._notes.push(
          new TrickNote(
            i,
            note.at,
            beatmap.getVelocity(note.at),
            note.track,
            note.to_track,
          ),
        );
      }
    }

    return beatmap;
  },
};

/**
 * @param {object} beatmapJson
 * @returns {[TimingEvent[], SpacingEvent[]]}
 */
function parseEvents(beatmapJson) {
  // TODO: What to do with negative offset?
  // TODO: No notes should be before starting offset (?)
  // TODO: Ensure events are ordered by ascending time
  // TODO: Ensure notes are ordered by ascending time
  // TODO: Ensure ar has no time overlap with previous

  const timingEvents = [
    new TimingEvent(
      beatmapJson.meta.start_offset || 0,
      beatmapJson.meta.beats_per_minute,
      beatmapJson.meta.beats_per_measure,
    ),
  ];
  const spacingEvents = [
    new SpacingEvent(
      beatmapJson.meta.start_offset || 0,
      beatmapJson.meta.approach_rate || 1,
    ),
  ];

  for (const event of beatmapJson.events) {
    const prevEvent = timingEvents.at(-1);

    // Override attributes of previous timing events with the same time as
    // the current one. This allows, e.g. both bpmi and bpme events to be
    // applied at the same time.
    const setIndex =
      timingEvents.length - (prevEvent.atTime === event.at ? 1 : 0);

    if (event.type === 'bpmi') {
      timingEvents[setIndex] = new TimingEvent(
        event.at,
        event.value,
        prevEvent.beatsPerMeasure,
      );
    } else if (event.type === 'bpme') {
      timingEvents[setIndex] = new TimingEvent(
        event.at,
        prevEvent.beatsPerMinute,
        event.value ?? prevEvent.beatsPerMeasure,
      );
    } else if (event.type === 'ar') {
      spacingEvents.push(new SpacingEvent(event.at, event.value));
    }
  }

  return [timingEvents, spacingEvents];
}
