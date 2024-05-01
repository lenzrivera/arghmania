// TODO: Properly use IndexedDB to store beatmaps, not just keyval.

import { get as idbGet, set as idbSet } from 'idb-keyval';
import { writable } from 'svelte/store';
import uniqid from 'uniqid';

// @ts-ignore
import beatmapTemplate from '../beatmap/template.yml?raw';

/**
 * @typedef {object} BeatmapFile
 * @property {string} id
 * @property {AssetList} assets
 * @property {string} yaml
 */

/**
 * @typedef {object} AssetList
 * @property {Asset|null} audio
 * @property {Asset|null} background
 */

/**
 * @typedef {object} Asset
 * @property {string} name
 * @property {string} uri
 */

const KEY_NAME = 'beatmaps_test';

async function createBeatmapStore() {
  /**
   * @type {BeatmapFile[]}
   */
  const dbValue = await idbGet(KEY_NAME);

  if (!dbValue) {
    await idbSet(KEY_NAME, []);
  }

  /**
   * @type {BeatmapFile[]}
   */
  const beatmaps = dbValue ?? [];

  /**
   * @type {import('svelte/store').Writable<BeatmapFile[]>}
   */
  const { subscribe, set } = writable(beatmaps);

  return {
    subscribe,

    /**
     * @param {string} id
     */
    delete(id) {
      const i = beatmaps.findIndex(b => b.id === id);

      if (i === -1) {
        throw new Error('Cannot delete beatmap file from nonexistent ID.');
      }

      beatmaps.splice(i, 1);

      idbSet(KEY_NAME, beatmaps);
      set(beatmaps);
    },

    /**
     * @param {string} id
     */
    get(id) {
      const beatmapFile = beatmaps.find(b => b.id === id);

      if (!beatmapFile) {
        throw new Error('Cannot get beatmap file from nonexistent ID.');
      }

      return beatmapFile;
    },

    /**
     * @param {string} [body]
     * @param {AssetList} [assets]
     */
    new(body, assets) {
      const id = uniqid();

      beatmaps.push({
        id,
        assets: assets ?? { audio: null, background: null },
        yaml: body ?? beatmapTemplate,
      });

      idbSet(KEY_NAME, beatmaps);
      set(beatmaps);

      return id;
    },

    /**
     * @param {string} id
     * @param {Asset} audio
     */
    setAudio(id, audio) {
      const beatmapFile = beatmaps.find(b => b.id === id);

      if (beatmapFile === null) {
        throw new Error('Cannot set beatmap background from nonexistent ID.');
      }

      beatmapFile.assets.audio = audio;

      idbSet(KEY_NAME, beatmaps);
      set(beatmaps);
    },

    /**
     * @param {string} id
     * @param {Asset} background
     */
    setBackground(id, background) {
      const beatmapFile = beatmaps.find(b => b.id === id);

      if (beatmapFile === null) {
        throw new Error('Cannot set beatmap background from nonexistent ID.');
      }

      beatmapFile.assets.background = background;

      idbSet(KEY_NAME, beatmaps);
      set(beatmaps);
    },

    /**
     * @param {string} id
     * @param {string} body
     */
    setBody(id, body) {
      const beatmapFile = beatmaps.find(b => b.id === id);

      if (beatmapFile === null) {
        throw new Error('Cannot set beatmap body from nonexistent ID.');
      }

      beatmapFile.yaml = body;

      idbSet(KEY_NAME, beatmaps);
      set(beatmaps);
    },
  };
}

export const beatmapStore = await createBeatmapStore();
