<script>
  import { animatedValue } from '../util/animatedValue';

  export let accuracy;
  export let combo;
  export let score;

  const animatedScore = animatedValue(score, 1000, 16);
  $: animatedScore.set(score);

  $: roundedAccuracy = Math.round(accuracy * 100) / 100;
  $: roundedScore = Math.round($animatedScore).toString().padStart(7, '0');
</script>

<div class="stats-overlay">
  <p class="score stat-text">{roundedScore}</p>

  <div class="side-stat-list">
    <p class="side-stat stat-text">{combo}×</p>
    <p class="side-stat-name stat-text">COMBO</p>

    <p class="side-stat stat-text">{roundedAccuracy}%</p>
    <p class="side-stat-name stat-text">ACCURACY</p>
  </div>
</div>

<style>
  .stats-overlay {
    position: fixed;
    width: 100%;
    padding: 1rem 2rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    user-select: none;
  }

  .side-stat-list {
    display: grid;
    grid-template-columns: auto auto;
    justify-items: flex-end;
    align-items: flex-end;
    column-gap: 0.5rem;

    font-size: 1.9rem;
  }

  .side-stat {
    font-size: 1em;
  }

  .side-stat-name {
    justify-self: flex-start;

    margin-bottom: 0.4em;

    font-size: 0.5em;
  }

  .stat-text {
    background: linear-gradient(0deg, #777, #ddd 40%, #fff);
    color: transparent;
    background-clip: text;

    font-family: 'Libre Baskerville', serif;
    font-weight: bold;
  }

  .score {
    font-size: 2.45rem;
  }
</style>
