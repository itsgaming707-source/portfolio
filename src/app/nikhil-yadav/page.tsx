import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nikhil Yadav | Data Analyst Portfolio",
  description:
    "Nikhil Yadav is a Data Analyst skilled in SQL, Python, and Power BI. Explore projects and portfolio.",
  alternates: {
    canonical: "https://nikhilydv.me/nikhil-yadav",
  },
  openGraph: {
    title: "Nikhil Yadav | Data Analyst",
    description:
      "Data Analyst skilled in SQL, Python, Power BI. Explore projects and portfolio by Nikhil Yadav.",
    url: "https://nikhilydv.me/nikhil-yadav",
    siteName: "Nikhil Yadav Portfolio",
    type: "profile",
  },
};

export default function NikhilYadavPage() {
  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex items-center justify-center px-6 py-24">
      <article className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100">
          Nikhil Yadav{" "}
          <span className="text-zinc-400 font-semibold text-2xl md:text-3xl">
            (Nikhil Ydv)
          </span>
        </h1>

        <div className="space-y-5 text-zinc-300 leading-relaxed text-base md:text-lg font-light">
          <p>
            Nikhil Yadav is an aspiring Data Analyst currently pursuing a BCA
            degree. He specialises in <strong>SQL</strong>,{" "}
            <strong>Python</strong>, and <strong>Power BI</strong>, using these
            tools to transform raw data into actionable business insights.
            Whether it&apos;s writing complex queries, building interactive
            dashboards, or performing exploratory data analysis, Nikhil
            approaches every dataset with curiosity and precision.
          </p>

          <p>
            His project portfolio includes end-to-end analytics work such as
            Blinkit sales analysis, customer behaviour segmentation, Zepto
            inventory exploration with SQL, and a spam-detection classifier
            built from scratch using Naive Bayes in pure Python. Each project
            reflects Nikhil Yadav&apos;s commitment to learning by doing and
            his growing expertise in the data analytics space.
          </p>

          <p>
            Beyond technical skills, Nikhil Yadav continuously sharpens his
            knowledge through industry certifications from IBM, Simplilearn,
            and other platforms. He is actively seeking internship and
            collaboration opportunities where he can contribute meaningful
            analytical insights and grow as a data professional.
          </p>
        </div>

        {/* Find Nikhil Yadav Online */}
        <section className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">
            Find Nikhil Yadav Online
          </h2>
          <ul className="space-y-3 text-base">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <a
                href="https://www.linkedin.com/in/nikhilydv1026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Nikhil Yadav LinkedIn
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-zinc-400 flex-shrink-0" />
              <a
                href="https://github.com/nikhilydv1026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition-colors font-medium"
              >
                Nikhil Yadav GitHub
              </a>
            </li>
          </ul>
        </section>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </article>
    </main>
  );
}
