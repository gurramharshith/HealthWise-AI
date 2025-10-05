import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Bot, Dna, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Bot className="h-6 w-6 text-primary" />
          <span className="sr-only">HealthWise AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The Future of Healthcare, Today.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    HealthWise AI leverages advanced artificial intelligence to provide real-time diagnostic insights,
                    predictive analysis, and early condition detection.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Enter Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/1/600/400"}
                width="550"
                height="550"
                alt="AI in Healthcare"
                data-ai-hint={heroImage?.imageHint || "medical technology"}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Core Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Comprehensive Suite of Tools</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive suite of tools for modern healthcare diagnostics.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                 <div className="flex justify-center">
                    <Dna className="h-10 w-10 text-primary mb-2" />
                  </div>
                <h3 className="text-xl font-bold text-center">Medical Image Analysis</h3>
                <p className="text-muted-foreground text-center">
                  Analyze X-rays, MRIs, and more with our AI to detect anomalies and potential health issues.
                </p>
              </div>
              <div className="grid gap-1">
                 <div className="flex justify-center">
                    <HeartPulse className="h-10 w-10 text-primary mb-2" />
                  </div>
                <h3 className="text-xl font-bold text-center">Predictive Diagnostics</h3>
                <p className="text-muted-foreground text-center">
                  Utilize machine learning to forecast potential health conditions from EHR and monitoring data.
                </p>
              </div>
              <div className="grid gap-1">
                  <div className="flex justify-center">
                    <Bot className="h-10 w-10 text-primary mb-2" />
                  </div>
                <h3 className="text-xl font-bold text-center">Early Diagnosis</h3>
                <p className="text-muted-foreground text-center">
                   Combine all data points for a comprehensive early diagnosis and risk assessment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 HealthWise AI. All Rights Reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}