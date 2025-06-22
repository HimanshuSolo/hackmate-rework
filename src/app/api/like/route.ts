import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prsimadb';
import { z } from 'zod';

// Define schema for like request
const likeSchema = z.object({
  userId: z.string(),
  likedUserId: z.string(),
});

// POST handler for registering a like
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, likedUserId } = likeSchema.parse(body);

    // Prevent liking oneself
    if (userId === likedUserId) {
      return NextResponse.json(
        { error: 'Cannot like yourself' },
        { status: 400 }
      );
    }

    // Check if the other user has already liked this user (potential match)
    const existingLike = await prismaClient.match.findFirst({
      where: {
        userAId: likedUserId,
        userBId: userId,
        mutual: false
      },
    });

    // If other user already liked this user, create a mutual match
    if (existingLike) {
      // Update the existing like to be mutual
      const match = await prismaClient.match.update({
        where: {
          id: existingLike.id,
        },
        data: {
          mutual: true
        },
        include: {
          userA: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              contactInfo: true,
            },
          },
          userB: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              contactInfo: true,
            },
          },
        },
      });

      // Return match information to trigger the match dialog
      return NextResponse.json({
        isMatch: true,
        match: {
          id: match.id,
          users: [match.userA, match.userB],
          createdAt: match.createdAt,
        },
      });
    }

    // If no existing like from the other user, create a new like entry
    const like = await prismaClient.match.create({
      data: {
        userAId: userId,
        userBId: likedUserId,
        mutual: false
      },
    });

    return NextResponse.json({
      isMatch: false,
      like: {
        id: like.id,
        userAId: like.userAId,
        userBId: like.userBId,
        createdAt: like.createdAt,
      },
    });
  } catch (error) {
    console.error('Error processing like:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process like', message: (error as Error).message },
      { status: 500 }
    );
  }
}