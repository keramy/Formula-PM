import { useState, useCallback } from 'react';

/**
 * Custom hook for managing dialog state
 * Provides a centralized way to handle all dialog operations
 */
export const useDialogManager = () => {
  // Consolidated dialog state
  const [dialogState, setDialogState] = useState({
    currentTab: 0,
    createProjectDialogOpen: false,
    editProjectDialogOpen: false,
    viewProjectDialogOpen: false,
    selectedProjectForEdit: null,
    selectedProjectForView: null,
    scopeDialogOpen: false,
    selectedProjectForScope: null,
    addTeamMemberDialogOpen: false,
    addClientDialogOpen: false,
    addTaskDialogOpen: false,
    editTaskDialogOpen: false,
    viewTaskDialogOpen: false,
    selectedTaskForEdit: null,
    selectedTaskForView: null,
    teamMemberDetailOpen: false,
    selectedMemberForDetail: null,
    globalSearch: ''
  });

  // Helper function to update dialog state
  const updateDialogState = useCallback((updates) => {
    setDialogState(prev => ({ ...prev, ...updates }));
  }, []);

  // Project dialog helpers
  const openCreateProjectDialog = useCallback(() => {
    updateDialogState({ createProjectDialogOpen: true });
  }, [updateDialogState]);

  const closeCreateProjectDialog = useCallback(() => {
    updateDialogState({ createProjectDialogOpen: false });
  }, [updateDialogState]);

  const openEditProjectDialog = useCallback((project) => {
    updateDialogState({
      selectedProjectForEdit: project,
      editProjectDialogOpen: true
    });
  }, [updateDialogState]);

  const closeEditProjectDialog = useCallback(() => {
    updateDialogState({
      editProjectDialogOpen: false,
      selectedProjectForEdit: null
    });
  }, [updateDialogState]);

  const openViewProjectDialog = useCallback((project) => {
    updateDialogState({
      selectedProjectForView: project,
      viewProjectDialogOpen: true
    });
  }, [updateDialogState]);

  const closeViewProjectDialog = useCallback(() => {
    updateDialogState({
      viewProjectDialogOpen: false,
      selectedProjectForView: null
    });
  }, [updateDialogState]);

  const openScopeDialog = useCallback((project) => {
    updateDialogState({
      selectedProjectForScope: project,
      scopeDialogOpen: true
    });
  }, [updateDialogState]);

  const closeScopeDialog = useCallback(() => {
    updateDialogState({
      scopeDialogOpen: false,
      selectedProjectForScope: null
    });
  }, [updateDialogState]);

  // Task dialog helpers
  const openAddTaskDialog = useCallback(() => {
    updateDialogState({ addTaskDialogOpen: true });
  }, [updateDialogState]);

  const closeAddTaskDialog = useCallback(() => {
    updateDialogState({ addTaskDialogOpen: false });
  }, [updateDialogState]);

  const openEditTaskDialog = useCallback((task) => {
    updateDialogState({
      selectedTaskForEdit: task,
      editTaskDialogOpen: true
    });
  }, [updateDialogState]);

  const closeEditTaskDialog = useCallback(() => {
    updateDialogState({
      editTaskDialogOpen: false,
      selectedTaskForEdit: null
    });
  }, [updateDialogState]);

  const openViewTaskDialog = useCallback((task) => {
    updateDialogState({
      selectedTaskForView: task,
      viewTaskDialogOpen: true
    });
  }, [updateDialogState]);

  const closeViewTaskDialog = useCallback(() => {
    updateDialogState({
      viewTaskDialogOpen: false,
      selectedTaskForView: null
    });
  }, [updateDialogState]);

  // Team member dialog helpers
  const openAddTeamMemberDialog = useCallback(() => {
    updateDialogState({ addTeamMemberDialogOpen: true });
  }, [updateDialogState]);

  const closeAddTeamMemberDialog = useCallback(() => {
    updateDialogState({ addTeamMemberDialogOpen: false });
  }, [updateDialogState]);

  const openTeamMemberDetail = useCallback((member) => {
    updateDialogState({
      selectedMemberForDetail: member,
      teamMemberDetailOpen: true
    });
  }, [updateDialogState]);

  const closeTeamMemberDetail = useCallback(() => {
    updateDialogState({
      teamMemberDetailOpen: false,
      selectedMemberForDetail: null
    });
  }, [updateDialogState]);

  // Client dialog helpers
  const openAddClientDialog = useCallback(() => {
    updateDialogState({ addClientDialogOpen: true });
  }, [updateDialogState]);

  const closeAddClientDialog = useCallback(() => {
    updateDialogState({ addClientDialogOpen: false });
  }, [updateDialogState]);

  // Tab and search helpers
  const setCurrentTab = useCallback((tab) => {
    updateDialogState({ currentTab: tab });
  }, [updateDialogState]);

  const setGlobalSearch = useCallback((search) => {
    updateDialogState({ globalSearch: search });
  }, [updateDialogState]);

  return {
    // State
    dialogState,
    updateDialogState,

    // Extracted values
    currentTab: dialogState.currentTab,
    globalSearch: dialogState.globalSearch,

    // Project dialogs
    openCreateProjectDialog,
    closeCreateProjectDialog,
    openEditProjectDialog,
    closeEditProjectDialog,
    openViewProjectDialog,
    closeViewProjectDialog,
    openScopeDialog,
    closeScopeDialog,

    // Task dialogs
    openAddTaskDialog,
    closeAddTaskDialog,
    openEditTaskDialog,
    closeEditTaskDialog,
    openViewTaskDialog,
    closeViewTaskDialog,

    // Team member dialogs
    openAddTeamMemberDialog,
    closeAddTeamMemberDialog,
    openTeamMemberDetail,
    closeTeamMemberDetail,

    // Client dialogs
    openAddClientDialog,
    closeAddClientDialog,

    // Tab and search
    setCurrentTab,
    setGlobalSearch
  };
};