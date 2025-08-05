"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Define types
type CountrySize = {
  countryName: string;
  sizeLabel: string;
};

type Size = {
  sizeId: number;
  label: string;
  sizeNumber: number;
  countries: CountrySize[];
};

type SizeType = {
  sizeTypeId: number;
  sizeTypeName: string;
  sizes: Size[];
};

// Sample data
const sizeData: SizeType[] = [
  {
    sizeTypeId: 1,
    sizeTypeName: "Topwear",
    sizes: [
      {
        sizeId: 1,
        label: "XS",
        sizeNumber: 86,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "34",
          },
          {
            countryName: "EU",
            sizeLabel: "44",
          },
          {
            countryName: "US",
            sizeLabel: "32",
          },
          {
            countryName: "UK",
            sizeLabel: "6",
          },
        ],
      },
      {
        sizeId: 2,
        label: "S",
        sizeNumber: 91,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "36",
          },
          {
            countryName: "EU",
            sizeLabel: "46",
          },
          {
            countryName: "US",
            sizeLabel: "34",
          },
          {
            countryName: "UK",
            sizeLabel: "8",
          },
        ],
      },
      {
        sizeId: 3,
        label: "M",
        sizeNumber: 96,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "38",
          },
          {
            countryName: "EU",
            sizeLabel: "48",
          },
          {
            countryName: "US",
            sizeLabel: "36",
          },
          {
            countryName: "UK",
            sizeLabel: "10",
          },
        ],
      },
      {
        sizeId: 4,
        label: "L",
        sizeNumber: 101,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "40",
          },
          {
            countryName: "EU",
            sizeLabel: "50",
          },
          {
            countryName: "US",
            sizeLabel: "38",
          },
          {
            countryName: "UK",
            sizeLabel: "12",
          },
        ],
      },
      {
        sizeId: 5,
        label: "XL",
        sizeNumber: 106,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "42",
          },
          {
            countryName: "EU",
            sizeLabel: "52",
          },
          {
            countryName: "US",
            sizeLabel: "40",
          },
          {
            countryName: "UK",
            sizeLabel: "14",
          },
        ],
      },
      {
        sizeId: 6,
        label: "XXL",
        sizeNumber: 111,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "44",
          },
          {
            countryName: "EU",
            sizeLabel: "54",
          },
          {
            countryName: "US",
            sizeLabel: "42",
          },
          {
            countryName: "UK",
            sizeLabel: "16",
          },
        ],
      },
    ],
  },
  {
    sizeTypeId: 2,
    sizeTypeName: "Bottomwear",
    sizes: [
      {
        sizeId: 7,
        label: "XS",
        sizeNumber: 71,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "28",
          },
          {
            countryName: "EU",
            sizeLabel: "42",
          },
          {
            countryName: "US",
            sizeLabel: "26",
          },
          {
            countryName: "UK",
            sizeLabel: "6",
          },
        ],
      },
      {
        sizeId: 8,
        label: "S",
        sizeNumber: 76,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "30",
          },
          {
            countryName: "EU",
            sizeLabel: "44",
          },
          {
            countryName: "US",
            sizeLabel: "28",
          },
          {
            countryName: "UK",
            sizeLabel: "8",
          },
        ],
      },
      {
        sizeId: 9,
        label: "M",
        sizeNumber: 81,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "32",
          },
          {
            countryName: "EU",
            sizeLabel: "46",
          },
          {
            countryName: "US",
            sizeLabel: "30",
          },
          {
            countryName: "UK",
            sizeLabel: "10",
          },
        ],
      },
      {
        sizeId: 10,
        label: "L",
        sizeNumber: 86,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "34",
          },
          {
            countryName: "EU",
            sizeLabel: "48",
          },
          {
            countryName: "US",
            sizeLabel: "32",
          },
          {
            countryName: "UK",
            sizeLabel: "12",
          },
        ],
      },
      {
        sizeId: 11,
        label: "XL",
        sizeNumber: 91,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "36",
          },
          {
            countryName: "EU",
            sizeLabel: "50",
          },
          {
            countryName: "US",
            sizeLabel: "34",
          },
          {
            countryName: "UK",
            sizeLabel: "14",
          },
        ],
      },
      {
        sizeId: 12,
        label: "XXL",
        sizeNumber: 96,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "38",
          },
          {
            countryName: "EU",
            sizeLabel: "52",
          },
          {
            countryName: "US",
            sizeLabel: "36",
          },
          {
            countryName: "UK",
            sizeLabel: "16",
          },
        ],
      },
    ],
  },
  {
    sizeTypeId: 3,
    sizeTypeName: "Freesize",
    sizes: [
      {
        sizeId: 21,
        label: "F",
        sizeNumber: 100,
        countries: [],
      },
    ],
  },
  {
    sizeTypeId: 4,
    sizeTypeName: "Footwear",
    sizes: [
      {
        sizeId: 13,
        label: "4",
        sizeNumber: 22,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "4",
          },
          {
            countryName: "EU",
            sizeLabel: "20",
          },
          {
            countryName: "UK",
            sizeLabel: "3",
          },
          {
            countryName: "US",
            sizeLabel: "4",
          },
        ],
      },
      {
        sizeId: 14,
        label: "5",
        sizeNumber: 23,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "5",
          },
          {
            countryName: "EU",
            sizeLabel: "21",
          },
          {
            countryName: "UK",
            sizeLabel: "4",
          },
          {
            countryName: "US",
            sizeLabel: "5",
          },
        ],
      },
      {
        sizeId: 15,
        label: "6",
        sizeNumber: 24,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "6",
          },
          {
            countryName: "EU",
            sizeLabel: "22",
          },
          {
            countryName: "UK",
            sizeLabel: "5",
          },
          {
            countryName: "US",
            sizeLabel: "6",
          },
        ],
      },
      {
        sizeId: 16,
        label: "7",
        sizeNumber: 25,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "7",
          },
          {
            countryName: "EU",
            sizeLabel: "23",
          },
          {
            countryName: "UK",
            sizeLabel: "6",
          },
          {
            countryName: "US",
            sizeLabel: "7",
          },
        ],
      },
      {
        sizeId: 17,
        label: "8",
        sizeNumber: 26,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "8",
          },
          {
            countryName: "EU",
            sizeLabel: "24",
          },
          {
            countryName: "UK",
            sizeLabel: "7",
          },
          {
            countryName: "US",
            sizeLabel: "8",
          },
        ],
      },
      {
        sizeId: 18,
        label: "9",
        sizeNumber: 27,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "9",
          },
          {
            countryName: "EU",
            sizeLabel: "25",
          },
          {
            countryName: "UK",
            sizeLabel: "8",
          },
          {
            countryName: "US",
            sizeLabel: "9",
          },
        ],
      },
      {
        sizeId: 19,
        label: "10",
        sizeNumber: 28,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "10",
          },
          {
            countryName: "EU",
            sizeLabel: "26",
          },
          {
            countryName: "UK",
            sizeLabel: "9",
          },
          {
            countryName: "US",
            sizeLabel: "10",
          },
        ],
      },
      {
        sizeId: 20,
        label: "11",
        sizeNumber: 29,
        countries: [
          {
            countryName: "IND",
            sizeLabel: "11",
          },
          {
            countryName: "EU",
            sizeLabel: "27",
          },
          {
            countryName: "UK",
            sizeLabel: "10",
          },
          {
            countryName: "US",
            sizeLabel: "11",
          },
        ],
      },
    ],
  },
];

export default function SizeManagementPage() {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSize, setNewSize] = useState<Omit<Size, "sizeId">>({
    label: "",
    sizeNumber: 0,
    countries: [],
  });

  const handleAddSize = () => {
    // In a real app, you would add this to your state/API
    console.log("Adding new size:", newSize);
    setIsAddDialogOpen(false);
    setNewSize({
      label: "",
      sizeNumber: 0,
      countries: [],
    });
  };

  const handleDeleteSelected = () => {
    console.log("Deleting sizes:", selectedSizes);
    setSelectedSizes([]);
  };

  // Function to get all available countries for a specific size type
  const getCountriesForType = (sizeType: SizeType) => {
    return Array.from(
      new Set(
        sizeType.sizes.flatMap((size) =>
          size.countries.map((c) => c.countryName)
        )
      )
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Size Management</h1>
        <div className="flex gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Size</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Size</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sizeType" className="text-right">
                    Size Type
                  </Label>
                  <select
                    id="sizeType"
                    className="col-span-3 p-2 border rounded"
                    onChange={(e) => {
                      const type = sizeData.find(
                        (t) => t.sizeTypeId === Number(e.target.value)
                      );
                      if (type) {
                        setNewSize((prev) => ({
                          ...prev,
                          countries: getCountriesForType(type).map(
                            (country) => ({
                              countryName: country,
                              sizeLabel: "",
                            })
                          ),
                        }));
                      }
                    }}
                  >
                    <option value="">Select size type</option>
                    {sizeData.map((type) => (
                      <option key={type.sizeTypeId} value={type.sizeTypeId}>
                        {type.sizeTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    Label
                  </Label>
                  <Input
                    id="label"
                    value={newSize.label}
                    onChange={(e) =>
                      setNewSize({ ...newSize, label: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sizeNumber" className="text-right">
                    Size Number
                  </Label>
                  <Input
                    id="sizeNumber"
                    type="number"
                    value={newSize.sizeNumber}
                    onChange={(e) =>
                      setNewSize({
                        ...newSize,
                        sizeNumber: Number(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                {newSize.countries.map((country, index) => (
                  <div
                    key={country.countryName}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={country.countryName} className="text-right">
                      {country.countryName}
                    </Label>
                    <Input
                      id={country.countryName}
                      value={country.sizeLabel}
                      onChange={(e) => {
                        const updatedCountries = [...newSize.countries];
                        updatedCountries[index].sizeLabel = e.target.value;
                        setNewSize({ ...newSize, countries: updatedCountries });
                      }}
                      className="col-span-3"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleAddSize}>Save Size</Button>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedSizes.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {sizeData.map((sizeType) => {
          const availableCountries = getCountriesForType(sizeType);

          return (
            <Card key={sizeType.sizeTypeId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{sizeType.sizeTypeName}</span>
                  <Badge variant="outline">
                    {sizeType.sizes.length}{" "}
                    {sizeType.sizes.length === 1 ? "Size" : "Sizes"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sizeType.sizeTypeName === "Freesize" ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">One Size Fits All</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-2 border-b text-left font-medium">
                            Size
                          </th>
                          {availableCountries.map((country) => (
                            <th
                              key={country}
                              className="p-2 border-b text-left font-medium"
                            >
                              {country}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeType.sizes.map((size) => (
                          <tr
                            key={size.sizeId}
                            className={`border-b last:border-b-0 ${
                              selectedSizes.includes(size.sizeId)
                                ? "bg-muted/50"
                                : ""
                            } hover:bg-muted/30`}
                          >
                            <td className="p-2 font-medium">{size.label}</td>
                            {availableCountries.map((country) => (
                              <td key={country} className="p-2">
                                {size.countries.find(
                                  (c) => c.countryName === country
                                )?.sizeLabel || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
