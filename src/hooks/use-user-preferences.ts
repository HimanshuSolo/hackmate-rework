/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FilterOptions } from '../types'
import { DEFAULT_FILTERS, DEFAULT_USER_PREFERENCES } from '../constants'

export function useUserPreferences() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)
  
  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      setIsLoadingPreferences(true)
      try {
        // In a real app, you'd fetch this from your API
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        
        if (filters.preferencesFromProfile) {
          setFilters(prev => ({
            ...prev,
            workingStyles: [DEFAULT_USER_PREFERENCES.workingStyle],
            collaborationPrefs: [DEFAULT_USER_PREFERENCES.collaborationPref],
            // Only use some of the user's skills and domains as filters
            skills: DEFAULT_USER_PREFERENCES.skills.slice(0, 1),
            domains: DEFAULT_USER_PREFERENCES.domainExpertise.slice(0, 1),
            location: DEFAULT_USER_PREFERENCES.location,
            maxDistance: DEFAULT_USER_PREFERENCES.maxDistance,
            enableLocationBasedMatching: DEFAULT_USER_PREFERENCES.enableLocationBasedMatching
          }))
        }
      } catch (error) {
        console.error("Failed to load preferences:", error)
        toast({
          title: "Failed to load preferences",
          description: "We couldn't load your preferences. Using default settings instead.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingPreferences(false)
      }
    }
    
    loadUserPreferences()
  }, [])
  
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }
  
  return {
    filters,
    setFilters,
    isLoadingPreferences,
    handleFilterChange
  }
}