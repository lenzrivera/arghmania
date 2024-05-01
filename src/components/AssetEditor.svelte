<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import IconButton from './IconButton.svelte';

  const AUDIO_ACCEPT_TYPES = '.mp3,.ogg';
  const BG_ACCEPT_TYPES = '.jpeg,.jpg';

  /**
   * @type {import('../beatmap/beatmapStore').AssetList}
   */
  export let beatmapAssets;

  async function setAudioAsset() {
    const file = await importFile(AUDIO_ACCEPT_TYPES);

    if (!file) {
      return;
    }

    const [name, uri] = file;
    dispatch('audiochange', { name, uri });
  }

  async function setBackgroundAsset() {
    const file = await importFile(BG_ACCEPT_TYPES);

    if (!file) {
      return;
    }

    const [name, uri] = file;
    dispatch('backgroundchange', { name, uri });
  }

  /**
   * @param {string} acceptTypes
   */
  function importFile(acceptTypes) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = acceptTypes;
    fileInput.click();

    return new Promise(resolve => {
      fileInput.addEventListener('change', () => {
        // If cancelled:
        if (fileInput.files.length === 0) {
          resolve(null);
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = e => {
          const base64URI = e.target.result;
          resolve([file.name, base64URI]);
        };

        reader.readAsDataURL(file);
      });
    });
  }
</script>

<div class="asset-browser">
  <div class="header">
    <h2>Asset Editor</h2>
    <IconButton icon="Close" on:click={() => dispatch('close')} />
  </div>

  <ol>
    <li class="asset">
      <h3>Audio</h3>

      <div class="asset-value">
        <p class="asset-name">{beatmapAssets.audio?.name ?? '[None]'}</p>
        <IconButton icon="Edit" on:click={setAudioAsset} />
      </div>
    </li>
    <li class="asset">
      <h3>Background</h3>

      <div class="asset-value">
        <p class="asset-name">{beatmapAssets.background?.name ?? '[None]'}</p>
        <IconButton icon="Edit" on:click={setBackgroundAsset} />
      </div>
    </li>
  </ol>
</div>

<style>
  h2 {
    margin-bottom: -0.2em;
    user-select: none;
  }

  ol {
    padding: 1em;
    list-style-type: none;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    background-color: #7a7a7a;
    border-radius: 0.25rem;

    overflow: auto;
    scrollbar-color: #666 #111;
  }

  .asset-browser {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: 1;

    width: min(30rem, 85vw);
    padding: 1.5em 2.5em;

    display: flex;
    flex-direction: column;
    gap: 1em;

    font-family: 'Libre Baskerville', serif;

    background: linear-gradient(0deg, #777777bf, #ddddddbf);
    border-radius: 0.25rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .asset {
    padding: 0.1em;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asset:hover {
    background-color: #9b9b9b;
    border-radius: 0.25rem;
  }

  .asset > h3 {
    font-weight: bold;
  }

  .asset-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
  }

  .asset-name {
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
  }
</style>
