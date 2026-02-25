export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 card">
      <h1 className="text-xl font-semibold">Magic Link Login</h1>
      <form action="/api/auth/magic-link" method="post" className="space-y-3">
        <input className="input" name="email" type="email" required placeholder="you@example.com" />
        <button className="btn w-full">Send Login Link</button>
      </form>
      <p className="text-xs text-slate-400">In development mode the link token is printed to server logs.</p>
    </div>
  );
}
