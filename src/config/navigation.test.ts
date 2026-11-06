import { describe, expect, it } from 'vitest';
import { AI_CAPABILITIES, NAVIGATION, PAGE_BY_PATH, PAGES } from './navigation';

describe('administration route catalogue', () => {
  it('has unique IDs and browser paths for all navigation entries', () => {
    const ids = PAGES.map((page) => page.id);
    const paths = PAGES.map((page) => page.path);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(PAGE_BY_PATH.size).toBe(PAGES.length);
  });

  it('groups every route and includes the twelve requested AI capabilities', () => {
    expect(NAVIGATION.flatMap((group) => group.items)).toHaveLength(PAGES.length);
    expect(AI_CAPABILITIES).toHaveLength(12);
    expect(new Set(AI_CAPABILITIES.map((capability) => capability.name)).size).toBe(12);
  });
});
