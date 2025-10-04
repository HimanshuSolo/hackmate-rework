import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prismaClient from '@/lib/prsimadb'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profileId } = await request.json()
    
    const bookmark = await prismaClient.bookmark.create({
      data: {
        userId,
        profileId
      }
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    await prismaClient.bookmark.delete({
      where: {
        userId_profileId: {
          userId,
          profileId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookmarks = await prismaClient.bookmark.findMany({
      where: { userId },
      include: {
        profile: {
          include: {
            pastProjects: true,
            startupInfo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}