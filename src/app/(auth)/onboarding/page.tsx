'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"

// Constants for file upload
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

// Form Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  description: z.string().min(50, { message: "Tell us a bit more about yourself (min 50 characters)" }),
  location: z.string().min(1, { message: "Location is required" }),
  currentRole: z.string().min(1, { message: "Current role is required" }),
  yearsExperience: z.number().min(0),
  workingStyle: z.enum(['ASYNC', 'REAL_TIME', 'FLEXIBLE', 'STRUCTURED']),
  collaborationPref: z.enum(['REMOTE', 'HYBRID', 'IN_PERSON', 'DOESNT_MATTER']),
  personalityTags: z.array(z.string()).min(1, { message: "Select at least one personality trait" }),
  domainExpertise: z.array(z.string()).min(1, { message: "Select at least one domain" }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill" }),
  rolesOpenTo: z.array(z.string()).min(1, { message: "Select at least one role" }),
  resume: z
    .custom<FileList>()
    .refine((files) => files?.length <= 1, "Only one resume file is allowed")
    .refine(
      (files) => !files?.[0] || files?.[0]?.size <= 10 * 1024 * 1024,
      "Max file size is 10MB"
    )
    .optional(),
  pastProjects: z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Project description is required"),
    link: z.string().url().optional().or(z.literal('')),
  })).optional(),
  startupInfo: z.object({
    stage: z.enum(['IDEA', 'MVP', 'SCALING', 'EXITED']),
    goals: z.string().min(50, "Please describe your startup goals in detail"),
    commitment: z.enum(['EXPLORING', 'BUILDING', 'LAUNCHING', 'FULL_TIME_READY']),
    lookingFor: z.array(z.string()).min(1, "Select what you're looking for"),
  }).optional(),
})

type FormValues = z.infer<typeof formSchema>

const personalityOptions = [
  "Problem Solver", "Creative", "Team Player", "Leader", 
  "Detail-Oriented", "Fast Learner", "Self-Motivated", 
  "Strategic Thinker", "Innovative", "Analytical"
]

const skillOptions = [
  "JavaScript", "React", "Node.js", "Python", "Java",
  "Product Management", "UI/UX Design", "Data Science",
  "Machine Learning", "Marketing", "Sales", "Business Development"
]

const domainOptions = [
  "SaaS", "E-commerce", "FinTech", "HealthTech",
  "EdTech", "AI/ML", "Blockchain", "IoT",
  "Mobile Apps", "Enterprise Software"
]

export default function OnboardingForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      currentRole: "",
      yearsExperience: 0,
      workingStyle: "FLEXIBLE",
      collaborationPref: "DOESNT_MATTER",
      personalityTags: [],
      domainExpertise: [],
      skills: [],
      rolesOpenTo: [],
      pastProjects: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pastProjects",
  })

  async function onSubmit(values: FormValues) {
    try {
      let avatarUrl = null
      let resumeUrl = null

      if (values.avatar?.[0]) {
        // Upload avatar logic here
      }

      if (values.resume?.[0]) {
        // Upload resume logic here
      }

      const formData = {
        ...values,
        avatarUrl,
        resumeUrl,
      }

      console.log(formData)
      // await axios.post('/api/onboarding', formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Tell us about yourself to get started with HackMate.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Your location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    {value && (
                      <img
                        src={URL.createObjectURL(value[0])}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a profile picture (max 5MB, JPEG, PNG or WebP)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About You</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your background, and what you're looking for..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select working style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ASYNC">Async</SelectItem>
                      <SelectItem value="REAL_TIME">Real Time</SelectItem>
                      <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                      <SelectItem value="STRUCTURED">Structured</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collaborationPref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collaboration Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                      <SelectItem value="IN_PERSON">In Person</SelectItem>
                      <SelectItem value="DOESNT_MATTER">Doesn't Matter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="personalityTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality Traits</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                      {personalityOptions.map((tag) => (
                        <Badge
                          key={tag}
                          variant={field.value.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValue = field.value.includes(tag)
                              ? field.value.filter((t) => t !== tag)
                              : [...field.value, tag]
                            field.onChange(newValue)
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={field.value.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValue = field.value.includes(skill)
                              ? field.value.filter((s) => s !== skill)
                              : [...field.value, skill]
                            field.onChange(newValue)
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Past Projects</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', description: '', link: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start p-4 border rounded-md">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`pastProjects.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`pastProjects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`pastProjects.${index}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Link</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-6 border rounded-lg p-6">
            <h3 className="text-lg font-medium">Startup Information</h3>
            
            <FormField
              control={form.control}
              name="startupInfo.stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Stage</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IDEA">Idea Stage</SelectItem>
                      <SelectItem value="MVP">MVP</SelectItem>
                      <SelectItem value="SCALING">Scaling</SelectItem>
                      <SelectItem value="EXITED">Exited</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startupInfo.goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your startup goals and vision..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startupInfo.commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commitment Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select commitment level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EXPLORING">Exploring</SelectItem>
                      <SelectItem value="BUILDING">Building</SelectItem>
                      <SelectItem value="LAUNCHING">Launching</SelectItem>
                      <SelectItem value="FULL_TIME_READY">Full Time Ready</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startupInfo.lookingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Looking For</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={field.value?.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValue = field.value?.includes(skill)
                              ? field.value.filter((s) => s !== skill)
                              : [...(field.value || []), skill]
                            field.onChange(newValue)
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </Form>
    </div>
  )
}