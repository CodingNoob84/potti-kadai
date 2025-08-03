// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { MultiSelect } from "@/components/ui/multi-select";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { productCreateType } from "@/form-schemas/product";
// import { UseFormReturn } from "react-hook-form";

// const genderList = [
//   {
//     value: "1",
//     label: "Men",
//   },
//   {
//     value: "2",
//     label: "Women",
//   },
//   {
//     value: "3",
//     label: "BoyKids",
//   },
//   {
//     value: "4",
//     label: "GirlKids",
//   },
// ];

// type Props = {
//   form: UseFormReturn<productCreateType>;
// };

// export const ProductBasicInfo = ({ form }: Props) => {
//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle>Basic Information</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter product title" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Description</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Enter product description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Price (₹)</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="isactive"
//             render={({ field }) => (
//               <FormItem className="flex items-center space-x-2 pt-6">
//                 <FormControl>
//                   <Switch
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <FormLabel>Active for sale</FormLabel>
//               </FormItem>
//             )}
//           />
//         </div>
//         <FormField
//           control={form.control}
//           name="gender"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Gender</FormLabel>
//               <FormControl>
//                 <MultiSelect
//                   options={genderList}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                   placeholder="Select options"
//                   variant="inverted"
//                 />
//               </FormControl>

//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </CardContent>
//     </Card>
//   );
// };

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productCreateType } from "@/form-schemas/product";
import {
  getAllCategorieList,
  getSubCategoriesByCategoryId,
} from "@/server/categories";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

const genderOptions = [
  { value: "1", label: "Men" },
  { value: "2", label: "Women" },
  { value: "3", label: "Boy Kids" },
  { value: "4", label: "Girl Kids" },
];

export const ProductBasicInfo = ({
  form,
}: {
  form: UseFormReturn<productCreateType>;
}) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategorieList,
  });

  const selectedCategoryId = form.watch("category");
  //const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories-list"],
    queryFn: () => getSubCategoriesByCategoryId(selectedCategoryId),
    enabled: !!selectedCategoryId,
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Row 1: Title and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Cotton T-Shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 3: Active Status and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isactive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Available for sale
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender*</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={genderOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select target genders"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Category Field */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category*</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                        form.setValue("subcategory", 0);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Subcategory Field */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Subcategory</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                      disabled={!selectedCategoryId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              subcategories?.length
                                ? "Select subcategory"
                                : "No subcategories available"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories?.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
