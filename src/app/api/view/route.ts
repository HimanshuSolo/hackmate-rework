import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { z } from 'zod';
import { getAuth } from '@clerk/nextjs/server';

// Schema for marking profile as viewed
const viewProfileSchema = z.object({
  userId: z.string(),
  viewedId: z.string(),
});

// GET handler for fetching viewed profiles
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const url = new URL(req.url);
    const requestedUserId = url.searchParams.get('userId');
    
    // Check authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Verify the requested user ID matches the authenticated user
    if (requestedUserId && requestedUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Get viewed profiles from the database
    const viewedProfiles = await prismaClient.view.findMany({
      where: {
        userAId: userId,
      },
    });
    
    return NextResponse.json({ viewedProfiles });
  } catch (error) {
    console.error('Error fetching viewed profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewed profiles', message: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST handler for marking a profile as viewed
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const body = await req.json();
    const { viewedId } = viewProfileSchema.parse({ ...body, userId });
    
    // Check authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Verify the requested user ID matches the authenticated user
    if (body.userId && body.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Check if view already exists
    const existingView = await prismaClient.view.findFirst({
      where: {
        userAId: userId,
        userBId: viewedId,
      },
    });
    
    // If view doesn't exist, create it
    if (!existingView) {
      await prismaClient.view.create({
        data: {
          userAId: userId,
          userBId: viewedId,
        },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking profile as viewed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to mark profile as viewed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
