import Skeleton from "./Skeleton"

export default function SkeletonCard({ height = "h-[200px]" }) {
  return (
    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-3.5">
      <Skeleton className={`${height} w-full rounded-xl`} />
      <div className="flex flex-col gap-2 px-1 pt-3">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-richblack-700 px-1 pt-3">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  )
}
