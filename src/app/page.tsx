import Image from "next/image";
import Hero from "@/assets/hero.png";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-col bg-black h-[90.7vh]">
      <Head>
        <title>Home</title>
      </Head>

      <div className="flex flex-col flex-grow justify-center items-center pt-20">
        <Image
          src={Hero}
          alt="Logo"
          width={500}
          height={500}
          className="max-w-[400px] w-full h-auto"
        />
        <h1 className="m-10 text-white text-center text-2xl font-semibold">
          Sistema feito para você organizar <br />
          seus estudos e tarefas
        </h1>

      </div>
    </div>
  );
}
