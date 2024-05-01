import EventEmitter from 'eventemitter3';
import { Ticker } from 'pixi.js';
import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';

export class Clock extends EventEmitter {
  /**
   * @param {number} initialTimestamp
   */
  constructor(initialTimestamp) {
    super();

    this._prevTimestamp = 0;

    /**
     * @type {number}
     */
    this._elapsedTime = initialTimestamp;

    /**
     * @type {Ticker}
     */
    this._ticker = new Ticker();
    this._ticker.add(this._updateElapsedTime, this);
  }

  get elapsedTime() {
    return this._elapsedTime;
  }

  finalize() {
    this._ticker.destroy();
  }

  start() {
    this._prevTimestamp = performance.now();

    this._ticker.start();
  }

  pause() {
    this._ticker.stop();
    this.emit('pause');
  }

  resume() {
    this._ticker.start();
    this.emit('resume');
  }

  /**
   * @param {number} timestamp
   */
  seek(timestamp) {
    this._elapsedTime = timestamp;
    this.emit('seek', this._elapsedTime);
  }

  _updateElapsedTime() {
    // Don't rely on pixi's delta* as it does not consider time elasped when the
    // tab is out of focus.
    const currTimestamp = performance.now();
    this._elapsedTime += currTimestamp - this._prevTimestamp;
    this._prevTimestamp = currTimestamp;

    this.emit('tick', this._elapsedTime);
  }
}

/**
 * Auto-finalizes the Clock's internal pixi.js Ticker if a component is destroyed.
 * @param {number} initialTimestamp
 * @returns {[Clock, import('svelte/store').Writable<number>]}
 */
export function createClock(initialTimestamp) {
  const clock = new Clock(initialTimestamp);
  const elapsedTime = writable(clock.elapsedTime);

  onDestroy(() => {
    clock.finalize();
  });

  clock.on('seek', et => {
    elapsedTime.set(et);
  });

  clock.on('tick', et => {
    elapsedTime.set(et);
  });

  return [clock, elapsedTime];
}
