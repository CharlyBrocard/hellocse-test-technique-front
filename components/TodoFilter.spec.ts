import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoFilter, { type FilterValue } from './TodoFilter.vue';

describe('TodoFilter', () => {
  const baseProps: {
    currentFilter: FilterValue;
    activeCount: number;
    completedCount: number;
  } = {
    currentFilter: 'all',
    activeCount: 2,
    completedCount: 1,
  };
  it('vérifie les label des btn', () => {
    const wrapper = mount(TodoFilter, { props: baseProps });
    const buttons = wrapper.findAll('button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0]?.text()).toContain('Toutes');
    expect(buttons[1]?.text()).toContain('À faire');
    expect(buttons[2]?.text()).not.toContain('Finished');
    expect(buttons[2]?.text()).toContain('Terminées');
  });

  it('affiche les compteurs actif/terminé reçus en props', () => {
    const wrapper = mount(TodoFilter, { props: baseProps });

    expect(wrapper.text()).toContain('2');
    expect(wrapper.text()).toContain('1');
    expect(wrapper.text()).not.toContain('3');
  });

  it('émet event filterChange au clic sur un bouton', async () => {
    const wrapper = mount(TodoFilter, { props: baseProps });
    const buttons = wrapper.findAll('button');

    await buttons[1]?.trigger('click');

    expect(wrapper.emitted('filterChange')).toBeTruthy();
  });
});
