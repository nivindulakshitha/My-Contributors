import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "My Crews | A GitHub readme API",
    description: "A GitHub crew generator",
    icons: [
        {
            rel: "icon",
            type: "image/svg+xml",
            url: "https://github.githubassets.com/favicons/favicon.svg",
        }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="mask-icon" href="https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg" color="#FFFFFF" />
                <link rel="alternate icon" className="js-site-favicon" type="image/png" href="https://github.com/fluidicon.png" />
                <link rel="icon" className="js-site-favicon" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon.svg" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
