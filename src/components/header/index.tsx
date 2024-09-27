"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    return (
        <div className="w-full bg-black">
            <header className="flex max-w-5xl mx-auto justify-between py-4 items-center">
                <nav className="flex items-center">
                    <Link href="/">
                        <h1 className="text-white text-3xl font-semibold">Tarefas<span className="text-red-600 pl-0.5">+</span></h1>
                    </Link>

                    {session ? (
                        <Button asChild className="bg-white mx-4 h-8" variant={"ghost"}>
                            <Link href="/dashboard">
                                <span className="text-black">Meu Painel</span>
                            </Link>
                        </Button>
                    ) : null}

                </nav>
                {session ? (
                    <Button
                        onClick={() => signOut()}
                        className="bg-transparent cursor-pointer py-2 px-16 border border-white rounded-3xl hover:bg-white hover:text-black">
                        Olá, {session.user?.name}
                    </Button>
                ) : (
                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="bg-transparent cursor-pointer py-2 px-16 border border-white rounded-3xl hover:bg-white hover:text-black">
                        Acessar
                    </Button>
                )}

            </header>
        </div>
    )
}