// frontend/src/context/UsuarioContext.tsx
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UsuarioItf } from "../utils/types/UsuarioItf";

// Definimos o nome do armazenamento para consistência
const STORAGE_NAME = "usuario-storage";

type UsuarioStore = {
  usuario: UsuarioItf | null;
  logaUsuario: (usuarioLogado: UsuarioItf) => void;
  deslogaUsuario: () => void;
};

// Ao criar a store, precisamos expor o middleware `persist`
// para poder chamar seus métodos externos, como `rehydrate()`.
export const useUsuarioStore = create<UsuarioStore>()(
  // Esta função envolve o middleware `persist` para capturar a `api` dele.
  (set, get, api) => {
    // A store real é criada dentro do `persist`
    const store = persist(
      (set) => ({
        usuario: null,
        logaUsuario: (usuarioLogado) => {
          set({ usuario: usuarioLogado });
          // O middleware `persist` já lida com a escrita automática
          // do estado atualizado no localStorage após esta chamada `set`.
        },
        deslogaUsuario: () => {
          // 1. Limpa o estado global do Zustand em memória imediatamente.
          set({ usuario: null });

          // 2. Limpa o localStorage diretamente.
          // Isso é importante para garantir que os dados não existam mais no armazenamento físico.
          if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_NAME);
            console.log("LocalStorage limpo.");
          }

          // 3. **AÇÃO CRÍTICA DO ZUSTAND PERSIST:**
          //    Isso força o middleware `persist` a re-ler o armazenamento
          //    (que agora está vazio) e atualizar o estado da store com base nisso.
          //    Isso é vital para lidar com a reidratação em navegações client-side.
          //    A verificação `useUsuarioStore.persist` é para garantir que o middleware esteja disponível.
          if (useUsuarioStore.persist) {
            useUsuarioStore.persist.rehydrate();
            console.log("Zustand persist re-hidratado (limpo).");
          }
        },
      }),
      {
        name: STORAGE_NAME,
        storage: createJSONStorage(() => localStorage),
        // `partialize` não é necessário se você não tem a opção "manter conectado"
        // e sempre limpa o localStorage no deslogar.
      }
    )(set, get, api); // Chame o persist com os argumentos para que ele inicialize.
    return store;
  }
);

// O UsuarioProvider permanece simples, pois a hidratação é tratada pelo middleware `persist`.
export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  // Apenas a chamada `useUsuarioStore()` aqui já é suficiente para garantir que a store
  // seja inicializada e hidratada pelo middleware `persist` quando o componente é montado.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useUsuarioStore();

  return <>{children}</>;
}