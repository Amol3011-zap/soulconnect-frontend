import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEmotionLibraryStore = create(
  persist(
    (set) => ({
      // Data
      categories: [],
      guides: [],
      currentGuide: null,
      searchResults: [],
      assessmentResults: [],

      // UI State
      selectedCategory: null,
      searchQuery: '',
      sortBy: 'relevant',
      showAssessment: false,
      assessmentScore: null,

      // Loading
      isLoading: false,
      error: null,

      // Actions
      setCategories(categories) {
        set({ categories });
      },

      setGuides(guides) {
        set({ guides });
      },

      setCurrentGuide(guide) {
        set({ currentGuide: guide });
      },

      setSelectedCategory(categoryId) {
        set({ selectedCategory: categoryId });
      },

      setSearchQuery(query) {
        set({ searchQuery: query });
      },

      setSearchResults(results) {
        set({ searchResults: results });
      },

      setSortBy(sort) {
        set({ sortBy: sort });
      },

      setShowAssessment(show) {
        set({ showAssessment: show });
      },

      setAssessmentScore(score) {
        set({ assessmentScore: score });
      },

      saveAssessmentResult(result) {
        set((state) => ({
          assessmentResults: [...state.assessmentResults, result],
        }));
      },

      setIsLoading(loading) {
        set({ isLoading: loading });
      },

      setError(error) {
        set({ error });
      },

      reset() {
        set({
          selectedCategory: null,
          searchQuery: '',
          searchResults: [],
          currentGuide: null,
          showAssessment: false,
          assessmentScore: null,
        });
      },
    }),
    {
      name: 'emotion-library-store',
      partialize: (state) => ({
        categories: state.categories,
        guides: state.guides,
        assessmentResults: state.assessmentResults,
      }),
    }
  )
);
