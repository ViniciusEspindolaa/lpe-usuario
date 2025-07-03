"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUsuarioStore } from "@/context/UsuarioContext";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  senha: string;
  manter: boolean;
};

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const { logaUsuario } = useUsuarioStore();
  const router = useRouter();

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email: data.email, senha: data.senha }),
    });

    if (response.status == 200) {
      const dados = await response.json();
      logaUsuario(dados);

      if (data.manter) {
        localStorage.setItem("usuarioKey", dados.id);
      } else {
        if (localStorage.getItem("UsuarioKey")) {
          localStorage.removeItem("UsuarioKey");
        }
      }

      router.push("/");
    } else {
      toast.error("Erro... Login ou senha incorretos");
    }
  }

  return (
    <section className="bg-black dark:bg-black">
      <p style={{ height: 48 }}></p>
      <div className="flex flex-col items-center px-6 py-8 mx-auto max-w-5xl md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border dark:border-red-800 md:mt-0 sm:max-w-md xl:p-0 dark:bg-black">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Dados de Acesso do Usuário
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Seu e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-red-800 dark:placeholder-red-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  {...register("email")}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-red-800 dark:placeholder-red-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  {...register("senha")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-500 dark:bg-black dark:border-red-800 dark:focus:ring-blue-500"
                      {...register("manter")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Manter Conectado
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-800 dark:hover:bg-red-600 dark:focus:ring-blue-800"
              >
                Entrar
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Ainda não possui conta?{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Cadastre-se
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}