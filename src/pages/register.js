import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "@heroui/react";
import toast from "react-hot-toast";
import { signUp, signIn } from "@/lib/auth-client";
export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasLength = password.length >= 6;
    return hasUpper && hasLower && hasLength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error(
        "Password must have uppercase, lowercase, and be at least 6 characters"
      );
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      email: form.email,
      password: form.password,
      name: form.name,
      image: form.photoURL,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            isRequired
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            isRequired
          />
          <Input
            label="Photo URL"
            name="photoURL"
            value={form.photoURL}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            isRequired
          />
          <Button type="submit" color="primary" fullWidth isLoading={loading}>
            Register
          </Button>
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <Button variant="bordered" fullWidth onPress={handleGoogleSignIn}>
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}