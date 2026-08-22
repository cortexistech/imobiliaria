import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center px-4">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">404</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Esta parcela não existe no mapa.</h1>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-field">
          Voltar à carteira
        </Link>
      </div>
    </main>
  );
}
