<script>
  /**
   * @type {number}
   */
  export let currTime;

  /**
   * @type {number}
   */
  export let maxTime;

  $: sign = currTime < 0 ? '-' : ' ';
  $: currMMSSTime = toMMSS(currTime);
  $: maxMMSSTime = toMMSS(maxTime);

  $: currMsTime = Math.round(currTime);

  /**
   * @param {number} msTimestamp
   */
  function toMMSS(msTimestamp) {
    const minutes = Math.abs(Math.floor(msTimestamp / 60000));
    const seconds = Math.abs(Math.round((msTimestamp % 60000) / 1000));

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
  }
</script>

<p class="scrubber-time">
  {sign}{currMMSSTime}/{maxMMSSTime} <span>({currMsTime} ms)</span>
</p>

<style>
  .scrubber-time {
    flex-shrink: 0;

    min-width: 15em;
    text-align: center;

    font-family: 'Libre Baskerville', serif;
    font-size: 1rem;
  }

  .scrubber-time > span {
    margin-left: 0.2em;
  }
</style>
