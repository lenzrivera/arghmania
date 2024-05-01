<script context="module">
  import { HitButton } from './canvas/HitButton';

  export const BASE_WIDTH = 600;
  export const BASE_HEIGHT = 900;
  export const BOTTOM_MARGIN = 20;
  export const TIMING_HEIGHT = 650;
</script>

<script>
  import { Application } from 'pixi.js';
  import { onMount } from 'svelte';

  /**
   * @type {HTMLCanvasElement}
   */
  let canvas;

  /**
   * @type {Application}
   */
  const pixiApp = new Application();

  onMount(async () => {
    await pixiApp.init({
      canvas,
      backgroundAlpha: 0,
    });
    resizeToFit();
  });

  export function getPixiApp() {
    return pixiApp;
  }

  /**
   * Enforces the following resize constraints:
   * - Scroller height = 100% of container height
   * - Scroller width = fitted width following aspect ratio, maximum of base
   *   render width.
   */
  function resizeToFit() {
    const parent = canvas.parentElement;

    // Fit the scroller to the screen following the base render aspect ratio
    // without overflow. Do not go over the dimensions of the base render
    // dimensions, as at that point only the height should be adjusted and we
    // don't have to follow the aspect ratio anymore.
    const fitScale = Math.min(
      parent.clientWidth / BASE_WIDTH,
      parent.clientHeight / BASE_HEIGHT,
      1,
    );

    // Compute the render height required to get the canvas element to fit
    // the whole height without messing with the scale. Note that fitScale is
    // basically "html pixels" per "render pixel", which explains the division.
    const renderHeight = parent.clientHeight / fitScale;
    pixiApp.renderer.resize(BASE_WIDTH, renderHeight);

    // Use scaled width, take up all the height.
    pixiApp.canvas.style.width = `${BASE_WIDTH * fitScale}px`;
    pixiApp.canvas.style.height = `100%`;

    // Shift origin to bottom. This should make rerendering while resizing easier
    // since the bottom part never changes while we want to keep on exposing more
    // top parts if the canvas gets long enough.
    const finalBottomMargin = -(HitButton.RADIUS + BOTTOM_MARGIN);
    pixiApp.stage.pivot.y = -(pixiApp.renderer.height + finalBottomMargin);
  }
</script>

<svelte:window on:resize={resizeToFit} />

<canvas bind:this={canvas}>Sorry, canvas isn't supported.</canvas>
