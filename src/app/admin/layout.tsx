import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Portfolio Management",
  description: "Manage portfolio content, projects, skills, certificates, and settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      {children}
    </div>
  );
}

