"use client";

import LoginForm from "@/components/Forms/LoginForm";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />
    </div>
  );
}
