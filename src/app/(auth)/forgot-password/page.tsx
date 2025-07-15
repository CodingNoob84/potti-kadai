"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailQuestion, ShieldAlert, Smile, UserX2 } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-10">
      <Card className="w-full max-w-lg shadow-xl border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-semibold flex items-center justify-center gap-3 text-destructive">
            <UserX2 className="w-6 h-6" />
            Forgot Your Password?
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldAlert className="w-5 h-5 text-yellow-500 mt-0.5" />
            <span>
              If you can&apos;t remember your password, what <em>can</em> you
              remember?
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Smile className="w-5 h-5 text-green-500 mt-0.5" />
            <span>Your dreams? Your Wi-Fi password? Your purpose?</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MailQuestion className="w-5 h-5 text-blue-500 mt-0.5" />
            <span>Don’t worry. Even geniuses forget sometimes.</span>
          </div>

          <p className="text-xs text-muted-foreground italic mt-6">
            Or contact us personally. We’ll laugh <strong>with</strong> you, not{" "}
            <strong>at</strong> you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
