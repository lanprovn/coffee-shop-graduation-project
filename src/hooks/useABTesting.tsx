import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ExperimentVariant[];
  trafficAllocation: number; // 0-100
  startDate: string;
  endDate?: string;
  targetAudience: {
    userIds?: string[];
    userSegments?: string[];
    conditions?: Record<string, any>;
  };
  metrics: {
    primary: string;
    secondary: string[];
  };
  results?: ExperimentResults;
}

interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficWeight: number; // 0-100
  configuration: Record<string, any>;
  isControl: boolean;
}

interface ExperimentResults {
  totalUsers: number;
  variants: {
    [variantId: string]: {
      users: number;
      conversions: number;
      conversionRate: number;
      confidence: number;
      isWinner: boolean;
    };
  };
  statisticalSignificance: number;
  winner?: string;
  status: 'inconclusive' | 'significant' | 'needs_more_data';
}

interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: string;
  converted: boolean;
  conversionValue?: number;
}

interface ABTestingState {
  experiments: Experiment[];
  userAssignments: UserAssignment[];
  activeExperiments: string[];
  userId?: string;
}

interface ABTestingActions {
  // Experiment management
  createExperiment: (experiment: Omit<Experiment, 'id' | 'results'>) => string;
  updateExperiment: (id: string, updates: Partial<Experiment>) => void;
  startExperiment: (id: string) => void;
  pauseExperiment: (id: string) => void;
  completeExperiment: (id: string) => void;
  
  // User assignment
  assignUserToExperiment: (userId: string, experimentId: string) => string | null;
  getUserVariant: (userId: string, experimentId: string) => string | null;
  
  // Conversion tracking
  trackConversion: (userId: string, experimentId: string, value?: number) => void;
  
  // Results calculation
  calculateResults: (experimentId: string) => ExperimentResults;
  
  // Utility functions
  isUserInExperiment: (userId: string, experimentId: string) => boolean;
  getActiveExperiments: () => Experiment[];
  getUserExperiments: (userId: string) => Experiment[];
  
  // Settings
  setUserId: (userId: string) => void;
}

export const useABTestingStore = create<ABTestingState & ABTestingActions>()(
  persist(
    (set, get) => ({
      // Initial state
      experiments: [],
      userAssignments: [],
      activeExperiments: [],
      userId: undefined,

      // Experiment management
      createExperiment: (experimentData) => {
        const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const experiment: Experiment = {
          ...experimentData,
          id,
          status: 'draft',
        };

        set((state) => ({
          experiments: [...state.experiments, experiment],
        }));

        return id;
      },

      updateExperiment: (id, updates) => {
        set((state) => ({
          experiments: state.experiments.map(exp =>
            exp.id === id ? { ...exp, ...updates } : exp
          ),
        }));
      },

      startExperiment: (id) => {
        set((state) => ({
          experiments: state.experiments.map(exp =>
            exp.id === id ? { ...exp, status: 'running', startDate: new Date().toISOString() } : exp
          ),
          activeExperiments: [...state.activeExperiments, id],
        }));
      },

      pauseExperiment: (id) => {
        set((state) => ({
          experiments: state.experiments.map(exp =>
            exp.id === id ? { ...exp, status: 'paused' } : exp
          ),
          activeExperiments: state.activeExperiments.filter(expId => expId !== id),
        }));
      },

      completeExperiment: (id) => {
        const results = get().calculateResults(id);
        
        set((state) => ({
          experiments: state.experiments.map(exp =>
            exp.id === id ? { ...exp, status: 'completed', endDate: new Date().toISOString(), results } : exp
          ),
          activeExperiments: state.activeExperiments.filter(expId => expId !== id),
        }));
      },

      // User assignment
      assignUserToExperiment: (userId, experimentId) => {
        const { experiments, userAssignments } = get();
        const experiment = experiments.find(exp => exp.id === experimentId);
        
        if (!experiment || experiment.status !== 'running') {
          return null;
        }

        // Check if user is already assigned
        const existingAssignment = userAssignments.find(
          assignment => assignment.userId === userId && assignment.experimentId === experimentId
        );

        if (existingAssignment) {
          return existingAssignment.variantId;
        }

        // Assign user to variant based on traffic weight
        const variant = selectVariant(experiment.variants);
        
        const assignment: UserAssignment = {
          userId,
          experimentId,
          variantId: variant.id,
          assignedAt: new Date().toISOString(),
          converted: false,
        };

        set((state) => ({
          userAssignments: [...state.userAssignments, assignment],
        }));

        return variant.id;
      },

      getUserVariant: (userId, experimentId) => {
        const { userAssignments } = get();
        const assignment = userAssignments.find(
          assignment => assignment.userId === userId && assignment.experimentId === experimentId
        );

        return assignment?.variantId || null;
      },

      // Conversion tracking
      trackConversion: (userId, experimentId, value) => {
        set((state) => ({
          userAssignments: state.userAssignments.map(assignment =>
            assignment.userId === userId && assignment.experimentId === experimentId
              ? { ...assignment, converted: true, conversionValue: value }
              : assignment
          ),
        }));
      },

      // Results calculation
      calculateResults: (experimentId) => {
        const { experiments, userAssignments } = get();
        const experiment = experiments.find(exp => exp.id === experimentId);
        
        if (!experiment) {
          throw new Error('Experiment not found');
        }

        const assignments = userAssignments.filter(
          assignment => assignment.experimentId === experimentId
        );

        const totalUsers = assignments.length;
        const variantResults: ExperimentResults['variants'] = {};

        // Calculate results for each variant
        experiment.variants.forEach(variant => {
          const variantAssignments = assignments.filter(
            assignment => assignment.variantId === variant.id
          );

          const users = variantAssignments.length;
          const conversions = variantAssignments.filter(assignment => assignment.converted).length;
          const conversionRate = users > 0 ? (conversions / users) * 100 : 0;

          // Calculate confidence (simplified)
          const confidence = calculateConfidence(users, conversions);

          variantResults[variant.id] = {
            users,
            conversions,
            conversionRate,
            confidence,
            isWinner: false,
          };
        });

        // Determine winner
        const variants = Object.values(variantResults);
        const bestVariant = variants.reduce((best, current) =>
          current.conversionRate > best.conversionRate ? current : best
        );

        // Mark winner
        Object.keys(variantResults).forEach(variantId => {
          if (variantResults[variantId].conversionRate === bestVariant.conversionRate) {
            variantResults[variantId].isWinner = true;
          }
        });

        const statisticalSignificance = calculateStatisticalSignificance(variantResults);
        
        const results: ExperimentResults = {
          totalUsers,
          variants: variantResults,
          statisticalSignificance,
          winner: statisticalSignificance > 95 ? Object.keys(variantResults).find(
            id => variantResults[id].isWinner
          ) : undefined,
          status: statisticalSignificance > 95 ? 'significant' : 
                 totalUsers < 100 ? 'needs_more_data' : 'inconclusive',
        };

        return results;
      },

      // Utility functions
      isUserInExperiment: (userId, experimentId) => {
        const { userAssignments } = get();
        return userAssignments.some(
          assignment => assignment.userId === userId && assignment.experimentId === experimentId
        );
      },

      getActiveExperiments: () => {
        const { experiments, activeExperiments } = get();
        return experiments.filter(exp => activeExperiments.includes(exp.id));
      },

      getUserExperiments: (userId) => {
        const { experiments, userAssignments } = get();
        const userExperimentIds = userAssignments
          .filter(assignment => assignment.userId === userId)
          .map(assignment => assignment.experimentId);
        
        return experiments.filter(exp => userExperimentIds.includes(exp.id));
      },

      // Settings
      setUserId: (userId) => {
        set({ userId });
      },
    }),
    {
      name: 'highland-ab-testing-store',
      partialize: (state) => ({
        experiments: state.experiments,
        userAssignments: state.userAssignments.slice(-1000), // Keep last 1000 assignments
        activeExperiments: state.activeExperiments,
        userId: state.userId,
      }),
    }
  )
);

// Helper functions
function selectVariant(variants: ExperimentVariant[]): ExperimentVariant {
  const random = Math.random() * 100;
  let cumulativeWeight = 0;

  for (const variant of variants) {
    cumulativeWeight += variant.trafficWeight;
    if (random <= cumulativeWeight) {
      return variant;
    }
  }

  return variants[0]; // Fallback
}

function calculateConfidence(users: number, conversions: number): number {
  if (users === 0) return 0;
  
  // Simplified confidence calculation
  const conversionRate = conversions / users;
  const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / users);
  const marginOfError = 1.96 * standardError; // 95% confidence interval
  
  return Math.max(0, Math.min(100, (1 - marginOfError) * 100));
}

function calculateStatisticalSignificance(variants: ExperimentResults['variants']): number {
  const variantValues = Object.values(variants);
  if (variantValues.length < 2) return 0;

  // Simplified statistical significance calculation
  const controlVariant = variantValues.find(v => v.isWinner);
  const testVariant = variantValues.find(v => !v.isWinner);

  if (!controlVariant || !testVariant) return 0;

  const controlRate = controlVariant.conversionRate / 100;
  const testRate = testVariant.conversionRate / 100;
  
  const pooledRate = (controlVariant.conversions + testVariant.conversions) / 
                    (controlVariant.users + testVariant.users);
  
  const standardError = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1/controlVariant.users + 1/testVariant.users)
  );
  
  const zScore = Math.abs(testRate - controlRate) / standardError;
  
  // Convert z-score to percentage
  return Math.min(100, Math.max(0, (1 - Math.exp(-zScore * zScore / 2)) * 100));
}

// Hook for easy A/B testing usage
export const useABTesting = () => {
  const {
    createExperiment,
    updateExperiment,
    startExperiment,
    pauseExperiment,
    completeExperiment,
    assignUserToExperiment,
    getUserVariant,
    trackConversion,
    calculateResults,
    isUserInExperiment,
    getActiveExperiments,
    getUserExperiments,
    setUserId,
    experiments,
    userAssignments,
    userId,
  } = useABTestingStore();

  // Auto-assign user to active experiments
  React.useEffect(() => {
    if (!userId) return;

    const activeExperiments = getActiveExperiments();
    activeExperiments.forEach(experiment => {
      if (!isUserInExperiment(userId, experiment.id)) {
        assignUserToExperiment(userId, experiment.id);
      }
    });
  }, [userId, getActiveExperiments, isUserInExperiment, assignUserToExperiment]);

  return {
    // Experiment management
    createExperiment,
    updateExperiment,
    startExperiment,
    pauseExperiment,
    completeExperiment,
    
    // User assignment
    assignUserToExperiment,
    getUserVariant,
    trackConversion,
    
    // Results
    calculateResults,
    
    // Utilities
    isUserInExperiment,
    getActiveExperiments,
    getUserExperiments,
    setUserId,
    
    // Data
    experiments,
    userAssignments,
    userId,
  };
};

export default useABTestingStore;
