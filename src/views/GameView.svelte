<script>
  import { onMount } from 'svelte';

  import { SongPlayer } from '../audio/SongPlayer';
  import Background from '../components/Background.svelte';
  import FullScroller from '../components/FullScroller.svelte';
  import StatsOverlay from '../components/StatsOverlay.svelte';
  import TouchOverlay from '../components/TouchOverlay.svelte';
  import { createClock } from '../gameplay/Clock';
  import { gameKeyInput, inputKeys } from '../gameplay/input';
  import { Judger } from '../gameplay/Judger';
  import { createScorer } from '../gameplay/Scorer';
  import { SfxPlayer } from '../audio/SfxPlayer';
  import { currentView } from './currentView';
  import HomeView from './HomeView.svelte';
  import ResultsView from './ResultsView.svelte';

  /**
   * @type {import('../beatmap/Beatmap').Beatmap}
   */
  export let beatmap;

  /**
   * @type {FullScroller}
   */
  let scroller;

  const [clock, elapsedTime] = createClock(beatmap.startTimestamp);

  const judger = new Judger(beatmap);
  const [scorer, stats] = createScorer(beatmap.notes.length);

  onMount(async () => {
    clock.on('tick', handleClockTick);
    clock.on('pause', handleClockPause);
    clock.on('resume', resumeBeatmapAudio);

    judger.on('judgedhold', handleJudgedHold);
    judger.on('judgedcombo', handleJudgedCombo);
    judger.on('judgedrelease', handleJudgedRelease);
    judger.on('judgement', handleJudgement);

    await SongPlayer.load(beatmap.meta.audioURI);
    clock.start();
  });

  function handleClockTick() {
    // Handle negative elapsedTime (needed for songs that start immediately.)
    if (!SongPlayer.playing && $elapsedTime >= 0) {
      resumeBeatmapAudio();
    }

    if ($elapsedTime >= beatmap.endTimestamp) {
      clock.pause();
      SongPlayer.pause();

      currentView.set(ResultsView, {
        beatmapReference: beatmap,

        score: $stats.score,
        accuracy: $stats.accuracy,
        maxCombo: $stats.maxCombo,
        misses: $stats.misses,
        unstableRate: $stats.unstableRate,
      });
    }

    judger.update($elapsedTime);
  }

  function handleClockPause() {
    if ($elapsedTime < beatmap.endTimestamp) {
      SongPlayer.pauseImmediately();
    }
  }

  async function resumeBeatmapAudio() {
    await SongPlayer.play();
    SongPlayer.seek(clock.elapsedTime);
  }

  /**
   * @param {string} key
   */
  function handleKeyHold(key) {
    if (key === 'Escape') {
      currentView.set(HomeView);
      return;
    }

    if (!inputKeys.includes(key)) {
      return;
    }

    const trackIndex = inputKeys.getTrackIndex(key);
    handleTrackHold(trackIndex);
  }

  /**
   * @param {string} key
   */
  function handleKeyRelease(key) {
    if (!inputKeys.includes(key)) {
      return;
    }

    const trackIndex = inputKeys.getTrackIndex(key);
    handleTrackRelease(trackIndex);
  }

  /**
   * @param {number} trackIndex
   */
  function handleTrackHold(trackIndex) {
    judger.holdKey(trackIndex);
    scroller.holdHitButton(trackIndex);
    SfxPlayer.playPrimaryHitSound();
  }

  /**
   * @param {number} trackIndex
   */
  function handleTrackRelease(trackIndex) {
    judger.releaseKey(trackIndex);
    scroller.releaseHitButton(trackIndex);
  }

  /**
   * @param {number} noteIndex
   * @param {number} holdTime
   */
  function handleJudgedHold(noteIndex, holdTime) {
    scroller.holdNote(noteIndex, holdTime);
  }

  function handleJudgedCombo() {
    scorer.considerCombo();
    SfxPlayer.playSecondaryHitSound();
  }

  /**
   * @param {number} noteIndex
   * @param {number} releaseTime
   */
  function handleJudgedRelease(noteIndex, releaseTime) {
    scroller.releaseNote(noteIndex, releaseTime);
    SfxPlayer.playSecondaryHitSound();
  }

  /**
   * @param {number} noteIndex
   * @param {'perfect'|'good'|'ok'|'miss'} judgement
   * @param {number} timeDiff
   */
  function handleJudgement(noteIndex, judgement, timeDiff) {
    scorer.considerJudgement(judgement, timeDiff);

    scroller.judgeNote(noteIndex, judgement);
    scroller.displayJudgement(judgement, timeDiff);
  }
</script>

<svelte:window
  use:gameKeyInput
  on:keyhold={({ detail: key }) => handleKeyHold(key)}
  on:keyrelease={({ detail: key }) => handleKeyRelease(key)}
/>

<Background />

<div class="game-view">
  <FullScroller bind:this={scroller} {beatmap} elapsedTime={$elapsedTime} />

  <StatsOverlay
    accuracy={$stats.accuracy}
    combo={$stats.combo}
    score={$stats.score}
  />
</div>

<TouchOverlay
  on:trackhold={({ detail: trackIndex }) => handleTrackHold(trackIndex)}
  on:trackrelease={({ detail: trackIndex }) => handleTrackRelease(trackIndex)}
/>

<style>
  .game-view {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: stretch;
  }
</style>
