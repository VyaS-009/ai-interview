import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg">
            <Skeleton className="h-10 w-10 mb-3 rounded-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3 mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
