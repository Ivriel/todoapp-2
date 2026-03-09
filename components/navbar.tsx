"use client";

import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const { isSignedIn, user } = useUser();

    return (
        <nav className="h-[10vh] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100">
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <Image src="/todo-logo.png" alt="Logo" width={50} height={50} />
                    <span className="text-xl font-bold text-zinc-900 tracking-tight hidden sm:block">
                        NotesApp
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {isSignedIn ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-semibold text-zinc-900">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox:
                                        "w-10 h-10 border-2 border-zinc-100 hover:border-zinc-200 transition-all",
                                },
                            }}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </nav>
    );
}
