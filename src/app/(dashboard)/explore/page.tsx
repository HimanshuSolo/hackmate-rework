'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMediaQuery } from '@/hooks/use-media-query'
import axios from 'axios'

// Custom hooks
import { useLocationServices } from '../../../hooks/use-location-services'
import { useUserPreferences } from '../../../hooks/use-user-preferences'
import { useProfileFiltering } from '../../../hooks/use-profile-filtering'
import { useSwipeActions } from '../../../hooks/use-swipe-actions'

// Components
import FilterSidebar from '../../../components/ui/filter-sidebar'
import MobileFilterSheet from '../../../components/ui/mobile-filter-sheet'
import ProfileCard from '../../../components/ui/profile-card'
import LoadingState from '../../../components/ui/loading-state'
import EmptyState from '../../../components/ui/empty-state'
import NoMoreProfilesState from '../../../components/ui/no-more-profiles-state'
import MatchDialog from '../../../components/ui/match-dialogue'
// import PaginationControls from '../../../components/ui/pagination-controls'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


export default function Explore() {
  const { user: clerkUser } = useUser()
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const [filterOpen, setFilterOpen] = useState(false)
  const [matchDialogOpen, setMatchDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isRefreshingProfiles, setIsRefreshingProfiles] = useState(false)
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!clerkUser?.id) return;
      
      setIsLoadingUser(true);
      try {
        const [userResponse, bookmarksResponse] = await Promise.all([
          axios.get(`/api/user/${clerkUser.id}`),
          axios.get('/api/bookmarks')
        ]);
        
        setCurrentUser(userResponse.data);
        const bookmarkIds = new Set<string>(bookmarksResponse.data.map((b: any) => String(b.profileId)));
        setBookmarkedProfiles(bookmarkIds);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          router.push('/onboarding');
        }
        if(error instanceof Error){
          toast.error('Error while fetching user data');
          console.error('Error while fetching user data:', error.message);
        }
        else{
          toast.error('Error while fetching user data');
        }
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchCurrentUser();
  }, [clerkUser?.id]);
  
  // Custom hooks
  const { 
    userCoordinates, 
    isSavingLocation, 
    locationPermissionRequested, 
    requestLocationPermission 
  } = useLocationServices(clerkUser?.id)
  
  const {
    filters,
    handleFilterChange: originalHandleFilterChange
  } = useUserPreferences()
  
  const {
    filteredUsers,
    currentIndex,
    setCurrentIndex,
    matches,
    selectedMatch,
    setSelectedMatch,
    setMatches,
    refreshFilteredUsers,
    resetViewedProfiles,
    isLoading: isLoadingProfiles,
    viewCurrentProfile
  } = useProfileFiltering({
    ...filters,
    userCoordinates: userCoordinates
  });
  
  // Wrapper to handle filter changes and refresh profiles
  const handleFilterChange = useCallback((newFilters: any) => {
    originalHandleFilterChange(newFilters)
    // Reset current index when filters change for immediate UI feedback
    setCurrentIndex(0)
  }, [originalHandleFilterChange, setCurrentIndex])
  
  // Handle starting over
const handleStartOver = useCallback(async () => {
  setIsRefreshingProfiles(true);
  
  try {
    // Reset current index immediately for responsive UI
    setCurrentIndex(0);
    
    // Perform these operations in parallel
    await Promise.all([
      resetViewedProfiles(),
      // Refresh profiles after resetting viewed profiles
      refreshFilteredUsers()
    ]);
  } catch (error) {
    toast.error('Error while starting over');
    console.error('Error starting over:', error);
  } finally {
    setIsRefreshingProfiles(false);
  }
}, [resetViewedProfiles, refreshFilteredUsers, setCurrentIndex]);

  // this handles bookmark add or remove
  const handleBookmark = async () => {
    const currentProfile = filteredUsers[currentIndex];
    if (!currentProfile) return;

    const isCurrentlyBookmarked = bookmarkedProfiles.has(currentProfile.id);
    
    try {
      if (isCurrentlyBookmarked) {
        await axios.delete(`/api/bookmarks?profileId=${currentProfile.id}`);
        setBookmarkedProfiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentProfile.id);
          return newSet;
        });
        toast.success('Removed from saved');
      } else {
        await axios.post('/api/bookmarks', { profileId: currentProfile.id });
        setBookmarkedProfiles(prev => new Set(prev).add(currentProfile.id));
        toast.success('Saved to bookmarks');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };
  
  const {
    x,
    rotate,
    opacity,
    likeOpacity,
    nopeOpacity,
    handleLike,
    handlePass
  } = useSwipeActions(
    filteredUsers[currentIndex], 
    currentIndex, 
    filteredUsers.length, 
    setCurrentIndex, 
    matches, 
    setMatches, 
    setSelectedMatch, 
    setMatchDialogOpen,
    viewCurrentProfile
  )

  // Render logic
  const renderMainContent = () => {
    if (isLoadingUser|| isLoadingProfiles || isRefreshingProfiles) {
      return <LoadingState />
    }

    if (isRefreshingProfiles) {
    return <LoadingState message="Refreshing profiles..." />
    }
    
    if (filteredUsers.length === 0) {
      return <EmptyState onAdjustFilters={() => setFilterOpen(true)} />
    }
    
    if (currentIndex >= filteredUsers.length) {
        return (
          <NoMoreProfilesState 
            onStartOver={handleStartOver} 
            onAdjustFilters={() => setFilterOpen(true)}
            isRefreshing={isRefreshingProfiles}
          />
        )
      }
    
    return (
      <>
        <ProfileCard
          activeUser={filteredUsers[currentIndex]}
          x={x}
          rotate={rotate}
          opacity={opacity}
          likeOpacity={likeOpacity}
          nopeOpacity={nopeOpacity}
          handleLike={handleLike}
          handlePass={handlePass}
          isBookmarked={bookmarkedProfiles.has(filteredUsers[currentIndex].id)}
          onBookmark={handleBookmark}
        />
      </>
    )
  }

  return (
    <div className="container mx-auto my-auto lg:pt-6 px-4 space-y-3">
      {!isDesktop && (
        <MobileFilterSheet 
          open={filterOpen} 
          onOpenChange={setFilterOpen}
          filters={filters}
          userCoordinates={userCoordinates}
          isSavingLocation={isSavingLocation}
          locationPermissionRequested={locationPermissionRequested}
          requestLocationPermission={requestLocationPermission}
          handleFilterChange={handleFilterChange}
        />
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`w-full ${isDesktop ? 'lg:w-2/3' : ''}`}>
          {renderMainContent()}
        </div>
        
        {isDesktop && (
          <FilterSidebar 
            filters={filters}
            userCoordinates={userCoordinates}
            isSavingLocation={isSavingLocation}
            locationPermissionRequested={locationPermissionRequested}
            requestLocationPermission={requestLocationPermission}
            handleFilterChange={handleFilterChange}
          />
        )}
      </div>
      
      <MatchDialog 
        open={matchDialogOpen} 
        onOpenChange={setMatchDialogOpen}
        currentUser={currentUser ?? null}
        matchedUser={selectedMatch}
        onContinueSwiping={() => {
          setMatchDialogOpen(false);
        }}
        onStartChat={() => {
          // Navigate to chat with matched user
          setMatchDialogOpen(false);
          // You might want to redirect to a chat page
          // router.push(`/chat/${selectedMatch?.id}`);
        }}
      />
    </div>
  )
}
