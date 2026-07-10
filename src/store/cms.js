import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCmsStore = create(
  persist(
    (set, get) => ({
      // Draft management
      drafts: [],
      currentDraftId: null,
      currentGuide: null,
      isDirty: false,
      isSaving: false,
      lastSaved: null,

      // UI state
      activeTab: 'editor',
      previewMode: 'desktop',
      showPreview: false,

      // Actions
      setCurrentGuide(guide) {
        set({ currentGuide: guide, currentDraftId: guide?.id });
      },

      setIsDirty(dirty) {
        set({ isDirty: dirty });
      },

      setIsSaving(saving) {
        set({ isSaving: saving });
      },

      setLastSaved(time) {
        set({ lastSaved: time });
      },

      updateGuideField(field, value) {
        set((state) => ({
          currentGuide: {
            ...state.currentGuide,
            [field]: value,
          },
          isDirty: true,
        }));
      },

      updateGuideContent(section, value) {
        set((state) => ({
          currentGuide: {
            ...state.currentGuide,
            content_json: {
              ...state.currentGuide?.content_json,
              [section]: value,
            },
          },
          isDirty: true,
        }));
      },

      addDraft(draft) {
        set((state) => ({
          drafts: [...state.drafts, draft],
        }));
      },

      removeDraft(draftId) {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== draftId),
        }));
      },

      setActiveTab(tab) {
        set({ activeTab: tab });
      },

      setPreviewMode(mode) {
        set({ previewMode: mode });
      },

      setShowPreview(show) {
        set({ showPreview: show });
      },

      resetDraft() {
        set({
          currentGuide: null,
          currentDraftId: null,
          isDirty: false,
          isSaving: false,
          lastSaved: null,
        });
      },
    }),
    {
      name: 'cms-store',
    }
  )
);
