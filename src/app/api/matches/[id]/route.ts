import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prismaClient from '@/lib/prsimadb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetUserId = params.id

    const matches = await prismaClient.match.findMany({
      where: {
        OR: [
          { userAId: targetUserId },
          { userBId: targetUserId }
        ]
      },
      include: {
        userA: {
          include: {
            pastProjects: true,
            startupInfo: true
          }
        },
        userB: {
          include: {
            pastProjects: true,
            startupInfo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedMatches = matches.map(match => ({
      id: match.id,
      mutual: match.mutual,
      createdAt: match.createdAt,
      profile: match.userAId === targetUserId ? match.userB : match.userA
    }))

    const response = NextResponse.json(formattedMatches)
    
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}