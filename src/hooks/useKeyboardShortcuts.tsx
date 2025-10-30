import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
  disabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow certain shortcuts even in input fields
        if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 'k')) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !shortcut.ctrlKey || event.ctrlKey || event.metaKey;
        const shiftMatch = !shortcut.shiftKey || event.shiftKey;
        const altMatch = !shortcut.altKey || event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Check if all required modifiers are pressed
          if (
            (shortcut.ctrlKey && !event.ctrlKey && !event.metaKey) ||
            (shortcut.shiftKey && !event.shiftKey) ||
            (shortcut.altKey && !event.altKey)
          ) {
            continue;
          }

          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
