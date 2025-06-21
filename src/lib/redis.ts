import { createClient } from 'redis';
import type { User } from '@prisma/client';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();

// User likes functions
export async function addLike(userId: string, likedUserId: string): Promise<boolean> {
  return await redisClient.sAdd(`likes:${userId}`, likedUserId) === 1;
}

export async function hasLiked(userId: string, likedUserId: string): Promise<boolean> {
  return await redisClient.sIsMember(`likes:${userId}`, likedUserId);
}

// Match queue functions
export async function addToMatchQueue(userId: string, matchUserId: string): Promise<void> {
  await redisClient.rPush(`matches:${userId}`, matchUserId);
}

export async function getNextMatch(userId: string): Promise<string | null> {
  return await redisClient.lPop(`matches:${userId}`);
}

// User profile cache functions
export async function cacheUserProfile(user: User): Promise<void> {
  // Only cache essential fields for profile browsing
  const userCache = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl || '',
    location: user.location,
    currentRole: user.currentRole,
    workingStyle: user.workingStyle,
    // Add other fields as needed
  };
  
  await redisClient.hSet(`user:${user.id}`, userCache);
  // Set expiration - 1 hour
  await redisClient.expire(`user:${user.id}`, 3600);
}

export async function getCachedUserProfile(userId: string): Promise<Record<string, string> | null> {
  const cachedUser = await redisClient.hGetAll(`user:${userId}`);
  return Object.keys(cachedUser).length > 0 ? cachedUser : null;
}

export async function invalidateUserCache(userId: string): Promise<void> {
  await redisClient.del(`user:${userId}`);
}