import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prismaClient from '@/lib/prsimadb'
import { getValue, setValue } from '@/lib/redis'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cacheKey = `matches:${userId}`
    
    const cachedMatches = await getValue(cacheKey)
    if (cachedMatches) {
      return NextResponse.json(JSON.parse(cachedMatches))
    }

    const matches = await prismaClient.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
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

    const formattedMatches = matches.map((match: any) => ({
      id: match.id,
      mutual: match.mutual,
      createdAt: match.createdAt,
      profile: match.userAId === userId ? match.userB : match.userA
    }))

    await setValue(cacheKey, JSON.stringify(formattedMatches), 30)
    
    return NextResponse.json(formattedMatches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 50 })
  }
}