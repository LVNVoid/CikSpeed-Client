import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner Skeleton */}
      <Skeleton className="h-32 w-full rounded-lg mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card Skeleton */}
        <Card className="md:col-span-1 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 rounded-full mt-1" />
                  <div className="w-full">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information Card Skeleton */}
        <Card className="md:col-span-1 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Card Skeleton */}
        <Card className="md:col-span-1 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-24 w-full rounded-lg mt-4" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services Card Skeleton */}
        <Skeleton className="h-72 w-full rounded-lg" />

        {/* Promo Card Skeleton */}
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>

      {/* Stats Card Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg mt-8" />
    </div>
  );
};

export default PageSkeleton;
