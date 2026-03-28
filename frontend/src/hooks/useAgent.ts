import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agentApi, progressApi, UserProfile, NutritionProfile } from '../services/api';

export interface AgentStatus {
  training: 'idle' | 'loading' | 'success' | 'error';
  skipping: 'idle' | 'loading' | 'success' | 'error';
  nutrition: 'idle' | 'loading' | 'success' | 'error';
  recovery: 'idle' | 'loading' | 'success' | 'error';
  mindset: 'idle' | 'loading' | 'success' | 'error';
  coordinator: 'idle' | 'loading' | 'success' | 'error';
}

export function useBlueprint() {
  const queryClient = useQueryClient();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    training: 'idle',
    skipping: 'idle',
    nutrition: 'idle',
    recovery: 'idle',
    mindset: 'idle',
    coordinator: 'idle',
  });

  const blueprintMutation = useMutation({
    mutationFn: async (data: {
      userProfile: UserProfile;
      nutritionProfile: NutritionProfile;
      userId?: string;
    }) => {
      setAgentStatus(prev => ({ ...prev, coordinator: 'loading' }));
      try {
        const response = await agentApi.generateBlueprint(data);
        setAgentStatus({
          training: 'success',
          skipping: 'success',
          nutrition: 'success',
          recovery: 'success',
          mindset: 'success',
          coordinator: 'success',
        });
        return response.data;
      } catch (error) {
        setAgentStatus(prev => ({ ...prev, coordinator: 'error' }));
        throw error;
      }
    },
    onSuccess: data => {
      queryClient.setQueryData(['blueprint'], data.blueprint);
    },
  });

  const savedBlueprint = useQuery({
    queryKey: ['blueprint'],
    queryFn: () => queryClient.getQueryData(['blueprint']),
    enabled: false,
  });

  return {
    generateBlueprint: blueprintMutation.mutate,
    blueprint: blueprintMutation.data?.blueprint || savedBlueprint.data,
    isLoading: blueprintMutation.isPending,
    isError: blueprintMutation.isError,
    error: blueprintMutation.error,
    agentStatus,
  };
}

export function useProgress(userId: string) {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      const response = await progressApi.getSummary(userId);
      return response.data.summary;
    },
    enabled: !!userId,
  });
}
