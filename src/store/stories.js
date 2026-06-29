import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoriesStore = create(
  persist(
    (set, get) => ({
      // ── State ─────────────────────────────────────────────
      userStories: [],   // stories created by this user
      reactions: {},     // { storyId: 'understand'|'sendingSupport'|'notAlone'|'stayStrong' }
      savedIds: [],      // saved story IDs
      hiddenIds: [],     // hidden story IDs
      replies: {},       // { storyId: [...replies] }
      drafts: {
        content: '',
        visibility: 'Anonymous',
        category: '',
        mood: '',
        trigger: '',
      },

      // ── Actions ───────────────────────────────────────────

      /** Prepend a new story to the user's stories */
      addStory: (story) =>
        set((state) => ({
          userStories: [story, ...state.userStories],
        })),

      /** Toggle save/unsave a story */
      toggleSave: (id) =>
        set((state) => {
          const already = state.savedIds.includes(id);
          return {
            savedIds: already
              ? state.savedIds.filter((s) => s !== id)
              : [...state.savedIds, id],
          };
        }),

      /** Set or toggle off a reaction for a story */
      setReaction: (storyId, key) =>
        set((state) => {
          const current = state.reactions[storyId];
          if (current === key) {
            // toggle off
            const next = { ...state.reactions };
            delete next[storyId];
            return { reactions: next };
          }
          return { reactions: { ...state.reactions, [storyId]: key } };
        }),

      /** Add a reply to a story */
      addReply: (storyId, reply) =>
        set((state) => {
          const existing = state.replies[storyId] || [];
          return {
            replies: {
              ...state.replies,
              [storyId]: [...existing, reply],
            },
          };
        }),

      /** Delete a reply from a story */
      deleteReply: (storyId, replyId) =>
        set((state) => {
          const existing = state.replies[storyId] || [];
          return {
            replies: {
              ...state.replies,
              [storyId]: existing.filter((r) => r.id !== replyId),
            },
          };
        }),

      /** Hide a story from the feed */
      hideStory: (id) =>
        set((state) => ({
          hiddenIds: state.hiddenIds.includes(id)
            ? state.hiddenIds
            : [...state.hiddenIds, id],
        })),

      /** Delete one of the user's own stories */
      deleteStory: (id) =>
        set((state) => ({
          userStories: state.userStories.filter((s) => s.id !== id),
        })),

      /** Update draft fields */
      setDraft: (fields) =>
        set((state) => ({
          drafts: { ...state.drafts, ...fields },
        })),

      /** Clear the draft */
      clearDraft: () =>
        set(() => ({
          drafts: {
            content: '',
            visibility: 'Anonymous',
            category: '',
            mood: '',
            trigger: '',
          },
        })),
    }),
    {
      name: 'soul-stories-store',
      // persist everything
      partialize: (state) => state,
    }
  )
);
