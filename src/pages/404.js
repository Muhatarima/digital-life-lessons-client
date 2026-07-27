import Link from "next/link";
import { Button } from "@heroui/react";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <h1 className="text-6xl font-bold text-purple-700 mb-4">404</h1>
      <p className="text-gray-500 mb-6">
        Oops, this page doesn't exist.
      </p>
      <Link href="/">
        <Button color="primary">Go Back Home</Button>
      </Link>
    </div>
  );
}