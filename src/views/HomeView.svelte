<script context="module">
  import { writable } from 'svelte/store';

  /**
   * @type {import('svelte/store').Writable<?string>}
   */
  const selectedBeatmapId = writable(null);
</script>

<script>
  import { SongPlayer } from '../audio/SongPlayer';
  import { beatmapStore } from '../beatmap/beatmapStore';
  import { BeatmapParser } from '../beatmap/BeatmapParser';
  import Background, {
    setBackground,
    setToDefaultBackground,
  } from '../components/Background.svelte';
  import BeatmapItem from '../components/BeatmapItem.svelte';
  import LabelButton from '../components/LabelButton.svelte';
  import { currentView } from './currentView';
  import EditorView from './EditorView.svelte';
  import GameView from './GameView.svelte';
  import { onMount } from 'svelte';
  import { importBeatmap } from '../beatmap/transfers';

  onMount(() => {
    if ($selectedBeatmapId !== null) {
      const beatmapFile = beatmapStore.get($selectedBeatmapId);
      const beatmapAssets = beatmapFile.assets;

      if (beatmapAssets.audio?.uri) {
        SongPlayer.crossfade(beatmapAssets.audio.uri);
      }

      if (beatmapAssets.background?.uri) {
        setBackground(beatmapAssets.background.uri);
      }
    }
  });

  function createBeatmap() {
    SongPlayer.pause();

    const beatmapId = beatmapStore.new();
    currentView.set(EditorView, { beatmapId });
  }

  /**
   * @param {string} beatmapId
   */
  function deleteBeatmap(beatmapId) {
    beatmapStore.delete(beatmapId);
    selectBeatmap(null);
  }

  /**
   * @param {string} beatmapId
   */
  function editBeatmap(beatmapId) {
    SongPlayer.pause();
    selectedBeatmapId.set(beatmapId);

    currentView.set(EditorView, { beatmapId });
  }

  function handleBeatmapImport() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.click();

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async e => {
        const beatmapText = e.target.result.toString();
        const id = await importBeatmap(beatmapText);

        // setTimeout(() => ($selectedBeatmapId = id), 2500);
        selectBeatmap(id);
      };

      reader.readAsText(file);
    });
  }

  /**
   * @param {string} beatmapId
   */
  function selectBeatmap(beatmapId) {
    // TODO: Make more reactive, refactor into smaller chunks

    if (beatmapId === null) {
      SongPlayer.pause();
      setToDefaultBackground();

      return;
    }

    const prevSelectedBeatmapId = $selectedBeatmapId;

    selectedBeatmapId.set(beatmapId);
    const beatmapFile = beatmapStore.get($selectedBeatmapId);

    // On initial selection:
    if ($selectedBeatmapId !== prevSelectedBeatmapId) {
      const beatmapAssets = beatmapFile.assets;

      if (beatmapAssets.background?.uri) {
        setBackground(beatmapAssets.background.uri);
      } else {
        setToDefaultBackground();
      }

      if (beatmapAssets.audio?.uri) {
        SongPlayer.crossfade(beatmapAssets.audio.uri);
      } else {
        SongPlayer.pause();
      }

      return;
    }

    // On second selection:
    if (BeatmapParser.checkStructure(beatmapFile) !== '') {
      return;
    }

    SongPlayer.pause();

    const beatmap = BeatmapParser.parseWhole(beatmapFile);
    currentView.set(GameView, { beatmap });
  }
</script>

<Background />

<div class="home-view">
  <div class="title-container">
    <h1>Arghmania</h1>
    <p>A dumb 4-key mania clone.</p>
  </div>

  <div class="button-container">
    <LabelButton icon="Add" on:click={() => createBeatmap()}>
      New Beatmap
    </LabelButton>
    <LabelButton icon="Upload_File" on:click={handleBeatmapImport}>
      Import Beatmap
    </LabelButton>
  </div>

  <!-- TODO: Show scrollbar on hover or longpress -->
  <div class="beatmap-list frs-hide-scroll">
    {#each $beatmapStore as { id } (id)}
      <BeatmapItem
        metadata={BeatmapParser.parseMetadata(beatmapStore.get(id))}
        selected={id === $selectedBeatmapId}
        valid={BeatmapParser.checkStructure(beatmapStore.get(id)) === ''}
        on:click={() => selectBeatmap(id)}
        on:delete={() => deleteBeatmap(id)}
        on:edit={() => editBeatmap(id)}
      />
    {/each}
  </div>
</div>

<style>
  .home-view {
    width: 100vw;
    height: 100vh;
    padding: 4rem;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .button-container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 1rem;
  }

  .title-container {
    text-align: center;
  }

  .title-container h1 {
    margin-left: 0.25rem;

    background: linear-gradient(0deg, #777, #ddd 40%, #fff);
    color: transparent;
    background-clip: text;
    filter: drop-shadow(0px 0px 8px #333);

    font-family: 'Almendra SC', fantasy;
    font-size: 2.75rem;
    letter-spacing: 0.65rem;

    user-select: none;
  }

  .title-container p {
    color: #ddd;

    font-family: 'Libre Baskerville', serif;
    font-size: 1.2rem;

    user-select: none;
  }

  .beatmap-list {
    /* Allow for horizontal expansion despite overflow. */
    padding: 0 5rem;
    min-width: min(35rem, 50vw);

    list-style-type: none;
    overflow: auto;

    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
