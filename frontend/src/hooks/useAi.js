import { useState, useEffect, useCallback } from 'react';
import { ai as aiApi } from '../utils/api';
import { useAuthContext } from '../contexts/AuthContext';

export function useAi() {
  const [predictions, setPredictions] = useState(null);
  const [optimizations, setOptimizations] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthContext();

  const fetchAiData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [
        predictionsResponse,
        optimizationsResponse,
        insightsResponse
      ] = await Promise.all([
        aiApi.getPredictions().catch(err => {
          console.error('Error fetching predictions:', err);
          return { data: { nextMonth: { expectedSpending: 0, topCategories: [], recommendations: [] } } };
        }),
        aiApi.getOptimizations().catch(err => {
          console.error('Error fetching optimizations:', err);
          return { data: { suggestions: [], potentialSavings: { monthly: 0, annual: 0, percentage: 0 } } };
        }),
        aiApi.getInsights().catch(err => {
          console.error('Error fetching insights:', err);
          return { 
            data: { 
              spendingPatterns: {
                weekdayVsWeekend: { weekday: 0, weekend: 0 },
                timeOfDay: { morning: 0, afternoon: 0, evening: 0 }
              },
              recommendations: [],
              unusualActivity: { found: false, details: [] }
            }
          };
        })
      ]);

      setPredictions(predictionsResponse.data);
      setOptimizations(optimizationsResponse.data);
      setInsights(insightsResponse.data);
    } catch (err) {
      console.error('Error fetching AI data:', err);
      setError(err.message || 'Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAiData();
  }, [fetchAiData]);

  const getFormattedPredictions = useCallback(() => {
    if (!predictions) return {
      expectedSpending: 0,
      topCategories: [],
      recommendations: []
    };

    return {
      expectedSpending: predictions.nextMonth?.expectedSpending || 0,
      topCategories: predictions.nextMonth?.topCategories || [],
      recommendations: predictions.nextMonth?.recommendations || []
    };
  }, [predictions]);

  const getFormattedOptimizations = useCallback(() => {
    if (!optimizations) return {
      suggestions: [],
      potentialSavings: {
        monthly: 0,
        annual: 0,
        percentage: 0
      }
    };

    return {
      suggestions: optimizations.suggestions || [],
      potentialSavings: {
        monthly: optimizations.potentialSavings?.monthly || 0,
        annual: optimizations.potentialSavings?.annual || 0,
        percentage: optimizations.potentialSavings?.percentage || 0
      }
    };
  }, [optimizations]);

  const getFormattedInsights = useCallback(() => {
    if (!insights) return {
      spendingPatterns: {
        weekdayVsWeekend: { weekday: 0, weekend: 0 },
        timeOfDay: { morning: 0, afternoon: 0, evening: 0 }
      },
      recommendations: [],
      unusualActivity: {
        found: false,
        details: []
      }
    };

    return {
      spendingPatterns: insights.spendingPatterns || {
        weekdayVsWeekend: { weekday: 0, weekend: 0 },
        timeOfDay: { morning: 0, afternoon: 0, evening: 0 }
      },
      recommendations: insights.recommendations || [],
      unusualActivity: insights.unusualActivity || {
        found: false,
        details: []
      }
    };
  }, [insights]);

  return {
    loading,
    error,
    predictions: getFormattedPredictions(),
    optimizations: getFormattedOptimizations(),
    insights: getFormattedInsights(),
    refreshAiData: fetchAiData
  };
}
