import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const url = new URL(request.url);
    const requestedUserId = url.searchParams.get('userId');
    
    // Check authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Verify the requested user ID matches the authenticated user
    if (requestedUserId && requestedUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Build the query to get matches
    const matchQuery = {
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      }
    };
  
    
    // Get matches from the database
    const matches = await prismaClient.match.findMany(matchQuery);
    
    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches', message: (error as Error).message },
      { status: 500 }
    );
  }
}