<script>
  import { onMount } from 'svelte';

  import ScrollerCanvas from './ScrollerCanvas.svelte';
  import { Scroller } from './canvas/Scroller';

  /**
   * @type {import('../beatmap/Beatmap').Beatmap}
   */
  export let beatmap;

  /**
   * @type {number}
   */
  export let elapsedTime;

  /**
   * @type {number}
   */
  export let measureDivision;

  /**
   * @type {ScrollerCanvas}
   */
  let canvas;

  const scroller = new Scroller(beatmap, elapsedTime);
  $: scroller.beatmap = beatmap;
  $: scroller.elapsedTime = elapsedTime;
  $: scroller.measureDivision = measureDivision;

  onMount(() => {
    const pixiApp = canvas.getPixiApp();

    pixiApp.stage.addChild(scroller);
    scroller.elapsedTime = elapsedTime;
  });

  export function getInstance() {
    return scroller;
  }

  export function getHitLineToTopDist() {
    return canvas ? -canvas.getPixiApp().stage.pivot.y : 0;
  }
</script>

<ScrollerCanvas bind:this={canvas} />
