export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl p-3 h-full flex flex-col border border-gray-100">
            <div className="aspect-[4/5] w-full rounded-xl skeleton mb-4" />
            <div className="flex flex-col flex-1 px-1 gap-2">
                <div className="h-3 w-1/3 skeleton rounded" />
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-3.5 h-3.5 skeleton rounded-full" />
                    ))}
                </div>
                <div className="mt-auto h-5 w-1/4 skeleton rounded" />
                <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-3.5 h-3.5 skeleton rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
