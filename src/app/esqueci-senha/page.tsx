'use client'
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

type Inputs = {
  email: string;
};

export default function EsqueciSenha() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleEsqueciSenha(data: Inputs) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/esqueci-senha`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });

      // Para segurança, sempre mostramos uma mensagem de sucesso,
      // mesmo que o e-mail não exista, para evitar que descubram e-mails registados.
      if (response.ok) {
        setEmailEnviado(true);
      } else {
        // Se a API falhar por um motivo inesperado, ainda informamos o utilizador.
        const errorData = await response.json();
        toast.error(errorData.erro || "Ocorreu um erro ao enviar o pedido.");
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
              Recuperar Senha
            </h1>

            {emailEnviado ? (
              <div className="text-center">
                <p className="text-green-400">
                  Pedido enviado com sucesso!
                </p>
                <p className="text-gray-300 mt-2">
                  Se o e-mail <span className="font-bold">{'{email}'}</span> estiver registado, receberá um link para redefinir a sua senha. Por favor, verifique a sua caixa de entrada e a pasta de spam.
                </p>
              </div>
            ) : (
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleEsqueciSenha)}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Seu e-mail de registo
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-red-800 dark:placeholder-red-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    {...register("email", { required: "O e-mail é obrigatório."})}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-800 dark:hover:bg-red-600 dark:focus:ring-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'A enviar...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
