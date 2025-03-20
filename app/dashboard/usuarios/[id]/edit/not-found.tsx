import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4 md:p-6 lg:p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Could not find the requested user</h1>
      <p className="mt-4 text-gray-600">
        The user you are looking for does not exist. <Link href="/dashboard/usuarios" className="text-blue-600 hover:underline">Return to Users</Link>
      </p>
    </div>
  );
}