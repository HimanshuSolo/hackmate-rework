'use client'


import { useState, useMemo, useEffect } from 'react'
import geohash from 'ngeohash';
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
  SheetFooter
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Sparkles,
  Mail,
  AlertCircle,
  Loader2
} from "lucide-react"
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Types based on your schema
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
  description?: string
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
  email?: string
  socialLinks?: { platform: string, url: string }[]
}

// Mock current user for preference loading
const currentUserPreferences = {
  workingStyle: "FLEXIBLE" as WorkingStyle,
  collaborationPref: "HYBRID" as CollaborationPref,
  skills: ["React", "TypeScript", "UI/UX Design"],
  domainExpertise: ["SaaS", "FinTech"],
  location: "San Francisco, CA",
  enableLocationBasedMatching: true,
  maxDistance: 50,
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Morgan",
    avatarUrl: "https://github.com/shadcn.png",
    location: "San Francisco, CA",
    description: "I'm passionate about building fintech solutions that make a difference. Looking for co-founders who are equally excited about revolutionizing financial services for small businesses.",
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
        description: "Built a personal finance management tool using ML algorithms to provide smart insights and recommendations",
        link: "https://github.com/alexmorgan/finance-ai"
      }
    ],
    startupInfo: {
      startupStage: "MVP",
      startupGoals: "Building a next-generation fintech platform for small businesses that simplifies accounting, payroll, and financial planning",
      startupCommitment: "FULL_TIME_READY",
      lookingFor: ["Business Development", "Marketing"]
    },
    calendarLink: "https://cal.com/alexmorgan",
    email: "alex@example.com",
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
    description: "Product manager with experience in e-commerce and marketplace platforms. Looking to build something that connects local businesses with customers in a meaningful way.",
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
        description: "Led development of a marketplace connecting local businesses with customers and implemented innovative logistics solutions",
        link: "https://marketconnect.co"
      }
    ],
    calendarLink: "https://cal.com/jamielee",
    email: "jamie@example.com",
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
    description: "Frontend developer focused on creating intuitive user experiences. I believe in the power of education and am looking to build tools that make learning more accessible and engaging.",
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
        description: "Built responsive web app for online education with adaptive learning paths and interactive content",
        link: "https://github.com/taylorkim/learnpath"
      }
    ],
    startupInfo: {
      startupStage: "IDEA",
      startupGoals: "Creating an adaptive learning platform using AI to personalize education for individual learning styles",
      startupCommitment: "BUILDING",
      lookingFor: ["Backend Developer", "ML Engineer"]
    },
    calendarLink: "https://cal.com/taylorkim",
    email: "taylor@example.com",
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
    description: "Data scientist with a background in healthcare analytics. Passionate about applying AI to solve real-world health problems and improve patient outcomes.",
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
        description: "Developed ML models to predict patient outcomes and recommend preventative interventions",
        link: "https://github.com/jordansmith/health-predict"
      }
    ],
    calendarLink: "https://cal.com/jordansmith",
    email: "jordan@example.com",
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
    description: "UX designer with a passion for creating beautiful, functional interfaces. I'm interested in building a platform that makes shopping more personal and engaging.",
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
        description: "Designed intuitive shopping experience for fashion retailer with personalized recommendations",
        link: "https://dribbble.com/caseyparker/projects/e-commerce"
      }
    ],
    startupInfo: {
      startupStage: "MVP",
      startupGoals: "Building a design-focused social commerce platform that connects independent designers with customers looking for unique products",
      startupCommitment: "LAUNCHING",
      lookingFor: ["Frontend Developer", "Marketing Expert"]
    },
    calendarLink: "https://cal.com/caseyparker",
    email: "casey@example.com",
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

const startupStageLabels = {
  IDEA: "Idea Stage",
  MVP: "MVP Built",
  SCALING: "Scaling",
  EXITED: "Previous Exit"
};

const commitmentLevelLabels = {
  EXPLORING: "Exploring",
  BUILDING: "Building",
  LAUNCHING: "Launching",
  FULL_TIME_READY: "Full-time Ready"
};

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <Github className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Twitter: <Twitter className="h-4 w-4" />,
  Portfolio: <Globe className="h-4 w-4" />,
  Email: <Mail className="h-4 w-4" />,
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
  enableLocationBasedMatching: boolean
  preferencesFromProfile: boolean
}

export default function Explore() {
  const { user, isLoaded } = useUser()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<string[]>([])
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null)
  const [matchDialogOpen, setMatchDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false)
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)
  const [userCoordinates, setUserCoordinates] = useState<{
    latitude: number;
    longitude: number;
    geohash: string;
  } | null>(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  
  // User preferences
  const [filters, setFilters] = useState<FilterOptions>({
    skills: [],
    domains: [],
    workingStyles: [],
    collaborationPrefs: [],
    experienceRange: [0, 15],
    startupStages: [],
    location: '',
    maxDistance: 50,
    enableLocationBasedMatching: false,
    preferencesFromProfile: true
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

  // Load user preferences
  useEffect(() => {
    // Simulate loading user preferences from API
    const loadUserPreferences = async () => {
      setIsLoadingPreferences(true)
      try {
        // In a real app, you'd fetch this from your API
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        
        if (filters.preferencesFromProfile) {
          setFilters(prev => ({
            ...prev,
            workingStyles: [currentUserPreferences.workingStyle],
            collaborationPrefs: [currentUserPreferences.collaborationPref],
            // Only use some of the user's skills and domains as filters
            skills: currentUserPreferences.skills.slice(0, 1),
            domains: currentUserPreferences.domainExpertise.slice(0, 1),
            location: currentUserPreferences.location,
            maxDistance: currentUserPreferences.maxDistance,
            enableLocationBasedMatching: currentUserPreferences.enableLocationBasedMatching
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

  // Request location if enabled
  useEffect(() => {
    if (filters.enableLocationBasedMatching && !locationPermissionRequested && !userLocation) {
      requestLocationPermission()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.enableLocationBasedMatching, locationPermissionRequested, userLocation])

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
      if (filters.enableLocationBasedMatching && filters.location && 
          !user.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [filters, mockUsers])

  // Add this useEffect to load saved location on component mount
useEffect(() => {
  const loadSavedLocation = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/user/${user.id}/location`);
      
      if (response.ok) {
        const locationData = await response.json();
        
        if (locationData && locationData.latitude && locationData.longitude) {
          setUserCoordinates({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            geohash: locationData.geohash
          });
          
          // Set userLocation to match GeolocationCoordinates format
          setUserLocation({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          } as GeolocationCoordinates);
          
          setLocationPermissionRequested(true);
          
          // Enable location-based matching if there's a saved location
          setFilters(prev => ({
            ...prev,
            enableLocationBasedMatching: true
          }));
          
          toast("Using saved location", {
            description: `Your previously saved location (${locationData.geohash.substring(0, 5)}...) will be used for matching.`
          });
        }
      }
    } catch (error) {
      console.error("Failed to load saved location:", error);
    }
  };
  
  loadSavedLocation();
}, [user?.id]);

// Add this useEffect to update filters or fetch nearby users when coordinates change
useEffect(() => {
  if (userCoordinates && filters.enableLocationBasedMatching) {
    // Here you would typically call an API to get users near this geohash
    console.log(`Finding users near geohash: ${userCoordinates.geohash}`);
    
    // Mock implementation - in a real app, you'd call an API endpoint
    const fetchNearbyUsers = async () => {
      // Here you would call something like:
      // const response = await fetch(`/api/users/nearby?geohash=${userCoordinates.geohash}&distance=${filters.maxDistance}`);
      
      // For this demo, let's just update the filter location from coordinates
      const reverseGeocodeLocation = async () => {
        try {
          // This would be a reverse geocoding API in a real app
          // For now, we'll just set a generic location based on the geohash
          setFilters(prev => ({
            ...prev,
            location: `Near ${userCoordinates.geohash.substring(0, 5)}`
          }));
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        }
      };
      
      reverseGeocodeLocation();
    };
    
    fetchNearbyUsers();
  }
}, [userCoordinates, filters.enableLocationBasedMatching, filters.maxDistance]);


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

  // Request location permission
 const requestLocationPermission = () => {
  setLocationPermissionRequested(true);
  setIsLoadingLocation(true);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Generate geohash with precision 7 (city-level precision)
        const geoHashValue = geohash.encode(latitude, longitude, 7);
        
        // Store all location data
        setUserLocation(position.coords);
        setUserCoordinates({
          latitude,
          longitude,
          geohash: geoHashValue
        });
        
        setIsLoadingLocation(false);
        
        // Show success toast with location info
        toast.success("Location detected", {
          description: `Found you at: ${geoHashValue}`
        });
        
        // Save to database if user is authenticated
        if (user?.id) {
          await saveUserLocationToDatabase({
            latitude,
            longitude,
            geohash: geoHashValue
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);
        
        // Different error messages based on error code
        const errorMessages = {
          1: "Location access denied. Please enable location permissions in your browser settings.",
          2: "Location unavailable. Please try again later.",
          3: "Location request timed out. Please try again."
        };
        
        const errorMessage = errorMessages[error.code] || "Couldn't get your location";
        
        toast.error("Location access failed", {
          description: errorMessage
        });
        
        setFilters(prev => ({
          ...prev,
          enableLocationBasedMatching: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    setIsLoadingLocation(false);
    toast.error("Geolocation not supported", {
      description: "Your browser doesn't support location services."
    });
    setFilters(prev => ({
      ...prev,
      enableLocationBasedMatching: false
    }));
  }
};

const saveUserLocationToDatabase = async (locationData: {
  latitude: number;
  longitude: number;
  geohash: string;
}) => {
  if (!user?.id) return;
  
  setIsSavingLocation(true);
  try {
    const response = await fetch(`/api/user/${user?.id}/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const savedLocation = await response.json();
    console.log("Location saved to database:", savedLocation);
    
    toast.success("Location saved", {
      description: "Your location has been saved for matching."
    });
  } catch (error) {
    console.error("Failed to save location:", error);
    toast.error("Failed to save location", {
      description: "Location detected but couldn't be saved. Some features may not work properly."
    });
  } finally {
    setIsSavingLocation(false);
  }
};

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="use-profile-prefs"
            checked={filters.preferencesFromProfile}
            onCheckedChange={(checked) => {
              handleFilterChange({ preferencesFromProfile: checked })
              // Reset filters if turning on profile preferences
              if (checked) {
                setIsLoadingPreferences(true)
                setTimeout(() => {
                  setFilters(prev => ({
                    ...prev,
                    workingStyles: [currentUserPreferences.workingStyle],
                    collaborationPrefs: [currentUserPreferences.collaborationPref],
                    skills: currentUserPreferences.skills.slice(0, 1),
                    domains: currentUserPreferences.domainExpertise.slice(0, 1),
                    location: currentUserPreferences.location,
                    maxDistance: currentUserPreferences.maxDistance,
                    enableLocationBasedMatching: currentUserPreferences.enableLocationBasedMatching,
                    preferencesFromProfile: true
                  }))
                  setIsLoadingPreferences(false)
                }, 500)
              }
            }}
          />
          <Label htmlFor="use-profile-prefs" className="cursor-pointer">
            Use my profile preferences
          </Label>
        </div>
        {isLoadingPreferences && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      {/* Location Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Location</h3>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enable-location"
              checked={filters.enableLocationBasedMatching}
              onCheckedChange={(checked) => {
                handleFilterChange({ enableLocationBasedMatching: checked })
                if (checked && !locationPermissionRequested) {
                  requestLocationPermission()
                }
              }}
            />
            <Label htmlFor="enable-location" className="cursor-pointer">
              Enable location
            </Label>
          </div>
        </div>
        
        {filters.enableLocationBasedMatching && userCoordinates && (
          <div className="mt-2 p-3 bg-muted/30 rounded-md text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Your location data:</span>
              {isSavingLocation && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
            
            <div className="space-y-1 text-muted-foreground">
              <p className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 
                Coordinates: {userCoordinates.latitude.toFixed(5)}, {userCoordinates.longitude.toFixed(5)}
              </p>
              <p className="flex items-center gap-1">
                <Badge variant="outline" className="text-[10px] h-4">
                  {userCoordinates.geohash}
                </Badge>
                <span className="text-[10px]">(geohash)</span>
              </p>
              <p className="mt-2 text-[10px] border-t border-border/50 pt-1">
                Finding users within approximately {filters.maxDistance} miles of your location
                              <Slider
                        value={[filters.maxDistance || 50]}
                        min={5}
                        max={500}
                        step={5}
                        onValueChange={(value) => handleFilterChange({ maxDistance: value[0] })}
                        disabled={isLoadingLocation}
                      />
              </p>
            </div>
          </div>
        )}
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
          {Object.entries(startupStageLabels).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox 
                id={`stage-${value}`}
                checked={filters.startupStages?.includes(value as StartupStage)}
                onCheckedChange={() => toggleStartupStage(value as StartupStage)}
              />
              <Label htmlFor={`stage-${value}`}>{label}</Label>
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
              maxDistance: 50,
              enableLocationBasedMatching: false,
              preferencesFromProfile: false
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
            <Tabs defaultValue="about" className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="startup">Startup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4 space-y-4">
                {activeUser.description && (
                  <div>
                    <p className="text-sm">{activeUser.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
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
                
                {activeUser.pastProjects && activeUser.pastProjects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Past Projects</h3>
                    <div className="space-y-2">
                      {activeUser.pastProjects.map(project => (
                        <div key={project.id} className="text-sm">
                          <div className="font-medium">{project.name}</div>
                          <p className="text-muted-foreground text-xs">{project.description}</p>
                          {project.link && (
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs text-primary flex items-center mt-1"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View project
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="skills" className="mt-4 space-y-4">
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
                  <h3 className="text-sm font-medium mb-1">Open to Roles</h3>
                  <div className="flex flex-wrap gap-1">
                    {activeUser.rolesOpenTo.map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="startup" className="mt-4 space-y-4">
                {activeUser.startupInfo ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {startupStageLabels[activeUser.startupInfo.startupStage]}
                      </Badge>
                      <Badge variant="outline">
                        {commitmentLevelLabels[activeUser.startupInfo.startupCommitment]}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Startup Goals</h3>
                      <p className="text-sm">{activeUser.startupInfo.startupGoals}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Looking For</h3>
                      <div className="flex flex-wrap gap-1">
                        {activeUser.startupInfo.lookingFor.map(role => (
                          <Badge key={role} className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      This user hasn't shared any startup information.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
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
                
                <div className="flex flex-wrap gap-2">
                  {activeUser.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`mailto:${activeUser.email}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Email</span>
                    </Button>
                  )}
                  
                  {activeUser.socialLinks && activeUser.socialLinks.length > 0 && (
                    activeUser.socialLinks.map((link, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        {socialIcons[link.platform] || <Globe className="h-4 w-4 mr-2" />}
                        <span className="ml-2">{link.platform}</span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            )}
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
              
              <ScrollArea className="h-[calc(100vh-180px)]">
                <FilterPanel />
              </ScrollArea>
              
              <SheetFooter className="mt-4">
                <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main card area */}
        <div className={`w-full ${isDesktop ? 'lg:w-2/3' : ''}`}>
          {isLoadingPreferences ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Loading your preferences</h2>
              <p className="text-muted-foreground max-w-sm">
                We're personalizing your matches based on your profile...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
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
            <div className="relative h-[650px] max-w-md mx-auto">
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
      
      {/* Match dialog with enhanced design */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent rounded-t-lg -m-6" />
          
          <div className="relative pt-8">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute -top-1 -left-1 h-16 w-16 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            
            <DialogHeader className="text-center pt-8">
              <DialogTitle className="text-3xl font-bold mb-2">It's a Match!</DialogTitle>
              <DialogDescription className="text-lg">
                You and {selectedMatch?.name} have connected
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl absolute -left-12">
                  <AvatarImage src={user?.imageUrl || "/placeholder-user.png"} alt="Your profile" />
                  <AvatarFallback>{user?.firstName?.charAt(0) || "Y"}</AvatarFallback>
                </Avatar>
                
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl ml-12">
                  <AvatarImage src={selectedMatch?.avatarUrl} alt={selectedMatch?.name} />
                  <AvatarFallback>{selectedMatch?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center italic">
                "{selectedMatch?.description?.slice(0, 100)}..."
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">Connect with {selectedMatch?.name}:</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedMatch?.calendarLink && (
                  <Button className="w-full" onClick={() => window.open(selectedMatch.calendarLink, '_blank')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                )}
                
                {selectedMatch?.email && (
                  <Button variant="outline" onClick={() => window.open(`mailto:${selectedMatch.email}`, '_blank')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </div>
              
              {selectedMatch?.socialLinks && selectedMatch.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMatch.socialLinks.map((link, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(link.url, '_blank')}
                            className="h-10 w-10"
                          >
                            {socialIcons[link.platform] || <Globe className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.platform}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-4 sm:mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setMatchDialogOpen(false)}
            >
              Keep Swiping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}