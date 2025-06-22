import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { z } from 'zod';

// Define schema for unlike request
const unlikeSchema = z.object({
  userId: z.string(),
  unlikedUserId: z.string(),
});

// POST handler for registering an unlike (passing on a profile)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, unlikedUserId } = unlikeSchema.parse(body);

    // Find any existing like from this user to the unliked user
    const existingLike = await prismaClient.match.findFirst({
      where: {
        userAId: userId,
        userBId: unlikedUserId,
        mutual: false
      },
    });

    // If a like exists, delete it
    if (existingLike) {
      await prismaClient.match.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Like removed successfully',
      });
    } else {
      // If no like exists, create a view record to track that this profile was seen
      // First check if a view already exists
      const existingView = await prismaClient.view.findFirst({
        where: {
          userAId: userId,
          userBId: unlikedUserId,
        },
      });

      // If no view exists, create one
      if (!existingView) {
        await prismaClient.view.create({
          data: {
            userAId: userId,
            userBId: unlikedUserId,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Profile marked as passed',
      });
    }
  } catch (error) {
    console.error('Error processing unlike:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process unlike', message: (error as Error).message },
      { status: 500 }
    );
  }
}