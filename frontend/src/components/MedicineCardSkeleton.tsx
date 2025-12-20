interface MedicineCardSkeletonProps {
    viewMode: 'grid' | 'list';
}

const MedicineCardSkeleton = ({ viewMode }: MedicineCardSkeletonProps) => {
    if (viewMode === 'list') {
        return (
            <div className="flex flex-row items-center p-4 gap-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col py-1 gap-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2 w-full max-w-md">
                            <div className="h-6 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-1/2" />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="h-6 w-20 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                        <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                    <div className="space-y-1 text-right">
                        <div className="h-3 w-8 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse ml-auto" />
                        <div className="h-7 w-20 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-28 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="h-48 w-full bg-gray-100 dark:bg-gray-700/50 animate-pulse" />
            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                    <div className="h-6 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-1/2" />
                </div>

                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                </div>

                <div className="mt-auto flex items-end justify-between pt-2">
                    <div className="space-y-1">
                        <div className="h-3 w-8 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                        <div className="h-7 w-20 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-28 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default MedicineCardSkeleton;
