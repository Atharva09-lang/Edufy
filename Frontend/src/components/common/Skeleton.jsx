export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-richblack-700 bg-[length:1000px_100%] bg-gradient-to-r from-richblack-700 via-richblack-600 to-richblack-700 ${className}`}
    />
  )
}