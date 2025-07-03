'use client'
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Inputs = {
  senha: string;
  confirmarSenha: string;
};

export default function RedefinirSenha() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  async function handleRedefinirSenha(data: Inputs) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/redefinir-senha`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ token, senha: data.senha }),
      });

      if (response.ok) {
        toast.success("Senha redefinida com sucesso! Pode agora fazer login.");
        router.push("/login"); // Redireciona para a página de login
      } else {
        const errorData = await response.json();
        toast.error(errorData.erro || "Ocorreu um erro. O link pode ter expirado.");
      }

    } catch (error) {
      toast.error("Falha na comunicação com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-black dark:bg-black">
      <p style={{ height: 48 }}></p>
      <div className="flex flex-col items-center px-6 py-8 mx-auto max-w-5xl md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border dark:border-red-800 md:mt-0 sm:max-w-md xl:p-0 dark:bg-black">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white">
              Crie a sua Nova Senha
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleRedefinirSenha)}>
              <div>
                <label
                  htmlFor="senha"
                  className="block mb-2 text-sm font-medium dark:text-white"
                >
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-red-800 dark:placeholder-red-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  {...register("senha", { 
                    required: "A nova senha é obrigatória.",
                    minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres." }
                  })}
                />
                {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
              </div>
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block mb-2 text-sm font-medium dark:text-white"
                >
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-red-800 dark:placeholder-red-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  {...register("confirmarSenha", {
                    required: "A confirmação é obrigatória.",
                    validate: (value) => value === watch('senha') || "As senhas não correspondem."
                  })}
                />
                {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-800 dark:hover:bg-red-600 dark:focus:ring-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? 'A redefinir...' : 'Redefinir Senha'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
