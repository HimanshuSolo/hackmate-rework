import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { cacheUserProfile, getCachedUserProfile } from '@/lib/redis';

export async function GET(
  request: Request,
) {
  try {
    const userId = request.url.split('/').pop();

    if (!userId) {
      return new NextResponse('ID is required', { status: 400 });
    }

    // Add caching headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60, s-maxage=120'); // Cache for 1 minute browser, 2 minutes CDN
    headers.set('Vary', 'Accept, Cookie'); // Vary cache by these headers
    
    // Try to get user from Redis cache first
    const cachedUser = await getCachedUserProfile(userId);
    
    if (cachedUser) {
      
      // Get related data from cache
      const cachedRelations = {
        pastProjects: [],
        startupInfo: null,
        contactInfo: null
      };
      
      try {
        // Get projects from cache
        if (cachedUser.pastProjects) {
          cachedRelations.pastProjects = JSON.parse(cachedUser.pastProjects);
        }
        
        // Get startup info from cache
        if (cachedUser.startupInfo) {
          cachedRelations.startupInfo = JSON.parse(cachedUser.startupInfo);
        }
        
        // Get contact info from cache
        if (cachedUser.contactInfo) {
          cachedRelations.contactInfo = JSON.parse(cachedUser.contactInfo);
        }
        
        // Assemble full user object
        const formattedUser = {
          id: cachedUser.id,
          name: cachedUser.name,
          description: cachedUser.description,
          avatarUrl: cachedUser.avatarUrl,
          location: cachedUser.location,
          personalityTags: JSON.parse(cachedUser.personalityTags || '[]'),
          workingStyle: cachedUser.workingStyle,
          collaborationPref: cachedUser.collaborationPref,
          currentRole: cachedUser.currentRole,
          yearsExperience: parseInt(cachedUser.yearsExperience || '0'),
          domainExpertise: JSON.parse(cachedUser.domainExpertise || '[]'),
          skills: JSON.parse(cachedUser.skills || '[]'),
          ...cachedRelations
        };
        
        return NextResponse.json(formattedUser, { headers });
      } catch (parseError) {
        console.error('Error parsing cached user data:', parseError);
        // Continue to fetch from database if parsing fails
      }
    }
    
    
    // Fetch the user and all related data from the database
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        pastProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            link: true
          }
        },
        startupInfo: {
          select: {
            startupStage: true,
            startupGoals: true,
            startupCommitment: true,
            lookingFor: true
          }
        },
        contactInfo: {
          select: {
            email: true,
            twitterUrl: true,
            linkedinUrl: true,
            scheduleUrl: true
          }
        },
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Cache the user profile for future requests
    await cacheUserProfile(user);
    
    return NextResponse.json(user, { headers });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', message: (error as Error).message },
      { status: 500 }
    );
  }
}