"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllSizesWithCategory } from "@/server/categories";
import { Size } from "@/types/categories";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AddEditSize } from "./add-edit-sizes";

export const SizesBlock = () => {
  //const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryFn: getAllSizesWithCategory,
    queryKey: ["all-sizes"],
  });

  const groupSizesByCategoryType = (data: Size[] = []) => {
    return data.reduce((acc, size) => {
      const groupKey = `${size.categoryName} - ${size.type}`;
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(size);
      return acc;
    }, {} as Record<string, Size[]>);
  };

  const grouped = groupSizesByCategoryType(data);

  const handleDelete = () => {
    toast.info("Only Super Admin Can Delete!!!");
  };

  return (
    <div className="p-2 space-y-8">
      {Object.entries(grouped).map(([groupKey, sizes]) => (
        <div key={groupKey}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{groupKey}</h2>
            <AddEditSize type="Add" sizeType={sizes[0].type} />
          </div>

          <Card>
            <CardContent className="px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>UK</TableHead>
                    <TableHead>US</TableHead>
                    <TableHead>EU</TableHead>
                    <TableHead>Indian</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-[80px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : sizes.map((size) => (
                        <TableRow key={size.id}>
                          <TableCell className="font-medium">
                            {size.name}
                          </TableCell>
                          <TableCell>{size.ukSize || "-"}</TableCell>
                          <TableCell>{size.usSize || "-"}</TableCell>
                          <TableCell>{size.euSize || "-"}</TableCell>
                          <TableCell>{size.indiaSize || "-"}</TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-2">
                              <AddEditSize
                                type="Edit"
                                sizeType={size.type}
                                initialSize={size}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
