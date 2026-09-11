import { useEffect, useState, useCallback } from 'react';

// Cross-browser helpers (Chrome/Edge/Firefox/Safari)
const getFullscreenElement = () =>
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement ||
  null;

const requestFullscreen = (el) => {
  const target = el || document.documentElement;
  const req =
    target.requestFullscreen ||
    target.webkitRequestFullscreen ||
    target.msRequestFullscreen;
  if (req) {
    return req.call(target).catch(() => {});
  }
  return Promise.resolve();
};

const exitFullscreen = () => {
  const exit =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (exit && getFullscreenElement()) {
    return exit.call(document).catch(() => {});
  }
  return Promise.resolve();
};

/**
 * Enforces a fullscreen, single-tab test environment.
 *
 * - Tracks whether the page is currently in fullscreen.
 * - Counts how many times the participant left fullscreen and/or switched
 *   away from the tab, so organizers can review it later if needed.
 * - Exposes `enterFullscreen()` to call from a button click (browsers only
 *   allow requestFullscreen() in response to a real user gesture).
 */
export function useFullscreenGuard({ enabled = true, onViolation } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(!!getFullscreenElement());
  const [tabHidden, setTabHidden] = useState(document.visibilityState === 'hidden');
  const [violationCount, setViolationCount] = useState(0);

  const enterFullscreen = useCallback(() => {
    return requestFullscreen(document.documentElement);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleFullscreenChange = () => {
      const fs = !!getFullscreenElement();
      setIsFullscreen(fs);
      if (!fs) {
        setViolationCount((c) => c + 1);
        onViolation?.('fullscreen-exit');
      }
    };

    const handleVisibilityChange = () => {
      const hidden = document.visibilityState === 'hidden';
      setTabHidden(hidden);
      if (hidden) {
        setViolationCount((c) => c + 1);
        onViolation?.('tab-hidden');
      }
    };

    const handleBlur = () => {
      onViolation?.('window-blur');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, onViolation]);

  return { isFullscreen, tabHidden, violationCount, enterFullscreen, exitFullscreen };
}
