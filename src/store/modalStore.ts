import { create } from 'zustand';

type ModalType = 'login' | 'register' | null;

type ModalStore = {
  openModal: ModalType;
  setModal: (type: ModalType) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  setModal: (type) => {
    // 1) Cierra el actual
    set({ openModal: null });
    // 2) Después de la animación de cierre, abre el nuevo
    setTimeout(() => set({ openModal: type }), 200);
  },
}));
