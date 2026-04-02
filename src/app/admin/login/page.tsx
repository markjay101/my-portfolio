import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
