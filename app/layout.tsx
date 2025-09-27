
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwipeHire AI",
  description: "AI-Powered Interview Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`bg-background text-foreground ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
              <h1 className="text-2xl font-bold text-primary">
                <Link href="/">SwipeHire AI</Link>
              </h1>
              <ModeToggle />
            </header>
            <main className="flex-1 max-w-5xl mx-auto p-4 w-full">{children}</main>
            <footer className="w-full border-t">
                <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 max-w-5xl mx-auto">
                    <p className="text-xs text-muted-foreground">
                    © 2024 SwipeHire AI. All rights reserved.
                    </p>
                    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                        href="/about"
                        className="text-xs hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/terms"
                        className="text-xs hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-xs hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Privacy
                    </Link>
                    </nav>
                </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
