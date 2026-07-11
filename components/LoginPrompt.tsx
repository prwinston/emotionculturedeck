import Link from "next/link";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-500">
      {message}{" "}
      <Link href="/login" className="font-medium text-neutral-800 underline">
        Log in
      </Link>{" "}
      to continue.
    </div>
  );
}
