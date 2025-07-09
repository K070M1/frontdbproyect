"use client";

import { useModalStore } from "@/store/modalStore";
import LoginModal from "@/components/UI/Modal/LoginModal";
import RegisterModal from "@/components/UI/Modal/RegisterModal";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterForm from "@/components/Forms/RegisterForm";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { openModal, setModal } = useModalStore();

  return (
    <>
      {children}
      <LoginModal isOpen={openModal === "login"} onClose={() => setModal(null)}>
        <LoginForm />
      </LoginModal>
      <RegisterModal isOpen={openModal === "register"} onClose={() => setModal(null)}>
        <RegisterForm />
      </RegisterModal>
    </>
  );
}
