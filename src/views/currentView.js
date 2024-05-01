import { writable } from 'svelte/store';

function createCurrentView() {
  const { subscribe, set: setStore } = writable({
    component: null,
    props: {},
  });

  return {
    subscribe,

    /**
     * @param {import('svelte').ComponentType} component
     * @param {object=} props
     */
    set(component, props = null) {
      setStore({ component, props });
    },
  };
}

export const currentView = createCurrentView();
