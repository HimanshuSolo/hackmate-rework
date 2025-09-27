'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { FilterOptions, WorkingStyle, CollaborationPref, StartupStage } from '../../types'
import { 
  WORKING_STYLE_LABELS, 
  COLLABORATION_PREF_LABELS, 
  STARTUP_STAGE_LABELS, 
  DEFAULT_FILTERS,
} from '../../constants'
import { fetchAvailableSkillsAndDomains } from '@/lib/filter-utils'
import { M_PLUS_1p } from "next/font/google"


const mPlus1p = M_PLUS_1p({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700']
})

interface FilterPanelProps {
  filters: FilterOptions
  userCoordinates: { latitude: number; longitude: number; geohash: string } | null
  isSavingLocation: boolean
  locationPermissionRequested: boolean
  requestLocationPermission: () => void
  handleFilterChange: (newFilters: Partial<FilterOptions>) => void
  onClose?: () => void
  isDesktop?: boolean
}

export default function FilterPanel({
  filters,
  handleFilterChange,
  onClose,
}: FilterPanelProps) {
  // State for skills and domains
  const [allSkills, setAllSkills] = useState<string[]>([])
  const [allDomains, setAllDomains] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch skills and domains on component mount
  useEffect(() => {
    const loadSkillsAndDomains = async () => {
      setIsLoading(true)
      try {
        const { allSkills, allDomains } = await fetchAvailableSkillsAndDomains()
        setAllSkills(allSkills)
        setAllDomains(allDomains)
      } catch (error) {
        console.error('Error loading skills and domains:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSkillsAndDomains()
  }, [])
  
  // Toggle handlers
  const toggleSkill = (skill: string) => {
    handleFilterChange({
      skills: filters.skills.includes(skill)
        ? filters.skills.filter(s => s !== skill)
        : [...filters.skills, skill]
    })
  }

  const toggleDomain = (domain: string) => {
    handleFilterChange({
      domains: filters.domains.includes(domain)
        ? filters.domains.filter(d => d !== domain)
        : [...filters.domains, domain]
    })
  }

  const toggleWorkingStyle = (style: WorkingStyle) => {
    handleFilterChange({
      workingStyles: filters.workingStyles.includes(style)
        ? filters.workingStyles.filter(s => s !== style)
        : [...filters.workingStyles, style]
    })
  }

  const toggleCollaborationPref = (pref: CollaborationPref) => {
    handleFilterChange({
      collaborationPrefs: filters.collaborationPrefs.includes(pref)
        ? filters.collaborationPrefs.filter(p => p !== pref)
        : [...filters.collaborationPrefs, pref]
    })
  }

  const toggleStartupStage = (stage: StartupStage) => {
    handleFilterChange({
      startupStages: filters.startupStages?.includes(stage)
        ? filters.startupStages.filter(s => s !== stage)
        : [...(filters.startupStages || []), stage]
    })
  }
  
  return (
    <div className={`space-y-8 ${mPlus1p.className}`}>
      {/* Experience Range */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Years of Experience</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{filters.experienceRange[0]} yr</span>
            <span>{filters.experienceRange[1]} yr</span>
          </div>
          <Slider
            value={filters.experienceRange}
            min={0}
            max={15}
            step={1}
            onValueChange={value => handleFilterChange({ experienceRange: [value[0], value[1]] })}
            className="accent-blue-500"
          />
        </div>
      </div>

      {/* Working Style */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Working Style</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(WORKING_STYLE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`style-${value}`}
                checked={filters.workingStyles.includes(value as WorkingStyle)}
                onCheckedChange={() => toggleWorkingStyle(value as WorkingStyle)}
                className="border-neutral-700 bg-neutral-900 checked:bg-blue-500/40"
              />
              <Label htmlFor={`style-${value}`} className="text-sm text-white/75">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Preference */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Collaboration Preference</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(COLLABORATION_PREF_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`collab-${value}`}
                checked={filters.collaborationPrefs.includes(value as CollaborationPref)}
                onCheckedChange={() => toggleCollaborationPref(value as CollaborationPref)}
                className="border-neutral-700 bg-neutral-900 checked:bg-blue-500/40"
              />
              <Label htmlFor={`collab-${value}`} className="text-sm text-white/75">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Skills</h3>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-500/80" />
            <span className="text-white/80">Loading skills...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <Badge
                key={skill}
                variant={filters.skills.includes(skill) ? "default" : "outline"}
                className={`cursor-pointer ${filters.skills.includes(skill) ? 'bg-blue-500/40 text-white' : 'border-white/20 text-white/65'} transition-all`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Domains */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Domain Expertise</h3>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-500/80" />
            <span className="text-white/80">Loading domains...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allDomains.map(domain => (
              <Badge
                key={domain}
                variant={filters.domains.includes(domain) ? "default" : "outline"}
                className={`cursor-pointer ${filters.domains.includes(domain) ? 'bg-blue-500/40 text-white' : 'border-white/20 text-white/65'} transition-all`}
                onClick={() => toggleDomain(domain)}
              >
                {domain}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Startup Stage */}
      <div>
        <h3 className="text-base font-semibold text-white/85 mb-2">Startup Stage</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(STARTUP_STAGE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`stage-${value}`}
                checked={filters.startupStages?.includes(value as StartupStage)}
                onCheckedChange={() => toggleStartupStage(value as StartupStage)}
                className="border-neutral-700 bg-neutral-900 checked:bg-blue-500/40"
              />
              <Label htmlFor={`stage-${value}`} className="text-sm text-white/75">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => handleFilterChange(DEFAULT_FILTERS)}
          className="border-white/20 text-white/85 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all"
        >
          Reset Filters
        </Button>
        <Button
          onClick={onClose}
          className="bg-blue-500/40 text-white rounded-md hover:bg-blue-700/70 transition-all"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}