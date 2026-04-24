import { create } from 'zustand';
import { Message } from './types';

const STORE_KEY = 'weinhao_store';

function loadState() {
  try {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state: any) {
  try {
    if (typeof window !== 'undefined') {
      const { isAgeVerified, isPremium, premiumExpiry, dailyChatCount, lastChatDate, messages, currentSound, soundEnabled } = state;
      localStorage.setItem(STORE_KEY, JSON.stringify({
        isAgeVerified, isPremium, premiumExpiry, dailyChatCount, lastChatDate,
        messages: messages.slice(-50), currentSound, soundEnabled
      }));
    }
  } catch {}
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const saved = loadState();

export const useAppStore = create((set, get) => ({
  isAgeVerified: saved.isAgeVerified ?? false,
  isPremium: saved.isPremium ?? false,
  premiumExpiry: saved.premiumExpiry ?? null,
  dailyChatCount: saved.dailyChatCount ?? 0,
  lastChatDate: saved.lastChatDate ?? getToday(),
  messages: saved.messages ?? [],
  currentSound: saved.currentSound ?? null,
  soundEnabled: saved.soundEnabled ?? true,

  setAgeVerified: (v) => { set({ isAgeVerified: v }); saveState(get()); },
  setPremium: (v, expiry) => { set({ isPremium: v, premiumExpiry: expiry ?? null }); saveState(get()); },
  addMessage: (msg) => {
    const m = { ...msg, id: Math.random().toString(36).slice(2), timestamp: Date.now() };
    set((s: any) => {
      const msgs = [...s.messages, m];
      return { messages: msgs, dailyChatCount: s.dailyChatCount + 1 };
    });
    saveState(get());
  },
  clearMessages: () => { set({ messages: [] }); saveState(get()); },
  setCurrentSound: (s) => { set({ currentSound: s }); saveState(get()); },
  toggleSound: () => { set((s: any) => ({ soundEnabled: !s.soundEnabled })); saveState(get()); },
  checkAndResetDaily: () => {
    const today = getToday();
    if (get().lastChatDate !== today) {
      set({ dailyChatCount: 0, lastChatDate: today });
      saveState(get());
    }
  },
  canChat: () => {
    get().checkAndResetDaily();
    return get().isPremium || get().dailyChatCount < 20;
  },
}));
