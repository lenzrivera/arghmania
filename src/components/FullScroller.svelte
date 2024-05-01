<script>
  import { onMount } from 'svelte';

  import ScrollerCanvas, {
    BASE_HEIGHT,
    BASE_WIDTH,
  } from './ScrollerCanvas.svelte';
  import { JudgementDisplay } from './canvas/JudgementDisplay';
  import { Scroller } from './canvas/Scroller';

  export let beatmap;
  export let elapsedTime;

  let canvas;

  const scroller = new Scroller(beatmap, elapsedTime);
  $: scroller.beatmap = beatmap;
  $: handleElapsedTimeUpdate(elapsedTime);

  const judgementDisplay = new JudgementDisplay();

  onMount(() => {
    const pixiApp = canvas.getPixiApp();

    judgementDisplay.x = BASE_WIDTH / 2;
    judgementDisplay.y = -BASE_HEIGHT * 0.6;

    pixiApp.stage.addChild(scroller);
    pixiApp.stage.addChild(judgementDisplay);
  });

  export function displayJudgement(judgement, timeDiff) {
    judgementDisplay.display(judgement, timeDiff);
  }

  /**
   * @param {number} trackIndex
   */
  export function holdHitButton(trackIndex) {
    scroller.hitButtons.holdButton(trackIndex, elapsedTime);
  }

  /**
   * @param {number} trackIndex
   */
  export function releaseHitButton(trackIndex) {
    scroller.hitButtons.releaseButton(trackIndex, elapsedTime);
  }

  /**
   * @param {number} noteIndex
   * @param {number} holdTime
   */
  export function holdNote(noteIndex, holdTime) {
    scroller.notes.holdNote(noteIndex, holdTime);
  }

  /**
   * @param {number} noteIndex
   * @param {string} judgement
   */
  export function judgeNote(noteIndex, judgement) {
    scroller.notes.judgeNote(noteIndex, judgement);
  }

  /**
   * @param {number} noteIndex
   * @param {number} releaseTime
   */
  export function releaseNote(noteIndex, releaseTime) {
    scroller.notes.releaseNote(noteIndex, releaseTime);
  }

  /**
   * @param {number} elapsedTime
   */
  function handleElapsedTimeUpdate(elapsedTime) {
    scroller.elapsedTime = elapsedTime;
    judgementDisplay.update(elapsedTime);
  }
</script>

<ScrollerCanvas bind:this={canvas} />
