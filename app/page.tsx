import { getData } from "@/actions/todoActions";
import Todos from "../components/todos";
import { syncUser } from "@/actions/userActions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // Proteksi di level page sebagai safety net
  if (!user) {
    redirect("/sign-in");
  }

  // Sinkronisasi data Clerk ke Database Neon
  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.username ||
    "User";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  await syncUser(user.id, userName, userEmail);

  // Ambil data todos milik user
  const data = await getData(user.id);

  return (
    <div className="min-h-[90vh] bg-zinc-50/50 font-sans">
      <main className="flex flex-col items-center justify-start py-12 px-6 sm:px-16 container mx-auto">
        <Todos todos={data} userId={user.id} />
      </main>
    </div>
  );
}
