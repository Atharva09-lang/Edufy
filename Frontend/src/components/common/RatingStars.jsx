import React, { useEffect, useState } from "react"
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti"

function RatingStars({ Review_Count, Star_Size }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  })

  useEffect(() => {
    const wholeStars = Math.floor(Review_Count) || 0
    SetStarCount({
      full: wholeStars,
      half: Number.isInteger(Review_Count) ? 0 : 1,
      empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
    })
  }, [Review_Count])

  return (
    <div className="flex gap-0.5 text-[#F59E0B]">
      {[...new Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={i} size={Star_Size || 18} />
      ))}
      {[...new Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={i} size={Star_Size || 18} />
      ))}
      {[...new Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={i} size={Star_Size || 18} className="text-[#CBD5E1]" />
      ))}
    </div>
  )
}

export default RatingStars;