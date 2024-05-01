import '@frsource/frs-hide-scrollbar';
import { Assets } from 'pixi.js';

import App from './App.svelte';
import HomeView from './views/HomeView.svelte';
import { currentView } from './views/currentView';

// @ts-ignore
import hit_button_png from './assets/sprites/hit_button.png';
// @ts-ignore
import hold_note_tail_mark_png from './assets/sprites/hold_note_tail_mark.png';
// @ts-ignore
import hold_note_tail_0_png from './assets/sprites/hold_note_tail_0.png';
// @ts-ignore
import hold_note_tail_1_png from './assets/sprites/hold_note_tail_1.png';
// @ts-ignore
import judgement_text_good_png from './assets/sprites/judgement_text_good.png';
// @ts-ignore
import judgement_text_great_png from './assets/sprites/judgement_text_great.png';
// @ts-ignore
import judgement_text_miss_png from './assets/sprites/judgement_text_miss.png';
// @ts-ignore
import judgement_text_ok_png from './assets/sprites/judgement_text_ok.png';
// @ts-ignore
import note_head_0_png from './assets/sprites/note_head_0.png';
// @ts-ignore
import note_head_1_png from './assets/sprites/note_head_1.png';
// @ts-ignore
import trick_note_head_0_png from './assets/sprites/trick_note_head_0.png';
// @ts-ignore
import trick_note_head_1_png from './assets/sprites/trick_note_head_1.png';
// @ts-ignore
import ur_bar_good_png from './assets/sprites/ur_bar_good.png';
// @ts-ignore
import ur_bar_marker_png from './assets/sprites/ur_bar_marker.png';
// @ts-ignore
import ur_bar_ok_png from './assets/sprites/ur_bar_ok.png';
// @ts-ignore
import ur_bar_perfect_png from './assets/sprites/ur_bar_perfect.png';

await Assets.load([
  {
    alias: 'hit_button',
    src: hit_button_png,
  },
  {
    alias: 'hold_note_tail_mark',
    src: hold_note_tail_mark_png,
  },
  {
    alias: 'hold_note_tail_0',
    src: hold_note_tail_0_png,
  },
  {
    alias: 'hold_note_tail_1',
    src: hold_note_tail_1_png,
  },
  {
    alias: 'judgement_text_good',
    src: judgement_text_good_png,
  },
  {
    alias: 'judgement_text_great',
    src: judgement_text_great_png,
  },
  {
    alias: 'judgement_text_miss',
    src: judgement_text_miss_png,
  },
  {
    alias: 'judgement_text_ok',
    src: judgement_text_ok_png,
  },
  {
    alias: 'note_head_0',
    src: note_head_0_png,
  },
  {
    alias: 'note_head_1',
    src: note_head_1_png,
  },
  {
    alias: 'trick_note_head_0',
    src: trick_note_head_0_png,
  },
  {
    alias: 'trick_note_head_1',
    src: trick_note_head_1_png,
  },
  {
    alias: 'ur_bar_good',
    src: ur_bar_good_png,
  },
  {
    alias: 'ur_bar_marker',
    src: ur_bar_marker_png,
  },
  {
    alias: 'ur_bar_ok',
    src: ur_bar_ok_png,
  },
  {
    alias: 'ur_bar_perfect',
    src: ur_bar_perfect_png,
  },
]);

new App({ target: document.body });
currentView.set(HomeView);
