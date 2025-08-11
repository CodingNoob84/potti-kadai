import { WishlistClientPage } from "@/components/website/wishlist/wishlist-page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return <WishlistClientPage />;
}
