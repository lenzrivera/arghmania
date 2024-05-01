import { beatmapStore } from './beatmapStore';

/**
 * @param {string} beatmapFileText
 */
export function importBeatmap(beatmapFileText) {
  /**
   * @type {import('./beatmapStore').BeatmapFile}
   */
  const beatmapFile = JSON.parse(beatmapFileText);

  // TODO: Use stricter validation
  if (
    !Object.hasOwn(beatmapFile, 'assets') ||
    !Object.hasOwn(beatmapFile, 'yaml')
  ) {
    throw new Error('Cannot import invalid beatmap.');
  }

  return new Promise(resolve => {
    const id = beatmapStore.new(beatmapFile.yaml, beatmapFile.assets);
    resolve(id);
  });
}

/**
 * @param {import('./beatmapStore').BeatmapFile} beatmapFile
 */
export function exportBeatmap(beatmapFile) {
  const blob = new Blob([JSON.stringify(beatmapFile)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${beatmapFile.id}.json`;
  a.click();

  URL.revokeObjectURL(url);
}
