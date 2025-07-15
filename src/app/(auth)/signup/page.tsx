import { GoogleAuth } from "@/components/auth/google-auth";
import { SignUpForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const SignUpLoading = () => {
  return (
    <>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </>
  );
};

export default function SignupPage() {
  return (
    <div className="min-h-screen h-full grid lg:grid-cols-2">
      {/* Left side - Signup Form */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary">PottiKadai</h1>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to start shopping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={<SignUpLoading />}>
                <SignUpForm />

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <GoogleAuth />
              </Suspense>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative group overflow-hidden h-full">
        <Image
          src="/images/auth/signup.png"
          alt="Fashion shopping"
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Discover Fashion</h3>
          <p className="text-lg opacity-90">
            Shop the latest trends in men&apos;s, women&apos;s, and kids&apos;
            fashion
          </p>
        </div>
      </div>
    </div>
  );
}
