'use client'

import TextArea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Forward, Trash2 } from "lucide-react";
import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, orderBy, where, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

interface TaskProps {
    id: string;
    tarefa: string;
    created: Date;
    user: string;
    public: boolean;
}

export default function Dashboard() {
    const [input, setInput] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const handleChangePublic = (e: ChangeEvent<HTMLInputElement>) => {
        setIsPublic(e.target.checked);
    };

    const handleRegisterTask = async (e: FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        try {
            await addDoc(collection(db, "tasks"), {
                tarefa: input.trim(),
                created: new Date(),
                user: userEmail,
                public: isPublic
            });

            setInput('');
            setIsPublic(false);
        } catch (error) {
            console.error("Error registering task:", error);
        }
    };

    useEffect(() => {
        if (!userEmail) return;

        const loadTasks = () => {
            const tasksCollection = collection(db, "tasks");
            const tasksQuery = query(
                tasksCollection,
                orderBy("created", "desc"),
                where("user", "==", userEmail)
            );

            const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
                const tasksList: TaskProps[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    tarefa: doc.data().tarefa,
                    created: doc.data().created.toDate(),
                    user: doc.data().user,
                    public: doc.data().public
                }));

                setTasks(tasksList);
            });

            return unsubscribe;
        };

        const unsubscribe = loadTasks();
        return () => unsubscribe && unsubscribe();
    }, [userEmail]);

    async function handleShareTask(id: string) {
        await navigator.clipboard.writeText(`${window.location.origin}/tasks/${id}`);
        toast.success("Link copiado com sucesso!");
    }

    async function handleDeleteTask(id: string) {
        const docRef = doc(db, "tasks", id)
        await deleteDoc(docRef);
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-black items-center">
            <Head>
                <title>Dashboard</title>
            </Head>

            <main className="flex flex-col w-full max-w-6xl mt-10 p-16">
                <section className="flex flex-col">
                    <div>
                        <h1 className="text-white mb-6 text-2xl font-semibold">
                            Qual sua tarefa?
                        </h1>

                        <form onSubmit={handleRegisterTask}>
                            <TextArea
                                value={input}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                                placeholder="Digite qual sua tarefa..." />
                            <div className="flex items-center mt-4">
                                <Input
                                    checked={isPublic}
                                    onChange={handleChangePublic}
                                    type="checkbox"
                                    className="size-5 mr-2" />
                                <Label htmlFor="tarefa" className="text-white">
                                    Deixar tarefa pública?
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-6 bg-blue-500 text-white py-6 px-4 rounded-md hover:bg-blue-600"
                            >
                                Registrar
                            </Button>
                        </form>
                    </div>
                </section>

                <section className="mt-10 flex flex-col ">
                    <h1 className="text-white text-center text-3xl font-semibold">Minhas tarefas</h1>
                    {tasks.map((task) => (
                        <article
                            key={task.id}
                            className="border border-gray-700 rounded-lg py-4 px-5 mt-4 bg-zinc-900 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                {task.public ? (
                                    <>
                                        <Label
                                            htmlFor="public"
                                            className="text-white bg-blue-600 px-2 py-1 rounded-md text-sm"
                                        >
                                            Public
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                className="hover:bg-zinc-800 p-1"
                                                aria-label="Compartilhar tarefa"
                                                onClick={() => { handleShareTask(task.id) }}
                                            >
                                                <Forward className="text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="hover:bg-zinc-800 p-1"
                                                aria-label="Excluir tarefa"
                                                onClick={() => { handleDeleteTask(task.id) }}
                                            >
                                                <Trash2 className="text-red-600" />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-zinc-800 ml-auto p-1"
                                        aria-label="Excluir tarefa"
                                        onClick={() => { handleDeleteTask(task.id) }}
                                    >
                                        <Trash2 className="text-red-600" />
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-col">
                                {task.public ? (
                                    <Link href={`/task/${task.id}`}>
                                        <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                                            {task.tarefa}
                                        </p>
                                    </Link>
                                ) : (
                                    <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                                        {task.tarefa}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </section>



            </main>
        </div>
    );
}
