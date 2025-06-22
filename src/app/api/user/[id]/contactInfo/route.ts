import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';

export async function GET(
  req: NextRequest,
) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.indexOf('user') + 1];
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch only the contact information for the user
    const contactInfo = await prismaClient.contactInfo.findUnique({
      where: {
        userId: userId
      },
      select: {
        id: true,
        email: true,
        twitterUrl: true,
        linkedinUrl: true,
        scheduleUrl: true
      }
    });
    
    if (!contactInfo) {
      return NextResponse.json(
        { error: 'Contact information not found for this user' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ contactInfo });
    
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information', message: (error as Error).message },
      { status: 500 }
    );
  }
}