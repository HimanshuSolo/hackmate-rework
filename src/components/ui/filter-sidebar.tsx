import { ScrollArea } from '@/components/ui/scroll-area'
import FilterPanel from './filter-panel'
import { FilterOptions } from '../../types'
import { M_PLUS_1p } from 'next/font/google'

interface FilterSidebarProps {
  filters: FilterOptions
  userCoordinates: { latitude: number; longitude: number; geohash: string } | null
  isSavingLocation: boolean
  locationPermissionRequested: boolean
  requestLocationPermission: () => void
  handleFilterChange: (newFilters: Partial<FilterOptions>) => void
}

const mPlus1p = M_PLUS_1p({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700']
})

export default function FilterSidebar({
  filters,
  userCoordinates,
  isSavingLocation,
  locationPermissionRequested,
  requestLocationPermission,
  handleFilterChange
}: FilterSidebarProps) {
  return (
    <div  className={`${mPlus1p.className} w-[500px] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-lg p-5`}>
      <h2 className="text-2xl font-bold text-white/90 mb-6" style={{ fontWeight: 700 }}>Filters</h2>
      <ScrollArea className="h-[calc(100vh-210px)] bg-transparent rounded-lg">
        <FilterPanel
          filters={filters}
          userCoordinates={userCoordinates}
          isSavingLocation={isSavingLocation}
          locationPermissionRequested={locationPermissionRequested}
          requestLocationPermission={requestLocationPermission}
          handleFilterChange={handleFilterChange}
          isDesktop={true}
        />
      </ScrollArea>
    </div>
  )
}