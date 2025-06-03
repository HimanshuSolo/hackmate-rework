'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'


type Project = {
  id: string
  name: string
  description: string
  link?: string
}

type User = {
  id: string
  name: string
  avatarUrl: string
  location: string
  personalityTags: string[]
  workingStyle: 'ASYNC' | 'REAL_TIME' | 'FLEXIBLE' | 'STRUCTURED'
  collaborationPref: 'REMOTE' | 'HYBRID' | 'IN_PERSON' | 'DOESNT_MATTER'
  currentRole: string
  yearsExperience: number
  domainExpertise: string[]
  skills: string[]
  rolesOpenTo: string[]
  pastProjects: Project[]
  startupInfo?: {
    stage: 'IDEA' | 'MVP' | 'SCALING' | 'EXITED'
    goals: string
    commitment: 'EXPLORING' | 'BUILDING' | 'LAUNCHING' | 'FULL_TIME_READY'
    lookingFor: string[]
  }
}

// Mock user data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  avatarUrl: "https://github.com/shadcn.png",
  location: "San Francisco, CA",
  personalityTags: ["Problem Solver", "Creative", "Team Player"],
  workingStyle: "FLEXIBLE",
  collaborationPref: "HYBRID",
  currentRole: "Senior Software Engineer",
  yearsExperience: 5,
  domainExpertise: ["SaaS", "FinTech", "AI/ML"],
  skills: ["JavaScript", "React", "Node.js", "Python"],
  rolesOpenTo: ["Technical Co-Founder", "CTO", "Lead Engineer"],
  pastProjects: [
    {
      id: "p1",
      name: "AI-Powered Financial Assistant",
      description: "Built a personal finance management tool using ML algorithms",
      link: "https://github.com/project1"
    },
    {
      id: "p2",
      name: "E-commerce Platform",
      description: "Developed a scalable marketplace solution",
      link: "https://github.com/project2"
    }
  ],
  startupInfo: {
    stage: "MVP",
    goals: "Building a next-generation fintech platform for small businesses",
    commitment: "FULL_TIME_READY",
    lookingFor: ["Business Development", "Marketing", "UI/UX Design"]
  }
}

export default function Profile() {
  const router = useRouter()
  const [user] = useState<User>(mockUser)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button 
          onClick={() => router.push('/profile/edit')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.location}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{user.currentRole}</Badge>
                  <Badge variant="outline">{user.yearsExperience}+ years</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {user.personalityTags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Domain Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {user.domainExpertise.map((domain) => (
                    <Badge key={domain} variant="secondary">{domain}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Past Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Past Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.pastProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Working Style</h3>
                <p className="mt-1">{user.workingStyle.charAt(0) + user.workingStyle.slice(1).toLowerCase()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Collaboration</h3>
                <p className="mt-1">{user.collaborationPref.charAt(0) + user.collaborationPref.slice(1).toLowerCase()}</p>
              </div>
            </CardContent>
          </Card>

          {user.startupInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Startup Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Stage</h3>
                  <Badge variant="outline" className="mt-1">{user.startupInfo.stage}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Commitment</h3>
                  <Badge variant="outline" className="mt-1">
                    {user.startupInfo.commitment.split('_').map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Looking For</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.startupInfo.lookingFor.map((role) => (
                      <Badge key={role} variant="secondary">{role}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <DialogDescription>
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedProject?.link && (
            <div className="mt-4">
              <Button variant="outline" asChild>
                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}