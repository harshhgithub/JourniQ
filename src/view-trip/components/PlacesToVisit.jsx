import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip }) {
  const itinerary = Array.isArray(trip.tripData?.itinerary)
    ? trip.tripData.itinerary
    : []

  if (itinerary.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="font-bold text-2xl mb-8 text-neutral-900 dark:text-neutral-100">
          Places to Visit
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          No itinerary available for this trip.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      {/* Section heading */}
      <h2 className="font-bold text-2xl mb-8 text-neutral-900 dark:text-neutral-100">
        Places to Visit
      </h2>

      {itinerary.map((item, index) => (
        <div key={index} className="mb-10">
          {/* Day heading */}
          <h3 className="font-semibold text-xl mb-6 text-neutral-800 dark:text-neutral-200 border-b border-neutral-300 dark:border-neutral-700 pb-2">
            {item.day}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {item.plan?.map((place, idx) => (
              <div key={idx}>
                {/* Time label */}
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  • {place.time}
                </p>

                {/* Place card */}
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlacesToVisit

