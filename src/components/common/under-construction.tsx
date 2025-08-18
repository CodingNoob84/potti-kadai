"use client";
import { Hammer } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function UnderConstruction() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <Hammer className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Under Construction
          </CardTitle>
          <CardDescription className="mt-2">
            We&apos;re working hard to bring you this feature soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>This settings page is currently being developed.</p>
          <p className="mt-1">Please check back later.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="default" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
