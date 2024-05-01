<script>
  import { yaml } from '@codemirror/lang-yaml';
  import { materialDark } from '@uiw/codemirror-theme-material';
  import { onMount } from 'svelte';
  import CodeMirror from 'svelte-codemirror-editor';

  import { SongPlayer } from '../audio/SongPlayer';
  import { BeatmapParser } from '../beatmap/BeatmapParser';
  import { beatmapStore } from '../beatmap/beatmapStore';
  import AssetEditor from '../components/AssetEditor.svelte';
  import Background, {
    setBackground,
    setToDefaultBackground,
  } from '../components/Background.svelte';
  import DivisionSelector from '../components/DivisionSelector.svelte';
  import IconButton from '../components/IconButton.svelte';
  import PreviewScroller from '../components/PreviewScroller.svelte';
  import ScrubberBar from '../components/ScrubberBar.svelte';
  import ScrubberTime from '../components/ScrubberTime.svelte';
  import { createClock } from '../gameplay/Clock';
  import { createAutoSaveHandler } from '../util/autosave';
  import { currentView } from './currentView';
  import HomeView from './HomeView.svelte';

  // @ts-ignore
  import beatmapTemplate from '../beatmap/template.yml?raw';
  import { exportBeatmap } from '../beatmap/transfers';

  const DIVISIONS = [1, 2, 4, 8, 16];

  /**
   * @type {import('../beatmap/beatmapStore').BeatmapFile}
   */
  const EMPTY_BEATMAP_FILE = {
    id: null,
    assets: {
      audio: null,
      background: null,
    },
    yaml: beatmapTemplate,
  };

  /**
   * Assume this is never changed.
   * @type {string}
   */
  export let beatmapId;

  /**
   * @type {PreviewScroller}
   */
  let scroller;

  const beatmapFile = beatmapStore.get(beatmapId);

  // Only update these when editorText has a valid beatmap and the beatmap is
  // saved.
  let beatmapObject = getInitialBeatmapObject(beatmapFile);
  let statusText = '';

  // Used for updating the displayed asset details in the asset editor when
  // necessary.
  let beatmapAssets = beatmapFile.assets;
  let openAssetEditor = false;

  let editorText = beatmapFile.yaml;
  let selectedDivision = DIVISIONS[0];

  const [clock, elapsedTime] = createClock(beatmapObject.startTimestamp);
  const handleEditorChange = createAutoSaveHandler(saveBeatmapBody);

  onMount(() => {
    clock.on('pause', handleClockPause);
    clock.on('seek', handleClockSeek);
    clock.on('tick', handleClockTick);

    updatePlayableBeatmap();
  });

  function handleBackButtonClick() {
    SongPlayer.pause();
    beatmapStore.setBody(beatmapId, editorText);
    currentView.set(HomeView);
  }

  function handleClockPause() {
    SongPlayer.pauseImmediately();
  }

  async function handleClockSeek() {
    SongPlayer.seek($elapsedTime);

    if ($elapsedTime < 0) {
      SongPlayer.pauseImmediately();
    }
  }

  async function handleClockTick() {
    if (!SongPlayer.playing && $elapsedTime >= 0) {
      await SongPlayer.play();
      SongPlayer.seek($elapsedTime);
    }

    if ($elapsedTime >= SongPlayer.currentSong.duration() * 1000) {
      clock.pause();
      SongPlayer.pause();
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveBeatmapBody();
    }
  }

  function handleBeatmapExport() {
    saveBeatmapBody();
    exportBeatmap(beatmapFile);
  }

  /**
   * @param {import('../beatmap/beatmapStore').BeatmapFile} beatmapFile
   */
  function getInitialBeatmapObject(beatmapFile) {
    if (BeatmapParser.checkStructure(beatmapFile) === '') {
      return BeatmapParser.parseWhole(beatmapFile);
    } else {
      return BeatmapParser.parseWhole(EMPTY_BEATMAP_FILE);
    }
  }

  /* Saving */

  function saveBeatmapBody() {
    beatmapStore.setBody(beatmapId, editorText);
    updatePlayableBeatmap();
  }

  /**
   * @param {import('../beatmap/beatmapStore').Asset} newAudioAsset
   */
  function updateBeatmapAudio(newAudioAsset) {
    beatmapAssets.audio = newAudioAsset;
    beatmapAssets = beatmapAssets;

    beatmapStore.setAudio(beatmapId, newAudioAsset);

    updatePlayableBeatmap();
  }

  /**
   * @param {import('../beatmap/beatmapStore').Asset} newBackgroundAsset
   */
  function updateBeatmapBackground(newBackgroundAsset) {
    beatmapAssets.background = newBackgroundAsset;
    beatmapAssets = beatmapAssets;

    beatmapStore.setBackground(beatmapId, newBackgroundAsset);

    updatePlayableBeatmap();
  }

  async function updatePlayableBeatmap() {
    statusText = BeatmapParser.checkStructure(beatmapFile);

    if (statusText !== '') {
      return;
    }

    beatmapObject = BeatmapParser.parseWhole(beatmapFile);

    if (beatmapFile.assets.background?.uri) {
      setBackground(beatmapFile.assets.background?.uri);
    } else {
      setToDefaultBackground();
    }

    await SongPlayer.load(beatmapFile.assets.audio?.uri ?? '');
    SongPlayer.seek($elapsedTime);
  }

  /* Playback */

  async function resumeBeatmap() {
    // TODO: Replace with a function that does not need the whole uri to be
    // passed. Something that just checks the state of the current audio.
    await SongPlayer.load(beatmapFile.assets.audio?.uri ?? '');

    if ($elapsedTime < 0) {
      clock.start();
    } else {
      await SongPlayer.play();
      SongPlayer.seek($elapsedTime);
      clock.start();
    }
  }

  function pauseBeatmap() {
    clock.pause();
  }

  function rewindBeatmap() {
    clock.seek(beatmapObject.startTimestamp);
  }

  /**
   * @param {number} timestamp
   */
  function seekBeatmap(timestamp) {
    clock.seek(timestamp);
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<Background />

{#if openAssetEditor}
  <AssetEditor
    {beatmapAssets}
    on:audiochange={({ detail: newAudioAsset }) =>
      updateBeatmapAudio(newAudioAsset)}
    on:backgroundchange={({ detail: mewBackgroundAsset }) =>
      updateBeatmapBackground(mewBackgroundAsset)}
    on:close={() => (openAssetEditor = false)}
  />
{/if}

<div class="editor-view">
  <div class="control-bar">
    <div class="control-group">
      <IconButton icon="arrow_back" on:click={handleBackButtonClick} />
      <IconButton
        icon="folder_copy"
        on:click={() => (openAssetEditor = true)}
      />
      <IconButton icon="export_notes" on:click={handleBeatmapExport} />
    </div>

    <div class="playback-controls control-group">
      <IconButton icon="play_arrow" on:click={resumeBeatmap} />
      <IconButton icon="stop" on:click={pauseBeatmap} />
      <IconButton icon="first_page" on:click={rewindBeatmap} />

      <ScrubberBar
        currTime={$elapsedTime}
        minTime={beatmapObject.startTimestamp}
        maxTime={SongPlayer.currentSong.duration() * 1000}
        on:scrub={({ detail: timestamp }) => seekBeatmap(timestamp)}
      />
      <ScrubberTime
        currTime={$elapsedTime}
        maxTime={SongPlayer.currentSong.duration() * 1000}
      />
    </div>

    <div class="control-group">
      <DivisionSelector
        divisions={DIVISIONS}
        bind:selected={selectedDivision}
      />

      <IconButton
        icon="navigate_before"
        on:click={() =>
          clock.seek(scroller.getInstance().lines.getPreviousLineTime())}
      />
      <IconButton
        icon="navigate_next"
        on:click={() =>
          clock.seek(scroller.getInstance().lines.getNextLineTime())}
      />
    </div>
  </div>

  <div class="editor-body">
    <div class="scroller-wrapper">
      <PreviewScroller
        bind:this={scroller}
        beatmap={beatmapObject}
        elapsedTime={$elapsedTime}
        measureDivision={selectedDivision}
      />
    </div>

    <CodeMirror
      class="codemirror-editor"
      lang={yaml()}
      theme={materialDark}
      styles={{
        'codemirror-wrapper': {
          overflow: 'hidden',
        },
        '&': {
          height: '100%',
          'background-color': '#111111ed',
          'font-size': '0.85rem',
        },
        '.cm-scroller': {
          overflow: 'auto',
          'scrollbar-color': '#666 #111',
        },
      }}
      bind:value={editorText}
      on:change={handleEditorChange}
    />
  </div>

  {#if statusText}
    <div role="status" class="message-popup">
      <p>{statusText}</p>
    </div>
  {/if}
</div>

<style>
  :global(.codemirror-wrapper) {
    overflow: hidden;
  }

  .editor-view {
    width: 100vw;
    height: 100vh;

    display: grid;
    grid-template-rows: auto 1fr;
  }

  .control-bar {
    padding: 0.6rem 1rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;

    background: linear-gradient(0deg, #777, #c1c1c1);
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }

  .playback-controls {
    flex: 1;
  }

  .editor-body {
    overflow: hidden;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 100%;
  }

  .scroller-wrapper {
    padding: 0 0.5rem;
  }

  .message-popup {
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    padding: 0.5em 1em;

    max-width: 80ch;
    max-height: 5em;
    overflow: auto;

    color: #ddd;
    font-family: 'Libre Baskerville', serif;
    font-size: 0.8rem;

    background: linear-gradient(0deg, #da7070bf, #e68e8ebf);
    border-radius: 0.25rem;

    scrollbar-color: #666 #111;
  }
</style>
