export const SETTINGS_OPEN_EVENT = 'multi-ai-panel:open-settings';
export const SETTINGS_OPEN_STORAGE_KEYS = {
  OPEN: 'multi-ai-panel.openSettings',
  E2E: 'multi-ai-panel.e2e',
} as const;
export const SETTINGS_WINDOW_HOOK = '__agentGangGang';
export const SETTINGS_VISIBILITY_HOOK = '__agentGangGangShowSettings';

export const shouldOpenSettingsFromUrl = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openSettings') === '1' || params.get('e2e') === '1') return true;

    const href = window.location.href;
    if (href.includes('openSettings=1') || href.includes('e2e=1')) return true;

    const hash = window.location.hash;
    if (hash.includes('settings')) return true;

    const localOpen = window.localStorage?.getItem(SETTINGS_OPEN_STORAGE_KEYS.OPEN);
    const localE2e = window.localStorage?.getItem(SETTINGS_OPEN_STORAGE_KEYS.E2E);
    if (localOpen === '1' || localE2e === '1') {
      window.localStorage?.removeItem(SETTINGS_OPEN_STORAGE_KEYS.OPEN);
      window.localStorage?.removeItem(SETTINGS_OPEN_STORAGE_KEYS.E2E);
      return true;
    }
  } catch {
    // ignore url/localStorage parsing errors
  }

  return false;
};
