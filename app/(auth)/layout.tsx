export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-8">
                {children}
            </div>
        </div>
    );
}
