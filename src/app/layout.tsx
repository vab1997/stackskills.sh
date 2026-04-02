import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBaseURL } from "@/lib/get-base-url";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Jersey_15,
  Jersey_25,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const jersey15 = Jersey_15({
  subsets: ["latin"],
  variable: "--font-jersey-15",
  weight: "400",
});
const jersey25 = Jersey_25({
  subsets: ["latin"],
  variable: "--font-jersey-25",
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),

  title: {
    default: "StackSkills — Agent Skills for Your Stack",
    template: "%s | StackSkills",
  },
  description:
    "Paste your package.json and StackSkills instantly maps your dependencies to the best agent skills from skills.sh matched to your exact tech stack.",

  openGraph: {
    type: "website",
    url: "/",
    siteName: "StackSkills",
    title: "StackSkills — Agent Skills for Your Stack",
    description:
      "Paste your package.json and StackSkills instantly maps your dependencies to the best agent skills from skills.sh matched to your exact tech stack.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    title: "StackSkills — Agent Skills for Your Stack",
    description:
      "Paste your package.json and StackSkills instantly maps your dependencies to the best agent skills from skills.sh matched to your exact tech stack.",
    images: ["/opengraph-image"],
    creator: "@victorbejas",
  },

  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        inter.variable,
        jersey15.variable,
        jersey25.variable,
      )}
    >
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} font-geist-sans antialiased`}
      >
        <Header />
        <TooltipProvider>{children}</TooltipProvider>
        <Footer />
        <Toaster theme="dark" />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "StackSkills",
              url: getBaseURL(),
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description:
                "Tool that maps package.json dependencies to installable agent skills from skills.sh matched to your tech stack.",
              author: {
                "@type": "Person",
                name: "Victor Bejas",
                url: "https://x.com/victorbejas",
              },
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </body>
    </html>
  );
}
