import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'path';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Define the request body schema
const userCreateSchema = z.object({ 
  id: z.string(),
  name: z.string().min(2),
  // We'll handle file upload separately, so this is optional
  avatarUrl: z.string().optional(),
  location: z.string(),
  personalityTags: z.array(z.string()),
  workingStyle: z.enum(['ASYNC', 'REAL_TIME', 'FLEXIBLE', 'STRUCTURED']),
  collaborationPref: z.enum(['REMOTE', 'HYBRID', 'IN_PERSON', 'DOESNT_MATTER']),
  currentRole: z.string(),
  yearsExperience: z.number().min(0),
  domainExpertise: z.array(z.string()),
  skills: z.array(z.string()),
  pastProjects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().optional()
  })).optional(),
  startupInfo: z.object({
    stage: z.enum(['IDEA', 'MVP', 'SCALING', 'EXITED']),
    goals: z.string(),
    commitment: z.enum(['EXPLORING', 'BUILDING', 'LAUNCHING', 'FULL_TIME_READY']),
    lookingFor: z.array(z.string())
  }).optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    scheduleUrl: z.string().url().optional().or(z.literal(''))
  }).optional()
});

export async function POST(request: Request) {
  try {
    // Process as multipart form data
    const formData = await request.formData();
    
    // Get the avatar file if it exists
    const avatarFile = formData.get('avatar') as File | null;
    
    // Parse the JSON data from the form
    const userData = JSON.parse(formData.get('userData') as string);
    
    // Validate user data
    const validatedData = userCreateSchema.parse(userData);

    const id = validatedData.id;

    let cloudLink = "";
    // Handle file upload if avatar is provided
    if (avatarFile) {
      try {
        // Create directory for user uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars', id);
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Get file extension
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar.${fileExt}`;
        
        // Convert File to Buffer
        const arrayBuffer = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Save file to disk
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        
        console.log(`File saved locally at: ${filePath}`);
        
        // Upload to Cloudinary and get the secure URL
        const cloudResponse = await uploadOnCloudinary(filePath);
        if (cloudResponse && cloudResponse.secure_url) {
          cloudLink = cloudResponse.secure_url;
          console.log(`Uploaded to Cloudinary: ${cloudLink}`);
        } else {
          console.error('Cloudinary upload failed');
        }
      } catch (fileError) {
        console.error('Error handling file upload:', fileError);
      }
    }
    
    try {
      // Check if user already exists
      const existingUser = await prismaClient.user.findUnique({
        where: { id }
      });

      if (existingUser) {
        // Update user instead of creating a new one
        const user = await prismaClient.$transaction(async (tx) => {
          // Update the base user
          const updatedUser = await tx.user.update({
            where: { id },
            data: {
              name: validatedData.name,
              avatarUrl: cloudLink || existingUser.avatarUrl,
              location: validatedData.location,
              personalityTags: validatedData.personalityTags,
              workingStyle: validatedData.workingStyle,
              collaborationPref: validatedData.collaborationPref,
              currentRole: validatedData.currentRole,
              yearsExperience: validatedData.yearsExperience,
              domainExpertise: validatedData.domainExpertise,
              skills: validatedData.skills,
            }
          });

           // Handle contact info if provided
    if (validatedData.contactInfo) {
      // Check if contact info exists
      const existingContactInfo = await tx.contactInfo.findFirst({
        where: { userId: id }
      });
      
      if (existingContactInfo) {
        // Update existing contact info
        await tx.contactInfo.update({
          where: { id: existingContactInfo.id },
          data: {
            email: validatedData.contactInfo.email,
            twitterUrl: validatedData.contactInfo.twitterUrl || null,
            linkedinUrl: validatedData.contactInfo.linkedinUrl || null,
            scheduleUrl: validatedData.contactInfo.scheduleUrl || null
          }
        });
      } else {
        // Create new contact info
        await tx.contactInfo.create({
          data: {
            userId: id,
            email: validatedData.contactInfo.email,
            twitterUrl: validatedData.contactInfo.twitterUrl || null,
            linkedinUrl: validatedData.contactInfo.linkedinUrl || null,
            scheduleUrl: validatedData.contactInfo.scheduleUrl || null
          }
        });
      }
    }

          
          
          // Handle past projects if provided
          if (validatedData.pastProjects) {
            // Delete existing projects
            await tx.project.deleteMany({
              where: { userId: id }
            });
            
            // Create new projects
            for (const project of validatedData.pastProjects) {
              await tx.project.create({
                data: {
                  name: project.name,
                  description: project.description,
                  link: project.link,
                  userId: id
                }
              });
            }
          }
          
          // Handle startup info if provided
          if (validatedData.startupInfo) {
            // Check if startup info exists
            const existingStartupInfo = await tx.startupinfo.findUnique({
              where: { userId: id }
            });
            
            if (existingStartupInfo) {
              await tx.startupinfo.update({
                where: { userId: id },
                data: {
                  startupStage: validatedData.startupInfo.stage,
                  startupGoals: validatedData.startupInfo.goals,
                  startupCommitment: validatedData.startupInfo.commitment,
                  lookingFor: validatedData.startupInfo.lookingFor
                }
              });
            } else {
              await tx.startupinfo.create({
                data: {
                  userId: id,
                  startupStage: validatedData.startupInfo.stage,
                  startupGoals: validatedData.startupInfo.goals,
                  startupCommitment: validatedData.startupInfo.commitment,
                  lookingFor: validatedData.startupInfo.lookingFor
                }
              });
            }
          }
          
          return updatedUser;
        });
        
        return NextResponse.json(user, { status: 200 });
      } else {
        // Create a new user
        // Use a transaction to ensure all database operations succeed or fail together
        const user = await prismaClient.$transaction(async (tx) => {
          // Create the base user first
          const createdUser = await tx.user.create({
            data: {
              id,
              name: validatedData.name,
              avatarUrl: cloudLink,
              location: validatedData.location,
              personalityTags: validatedData.personalityTags,
              workingStyle: validatedData.workingStyle,
              collaborationPref: validatedData.collaborationPref,
              currentRole: validatedData.currentRole,
              yearsExperience: validatedData.yearsExperience,
              domainExpertise: validatedData.domainExpertise,
              skills: validatedData.skills,
            }
          });

           if (validatedData.contactInfo) {
            await tx.contactInfo.create({
              data: {
                userId: createdUser.id,
                email: validatedData.contactInfo.email,
                twitterUrl: validatedData.contactInfo.twitterUrl || null,
                linkedinUrl: validatedData.contactInfo.linkedinUrl || null,
                scheduleUrl: validatedData.contactInfo.scheduleUrl || null
              }
            });
          }
          
          // Create past projects if provided
          if (validatedData.pastProjects && validatedData.pastProjects.length > 0) {
            for (const project of validatedData.pastProjects) {
              await tx.project.create({
                data: {
                  name: project.name,
                  description: project.description,
                  link: project.link,
                  userId: createdUser.id
                }
              });
            }
          }
          
          // Create startup info if provided
          if (validatedData.startupInfo) {
            await tx.startupinfo.create({
              data: {
                userId: createdUser.id,
                startupStage: validatedData.startupInfo.stage,
                startupGoals: validatedData.startupInfo.goals,
                startupCommitment: validatedData.startupInfo.commitment,
                lookingFor: validatedData.startupInfo.lookingFor
              }
            });
          }
          
          // Return the created user
          return createdUser;
        });

        return NextResponse.json(user, { status: 201 });
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      if (dbError instanceof PrismaClientKnownRequestError && dbError.code === 'P2002') {
        return NextResponse.json({ 
          error: 'User already exists', 
          message: 'A user with this ID already exists' 
        }, { status: 409 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create user', message: (error as Error).message }, { status: 500 });
  }
}