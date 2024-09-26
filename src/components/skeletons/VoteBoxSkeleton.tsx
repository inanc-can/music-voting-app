export function VoteBoxSkeleton() {
  return (
    <div className="h-60 group overflow-hidden rounded-lg bg-transparent animate-pulse">
      <div className="w-48 h-48 relative p-8">
        <div className="absolute top-2 right-2 rounded-full text-md px-2 py-1 font-semibold bg-gray-400"></div>
        <div className="w-full h-full bg-gray-400 rounded-lg"></div>
        <div className="mt-4 text-center">
          <div className="h-4 bg-gray-400 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-400 rounded w-1/2 mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  );
}
