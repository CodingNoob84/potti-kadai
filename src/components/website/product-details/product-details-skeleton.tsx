export function ProductDetailSkeleton() {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            {i < 3 && <div className="h-4 w-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Images - Column 1 */}
        <div className="space-y-3">
          {/* Main Image Skeleton */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-200 animate-pulse" />

          {/* Thumbnail Images Skeleton */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Details - Column 2 */}
        <div className="space-y-5">
          {/* Title and Rating */}
          <div>
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
          </div>

          {/* Price */}
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Color Selection */}
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mb-1" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculation - Column 3 */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="border shadow-sm rounded-lg p-4 bg-gray-50 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Offers Card */}
          <div className="border shadow-sm rounded-lg p-4 bg-gray-50 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
