'use client'

import { FormEvent, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import TextArea from '@/components/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';

interface TaskProps {
    tarefa: string;
    public: boolean;
    created: string;
    user: string;
    taskId: string;

}

interface CommentProps {
    id: string;
    comment: string;
    created: Date;
    user: string;
    name: string;
    taskId: string;
}


interface Params {
    id: string;
}

export default function TaskPage({ params }: { params: Params }) {
    const [task, setTask] = useState<TaskProps | null>(null);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [input, setInput] = useState('');
    const { data: session } = useSession();

    useEffect(() => {
        if (params.id) {
            (async () => {
                const taskData = await getTaskData(params.id);
                if (!taskData) {
                    window.location.href = '/';
                } else {
                    setTask(taskData);
                }
            })();
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            (async () => {
                const commentsData = await getComments(params.id);
                if (commentsData) {
                    setComments(commentsData);
                }
            })();
        }
    }, [params.id]);


    async function getTaskData(id: string): Promise<TaskProps | null> {
        try {
            const docRef = doc(db, 'tasks', id);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                console.error('Tarefa não encontrada.');
                return null;
            }

            const data = snapshot.data();
            if (!data?.public) {
                console.error('Tarefa privada.');
                return null;
            }

            const milliseconds = data.created.seconds * 1000;
            return {
                tarefa: data.tarefa,
                public: data.public,
                created: new Date(milliseconds).toLocaleDateString(),
                user: data.user,
                taskId: id,
            };
        } catch (error) {
            console.error('Erro ao buscar dados da tarefa:', error);
            return null;
        }
    }

    async function getComments(id: string): Promise<CommentProps[] | null> {
        try {
            const commentQuery = query(collection(db, 'comments'), where('taskId', '==', id));
            const snapshotComments = await getDocs(commentQuery);

            if (snapshotComments.empty) {
                console.error('Nenhum comentário encontrado.');
                return null;
            }

            const comments: CommentProps[] = snapshotComments.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    comment: data.comment,
                    created: data.created.toDate(),
                    user: data.user,
                    name: data.name,
                    taskId: data.taskId,
                };
            });

            return comments;
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return null;
        }
    }

    async function handleComment(e: FormEvent) {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'comments'), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: task?.taskId,
            });

            const data: CommentProps = {
                id: '',
                comment: input,
                created: new Date(),
                user: session?.user?.email || '',
                name: session?.user?.name || '',
                taskId: task?.taskId || '',
            };


            setComments(prevComments => [...prevComments, data]);
            setInput('');
            toast.success('Comentário enviado com sucesso!');

        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            toast.error('Erro ao enviar comentário.');
        }

    }

    const handleDeleteComment = async (id: string) => {
        try {
            const docRef = doc(db, "comments", id);
            await deleteDoc(docRef);
            setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            toast.success('Comentário deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            toast.error('Erro ao deletar comentário.');
        }
    };

    if (!task) return null;

    return (
        <div className='flex flex-col w-full min-h-screen pb-16 bg-black items-center'>
            <main className="w-full max-w-4xl mx-auto mt-10 px-4 flex flex-col justify-center items-center">
                <article className='w-full mb-4'>
                    <h1 className='text-white font-bold mb-3 text-3xl'>Tarefa</h1>
                    <div className="border border-gray-600 bg-white p-4 rounded-md flex items-center justify-center">
                        <p className="whitespace-pre-wrap w-full ">
                            {task?.tarefa}
                        </p>
                    </div>
                </article>

                <section className="w-full mt-4">
                    <h2 className="text-white mb-3 text-2xl font-semibold">Deixar um comentário</h2>

                    <form onSubmit={handleComment} className="w-full">
                        <TextArea
                            value={input}
                            onChange={e => setInput((e.target as HTMLTextAreaElement).value)}
                            placeholder="Digite um comentário..."
                            className="w-full mb-4"
                        />
                        <Button className="w-full mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Comentar
                        </Button>
                    </form>
                </section>

                <section className="w-full mt-4">
                    <h2 className="text-white mb-3 text-2xl font-semibold">Comentários</h2>
                    {comments.map((comment, index) => (
                        <div key={index} className="border border-gray-600 bg-white p-4 rounded-md mb-2 relative">
                            <p className="whitespace-pre-wrap">{comment.comment}</p>
                            <p className="text-gray-500 text-sm">Por {comment.name} em {comment.created.toLocaleDateString()}</p>
                            {session?.user?.email === comment.user && (
                                <Button
                                    variant="ghost"
                                    className="p-1 absolute top-2 right-2"
                                    aria-label="Excluir comentário"
                                    onClick={() => { handleDeleteComment(comment.id) }}
                                >
                                    <Trash2 className="text-red-600" />
                                </Button>
                            )}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
