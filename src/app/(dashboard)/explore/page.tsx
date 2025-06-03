'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Heart,
  X,
  Filter,
  Briefcase,
  Clock,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Types based on your Prisma schema
type WorkingStyle = 'ASYNC' | 'REAL_TIME' | 'FLEXIBLE' | 'STRUCTURED'
type CollaborationPref = 'REMOTE' | 'HYBRID' | 'IN_PERSON' | 'DOESNT_MATTER'
type StartupStage = 'IDEA' | 'MVP' | 'SCALING' | 'EXITED'
type CommitmentLevel = 'EXPLORING' | 'BUILDING' | 'LAUNCHING' | 'FULL_TIME_READY'

type Project = {
  id: string
  name: string
  description: string
  link?: string
}

type StartupInfo = {
  startupStage: StartupStage
  startupGoals: string
  startupCommitment: CommitmentLevel
  lookingFor: string[]
}

type User = {
  id: string
  name: string
  avatarUrl?: string
  location: string
  personalityTags: string[]
  workingStyle: WorkingStyle
  collaborationPref: CollaborationPref
  currentRole: string
  yearsExperience: number
  domainExpertise: string[]
  skills: string[]
  rolesOpenTo: string[]
  pastProjects: Project[]
  startupInfo?: StartupInfo
  calendarLink?: string
  socialLinks?: { platform: string, url: string }[]
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Morgan",
    avatarUrl: "https://github.com/shadcn.png",
    location: "San Francisco, CA",
    personalityTags: ["Problem Solver", "Creative", "Team Player"],
    workingStyle: "FLEXIBLE",
    collaborationPref: "HYBRID",
    currentRole: "Senior Software Engineer",
    yearsExperience: 5,
    domainExpertise: ["SaaS", "FinTech"],
    skills: ["JavaScript", "React", "Node.js"],
    rolesOpenTo: ["Technical Co-Founder", "CTO"],
    pastProjects: [
      {
        id: "p1",
        name: "AI-Powered Financial Assistant",
        description: "Built a personal finance management tool using ML algorithms"
      }
    ],
    startupInfo: {
      startupStage: "MVP",
      startupGoals: "Building a next-generation fintech platform for small businesses",
      startupCommitment: "FULL_TIME_READY",
      lookingFor: ["Business Development", "Marketing"]
    },
    calendarLink: "https://cal.com/alexmorgan",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/alexmorgan" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/alexmorgan" }
    ]
  },
  {
    id: "2",
    name: "Jamie Lee",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    location: "New York, NY",
    personalityTags: ["Strategic Thinker", "Innovative", "Leader"],
    workingStyle: "ASYNC",
    collaborationPref: "REMOTE",
    currentRole: "Product Manager",
    yearsExperience: 8,
    domainExpertise: ["E-commerce", "Marketplace"],
    skills: ["Product Management", "UX Research", "Agile"],
    rolesOpenTo: ["Co-Founder", "Product Lead"],
    pastProjects: [
      {
        id: "p2",
        name: "Multi-vendor Marketplace Platform",
        description: "Led development of a marketplace connecting local businesses with customers"
      }
    ],
    calendarLink: "https://cal.com/jamielee",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/jamielee" },
      { platform: "Portfolio", url: "https://jamielee.design" }
    ]
  },
  {
    id: "3",
    name: "Taylor Kim",
    avatarUrl: "https://i.pravatar.cc/150?img=49",
    location: "Austin, TX",
    personalityTags: ["Fast Learner", "Detail-Oriented", "Team Player"],
    workingStyle: "STRUCTURED",
    collaborationPref: "IN_PERSON",
    currentRole: "Frontend Developer",
    yearsExperience: 3,
    domainExpertise: ["EdTech", "SaaS"],
    skills: ["React", "TypeScript", "UI/UX Design"],
    rolesOpenTo: ["Technical Co-Founder", "Frontend Lead"],
    pastProjects: [
      {
        id: "p3",
        name: "Interactive Learning Platform",
        description: "Built responsive web app for online education"
      }
    ],
    startupInfo: {
      startupStage: "IDEA",
      startupGoals: "Creating an adaptive learning platform using AI",
      startupCommitment: "BUILDING",
      lookingFor: ["Backend Developer", "ML Engineer"]
    },
    calendarLink: "https://cal.com/taylorkim",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/taylorkim" },
      { platform: "Twitter", url: "https://twitter.com/taylorkim" }
    ]
  },
  {
    id: "4",
    name: "Jordan Smith",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    location: "Seattle, WA",
    personalityTags: ["Analytical", "Self-Motivated", "Innovative"],
    workingStyle: "REAL_TIME",
    collaborationPref: "HYBRID",
    currentRole: "Data Scientist",
    yearsExperience: 6,
    domainExpertise: ["AI/ML", "HealthTech"],
    skills: ["Python", "Machine Learning", "Data Analysis"],
    rolesOpenTo: ["Technical Co-Founder", "AI Lead"],
    pastProjects: [
      {
        id: "p4",
        name: "Predictive Healthcare Analytics",
        description: "Developed ML models to predict patient outcomes"
      }
    ],
    calendarLink: "https://cal.com/jordansmith",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/jordansmith" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/jordansmith" }
    ]
  },
  {
    id: "5",
    name: "Casey Parker",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    location: "Los Angeles, CA",
    personalityTags: ["Creative", "Team Player", "Strategic Thinker"],
    workingStyle: "FLEXIBLE",
    collaborationPref: "DOESNT_MATTER",
    currentRole: "UX Designer",
    yearsExperience: 4,
    domainExpertise: ["Consumer Apps", "E-commerce"],
    skills: ["UI/UX Design", "Figma", "User Research"],
    rolesOpenTo: ["Design Co-Founder", "Creative Director"],
    pastProjects: [
      {
        id: "p5",
        name: "E-commerce Mobile App",
        description: "Designed intuitive shopping experience for fashion retailer"
      }
    ],
    startupInfo: {
      startupStage: "MVP",
      startupGoals: "Building a design-focused social commerce platform",
      startupCommitment: "LAUNCHING",
      lookingFor: ["Frontend Developer", "Marketing Expert"]
    },
    calendarLink: "https://cal.com/caseyparker",
    socialLinks: [
      { platform: "Dribbble", url: "https://dribbble.com/caseyparker" },
      { platform: "Portfolio", url: "https://caseyparker.design" }
    ]
  }
];

const workingStyleLabels = {
  ASYNC: "Async",
  REAL_TIME: "Real-time",
  FLEXIBLE: "Flexible",
  STRUCTURED: "Structured"
};

const collaborationPrefLabels = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  IN_PERSON: "In-person",
  DOESNT_MATTER: "Flexible"
};

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <Github className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Twitter: <Twitter className="h-4 w-4" />,
  Portfolio: <Globe className="h-4 w-4" />,
  Medium: <ExternalLink className="h-4 w-4" />,
  YouTube: <ExternalLink className="h-4 w-4" />,
  Behance: <ExternalLink className="h-4 w-4" />,
  Dribbble: <ExternalLink className="h-4 w-4" />
};

type FilterOptions = {
  skills: string[]
  domains: string[]
  workingStyles: WorkingStyle[]
  collaborationPrefs: CollaborationPref[]
  experienceRange: [number, number]
  startupStages?: StartupStage[]
  location?: string
  maxDistance?: number
}

export default function Explore() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<string[]>([])
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null)
  const [matchDialogOpen, setMatchDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    skills: [],
    domains: [],
    workingStyles: [],
    collaborationPrefs: [],
    experienceRange: [0, 15],
    startupStages: [],
    location: '',
    maxDistance: 50
  })

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  // All available options for filters derived from mock data
  const allSkills = useMemo(() => 
    Array.from(new Set(mockUsers.flatMap(user => user.skills))), 
    []
  )
  
  const allDomains = useMemo(() => 
    Array.from(new Set(mockUsers.flatMap(user => user.domainExpertise))), 
    []
  )

  // Apply filters to users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      // Filter by skills if any selected
      if (filters.skills.length > 0 && 
          !filters.skills.some(skill => user.skills.includes(skill))) {
        return false
      }
      
      // Filter by domains if any selected
      if (filters.domains.length > 0 && 
          !filters.domains.some(domain => user.domainExpertise.includes(domain))) {
        return false
      }
      
      // Filter by working style if any selected
      if (filters.workingStyles.length > 0 && 
          !filters.workingStyles.includes(user.workingStyle)) {
        return false
      }
      
      // Filter by collaboration preference if any selected
      if (filters.collaborationPrefs.length > 0 && 
          !filters.collaborationPrefs.includes(user.collaborationPref)) {
        return false
      }
      
      // Filter by experience range
      if (user.yearsExperience < filters.experienceRange[0] || 
          user.yearsExperience > filters.experienceRange[1]) {
        return false
      }
      
      // Filter by startup stage if any selected
      if (filters.startupStages && filters.startupStages.length > 0 && 
          (!user.startupInfo || !filters.startupStages.includes(user.startupInfo.startupStage))) {
        return false
      }
      
      // Filter by location (in a real app, you'd use geolocation)
      if (filters.location && !user.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [filters, mockUsers])

  const activeUser = filteredUsers[currentIndex]
  
  // For swipe card animation
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  
  // Background color based on swipe direction
  const likeOpacity = useTransform(x, [0, 125], [0, 1])
  const nopeOpacity = useTransform(x, [-125, 0], [1, 0])
  
  // Handle swipe actions
  const handleLike = () => {
    if (!activeUser || currentIndex >= filteredUsers.length) return
    
    // Add to matches and show match dialog
    if (!matches.includes(activeUser.id)) {
      setMatches(prev => [...prev, activeUser.id])
      setSelectedMatch(activeUser)
      setMatchDialogOpen(true)
    }
    
    // Animate card exit
    x.set(400)
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      x.set(0)
    }, 300)
  }
  
  const handlePass = () => {
    if (!activeUser || currentIndex >= filteredUsers.length) return
    
    // Animate card exit
    x.set(-400)
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      x.set(0)
    }, 300)
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
    // Reset to first user when filters change
    setCurrentIndex(0)
  }

  // Toggle for filter checkboxes
  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleDomain = (domain: string) => {
    setFilters(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }))
  }

  const toggleWorkingStyle = (style: WorkingStyle) => {
    setFilters(prev => ({
      ...prev,
      workingStyles: prev.workingStyles.includes(style)
        ? prev.workingStyles.filter(s => s !== style)
        : [...prev.workingStyles, style]
    }))
  }

  const toggleCollaborationPref = (pref: CollaborationPref) => {
    setFilters(prev => ({
      ...prev,
      collaborationPrefs: prev.collaborationPrefs.includes(pref)
        ? prev.collaborationPrefs.filter(p => p !== pref)
        : [...prev.collaborationPrefs, pref]
    }))
  }

  const toggleStartupStage = (stage: StartupStage) => {
    setFilters(prev => ({
      ...prev,
      startupStages: prev.startupStages?.includes(stage)
        ? prev.startupStages.filter(s => s !== stage)
        : [...(prev.startupStages || []), stage]
    }))
  }

  // Check if user is a match (to display contact info)
  const isMatch = (userId: string) => matches.includes(userId)

  // Render filter panel
  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Location Filter */}
      <div className="space-y-4">
        <h3 className="font-medium">Location</h3>
        <div className="space-y-2">
          <Input
            placeholder="Enter city or region"
            value={filters.location}
            onChange={(e) => handleFilterChange({ location: e.target.value })}
          />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Maximum distance: {filters.maxDistance} miles</p>
            <Slider
              value={[filters.maxDistance || 50]}
              min={5}
              max={500}
              step={5}
              onValueChange={(value) => handleFilterChange({ maxDistance: value[0] })}
            />
          </div>
        </div>
      </div>
      
      {/* Experience Range */}
      <div className="space-y-4">
        <h3 className="font-medium">Years of Experience</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{filters.experienceRange[0]} years</span>
            <span className="text-sm text-muted-foreground">{filters.experienceRange[1]} years</span>
          </div>
          <Slider
            value={filters.experienceRange}
            min={0}
            max={15}
            step={1}
            onValueChange={(value) => handleFilterChange({ experienceRange: [value[0], value[1]] })}
          />
        </div>
      </div>
      
      {/* Working Style */}
      <div className="space-y-4">
        <h3 className="font-medium">Working Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(workingStyleLabels).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox 
                id={`style-${value}`}
                checked={filters.workingStyles.includes(value as WorkingStyle)}
                onCheckedChange={() => toggleWorkingStyle(value as WorkingStyle)}
              />
              <Label htmlFor={`style-${value}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Collaboration Preference */}
      <div className="space-y-4">
        <h3 className="font-medium">Collaboration Preference</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(collaborationPrefLabels).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox 
                id={`collab-${value}`}
                checked={filters.collaborationPrefs.includes(value as CollaborationPref)}
                onCheckedChange={() => toggleCollaborationPref(value as CollaborationPref)}
              />
              <Label htmlFor={`collab-${value}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills */}
      <div className="space-y-4">
        <h3 className="font-medium">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {allSkills.map(skill => (
            <Badge 
              key={skill}
              variant={filters.skills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Domains */}
      <div className="space-y-4">
        <h3 className="font-medium">Domain Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {allDomains.map(domain => (
            <Badge 
              key={domain}
              variant={filters.domains.includes(domain) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDomain(domain)}
            >
              {domain}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Startup Stage */}
      <div className="space-y-4">
        <h3 className="font-medium">Startup Stage</h3>
        <div className="grid grid-cols-2 gap-2">
          {['IDEA', 'MVP', 'SCALING', 'EXITED'].map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox 
                id={`stage-${stage}`}
                checked={filters.startupStages?.includes(stage as StartupStage)}
                onCheckedChange={() => toggleStartupStage(stage as StartupStage)}
              />
              <Label htmlFor={`stage-${stage}`}>{stage.charAt(0) + stage.slice(1).toLowerCase()}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            setFilters({
              skills: [],
              domains: [],
              workingStyles: [],
              collaborationPrefs: [],
              experienceRange: [0, 15],
              startupStages: [],
              location: '',
              maxDistance: 50
            })
            setCurrentIndex(0)
          }}
        >
          Reset Filters
        </Button>
        {!isDesktop && (
          <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
        )}
      </div>
    </div>
  )

  const renderProfileCard = () => {
    if (!activeUser) return null;
    
    return (
      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(_, info) => {
          if (info.offset.x > 100) {
            handleLike();
          } else if (info.offset.x < -100) {
            handlePass();
          } else {
            x.set(0); // Reset position if not enough drag
          }
        }}
        className="absolute w-full cursor-grab active:cursor-grabbing"
      >
        {/* Like/Nope indicators */}
        <motion.div 
          className="absolute top-10 right-10 rotate-12 border-4 border-green-500 rounded-md px-6 py-2 z-10"
          style={{ opacity: likeOpacity }}
        >
          <span className="font-extrabold text-3xl text-green-500">LIKE</span>
        </motion.div>
        
        <motion.div 
          className="absolute top-10 left-10 -rotate-12 border-4 border-red-500 rounded-md px-6 py-2 z-10"
          style={{ opacity: nopeOpacity }}
        >
          <span className="font-extrabold text-3xl text-red-500">NOPE</span>
        </motion.div>
        
        <Card className="overflow-hidden">
          <div className="relative h-80 bg-muted">
            {activeUser.avatarUrl ? (
              <img 
                src={activeUser.avatarUrl} 
                alt={activeUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
                <div className="text-6xl font-bold text-blue-300">
                  {activeUser.name.charAt(0)}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-foreground">{activeUser.name}</h2>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {activeUser.location}
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1" />
                {activeUser.currentRole} • {activeUser.yearsExperience}+ years
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Working Style
                </span>
                <span className="text-sm font-medium">
                  {workingStyleLabels[activeUser.workingStyle]}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" /> Collaboration
                </span>
                <span className="text-sm font-medium">
                  {collaborationPrefLabels[activeUser.collaborationPref]}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-1">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {activeUser.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Domains</h3>
                <div className="flex flex-wrap gap-1">
                  {activeUser.domainExpertise.map(domain => (
                    <Badge key={domain} className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Personality</h3>
                <div className="flex flex-wrap gap-1">
                  {activeUser.personalityTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {activeUser.startupInfo && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Startup</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {activeUser.startupInfo.startupStage}
                    </Badge>
                    <Badge variant="outline">
                      {activeUser.startupInfo.startupCommitment
                        .split('_')
                        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                        .join(' ')}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Only show contact info if there's a match */}
              {isMatch(activeUser.id) && (
                <div className="space-y-3 pt-3 border-t mt-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" /> Contact Info
                  </h3>
                  
                  {activeUser.calendarLink && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(activeUser.calendarLink, '_blank')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  )}
                  
                  {activeUser.socialLinks && activeUser.socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeUser.socialLinks.map((link, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          {socialIcons[link.platform] || <Globe className="h-4 w-4 mr-2" />}
                          <span className="ml-2">{link.platform}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4 p-4 pt-0">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-14 w-14 rounded-full bg-background shadow-md hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
              onClick={handlePass}
            >
              <X className="h-6 w-6 text-destructive" />
            </Button>
            
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-md hover:bg-green-600 transition-colors"
              onClick={handleLike}
            >
              <Heart className="h-6 w-6" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discover Matches</h1>
        
        {/* Mobile filter button */}
        {!isDesktop && (
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 lg:hidden">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[480px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your matches based on preferences
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-120px)]">
                <FilterPanel />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main card area */}
        <div className={`w-full ${isDesktop ? 'lg:w-2/3' : ''}`}>
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="mb-4 p-4 rounded-full bg-muted">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No matches found</h2>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your filters to find more potential matches.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setFilterOpen(true)}
              >
                Adjust Filters
              </Button>
            </div>
          ) : currentIndex >= filteredUsers.length ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="mb-4 p-4 rounded-full bg-muted">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No more profiles</h2>
              <p className="text-muted-foreground max-w-sm">
                You've seen all the available matches. Check back later or adjust your filters.
              </p>
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentIndex(0)}
                >
                  Start Over
                </Button>
                <Button 
                  onClick={() => setFilterOpen(true)}
                >
                  Adjust Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative h-[600px] max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {renderProfileCard()}
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                {filteredUsers.map((_, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      index === currentIndex 
                        ? "w-6 bg-primary" 
                        : index < currentIndex 
                          ? "w-2 bg-muted-foreground" 
                          : "w-2 bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          
          {filteredUsers.length > 0 && currentIndex < filteredUsers.length && (
            <div className="flex justify-center mt-8 gap-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1))
                  x.set(0)
                }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCurrentIndex(Math.min(filteredUsers.length - 1, currentIndex + 1))
                  x.set(0)
                }}
                disabled={currentIndex === filteredUsers.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Desktop filters sidebar */}
        {isDesktop && (
          <div className="hidden lg:block lg:w-1/3 bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <FilterPanel />
            </ScrollArea>
          </div>
        )}
      </div>
      
      {/* Match dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">It's a Match! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              You and {selectedMatch?.name} have matched. You can now connect with each other.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center my-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background absolute -left-8">
                <AvatarImage src="https://github.com/yourusername.png" alt="Your profile" />
                <AvatarFallback>YOU</AvatarFallback>
              </Avatar>
              
              <Avatar className="h-24 w-24 border-4 border-background ml-16">
                <AvatarImage src={selectedMatch?.avatarUrl} alt={selectedMatch?.name} />
                <AvatarFallback>{selectedMatch?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedMatch?.calendarLink && (
              <Button className="w-full" onClick={() => window.open(selectedMatch.calendarLink, '_blank')}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule a Meeting
              </Button>
            )}
            
            {selectedMatch?.socialLinks && selectedMatch.socialLinks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Connect on:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.socialLinks.map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      {socialIcons[link.platform] || <Globe className="h-4 w-4 mr-2" />}
                      <span className="ml-2">{link.platform}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setMatchDialogOpen(false)}
            >
              Keep Swiping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}