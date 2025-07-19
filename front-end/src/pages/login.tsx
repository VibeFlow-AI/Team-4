import HomeLayout from "@/layouts/HomeLayout";
import { AuthModal } from "@/components/auth/AuthModal";

function LoginPage() {
  return (
    <HomeLayout>
      <div>
        <AuthModal />
      </div>
    </HomeLayout>
  )
}

export default LoginPage;