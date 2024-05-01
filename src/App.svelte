<script>
  import { currentView } from './views/currentView';
</script>

{#if $currentView.component !== null}
  <svelte:component this={$currentView.component} {...$currentView.props} />
{/if}
