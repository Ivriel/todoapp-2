import { getData } from "@/actions/todoActions";
import Todos from "../components/todos";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, createFallbackUser } from "@/actions/userActions";

export default async function Home() {
  const user = await currentUser();

  // Proteksi di level page sebagai safety net
  if (!user) {
    redirect("/sign-in");
  }

  // Fallback Sync: Cek apakah user sudah ada di database (UUID Postgres)
  let dbUser = await getUserByClerkId(user.id);

  if (!dbUser) {
    // Jika webhook belum jalan tapi user sudah buka halaman ini, kita buat darurat
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "User";
    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    dbUser = await createFallbackUser(user.id, userName, userEmail);

    // Jika masih gagal (misal race condition), redirect kembali
    if (!dbUser) {
      redirect("/sign-in");
    }
  }

  // Gunakan ID dari Postgres (UUID), BUKAN dari Clerk!
  const data = await getData(dbUser.id);

  return (
    <div className="min-h-[90vh] bg-zinc-50/50 font-sans">
      <main className="flex flex-col items-center justify-start py-12 px-6 sm:px-16 container mx-auto">
        <Todos todos={data} userId={dbUser.id} />
      </main>
    </div>
  );
}
