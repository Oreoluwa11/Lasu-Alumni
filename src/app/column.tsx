export default function ColumnLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</div>;
}
