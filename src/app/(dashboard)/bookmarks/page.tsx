'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, MapPin, Briefcase, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import LoadingState from '@/components/ui/loading-state'

export default function BookmarksPage() {
  const { user } = useUser()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) return
      
      try {
        const response = await axios.get('/api/bookmarks')
        setBookmarks(response.data)
      } catch (error) {
        toast.error('Failed to load bookmarks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [user?.id])

  const removeBookmark = async (profileId: string) => {
    try {
      await axios.delete(`/api/bookmarks?profileId=${profileId}`)
      setBookmarks(prev => prev.filter(b => b.profileId !== profileId))
      toast.success('Removed from saved')
    } catch (error) {
      toast.error('Failed to remove bookmark')
    }
  }

  if (isLoading) return <LoadingState />

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="h-6 w-6 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">Saved Profiles</h1>
        <Badge variant="secondary" className="ml-2">{bookmarks.length}</Badge>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-400 mb-2">No saved profiles yet</h2>
          <p className="text-neutral-500">Start exploring and save profiles you're interested in!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {bookmark.profile.avatarUrl ? (
                      <img
                        src={bookmark.profile.avatarUrl}
                        alt={bookmark.profile.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-semibold">
                          {bookmark.profile.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{bookmark.profile.name}</h3>
                      <div className="flex items-center text-sm text-neutral-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {bookmark.profile.location}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBookmark(bookmark.profileId)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-neutral-400 mb-3">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {bookmark.profile.currentRole} • {bookmark.profile.yearsExperience}+ yrs
                </div>
                
                {bookmark.profile.skills && bookmark.profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bookmark.profile.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs bg-blue-900/40 text-blue-400">
                        {skill}
                      </Badge>
                    ))}
                    {bookmark.profile.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs text-neutral-400">
                        +{bookmark.profile.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {bookmark.profile.description && (
                  <p className="text-sm text-neutral-300 line-clamp-2">
                    {bookmark.profile.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}