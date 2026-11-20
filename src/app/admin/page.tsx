"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Wrench,
  Award,
  Mail,
  Lock,
  LogOut,
  Eye,
  Save,
  Plus,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  ExternalLink,
  FileText,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { PortfolioData, ProjectItem, SkillCategory, CertificationItem } from "@/types/portfolio";

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Security tab state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check auth on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
          fetchData();
        } else {
          setIsAuthed(false);
        }
      })
      .catch(() => setIsAuthed(false))
      .finally(() => setAuthChecking(false));
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      showToast("Failed to load portfolio data", "error");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passwordInput }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setIsAuthed(true);
        fetchData();
        showToast("Welcome to Admin Studio!");
      } else {
        setLoginError(result.message || "Invalid password");
      }
    } catch {
      setLoginError("Server error. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setIsAuthed(false);
      setData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveData = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast("Changes saved & published successfully!");
      } else {
        showToast(result.message || "Failed to save data", "error");
      }
    } catch (err) {
      showToast("Network error while saving", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        onSuccess(result.url);
        showToast("File uploaded successfully!");
      } else {
        showToast(result.message || "Upload failed", "error");
      }
    } catch {
      showToast("Upload error", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMsg(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", oldPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setPasswordChangeMsg({ text: "Password changed successfully!", type: "success" });
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordChangeMsg({ text: result.message || "Error changing password", type: "error" });
      }
    } catch {
      setPasswordChangeMsg({ text: "Server error", type: "error" });
    }
  };

  // Helper functions to mutate data
  const updateProfile = (field: string, val: any) => {
    if (!data) return;
    setData({
      ...data,
      profile: { ...data.profile, [field]: val },
    });
  };

  const updateAbout = (field: string, val: any) => {
    if (!data) return;
    setData({
      ...data,
      about: { ...data.about, [field]: val },
    });
  };

  const updateContact = (field: string, val: any) => {
    if (!data) return;
    setData({
      ...data,
      contact: {
        ...data.contact,
        [field]: val,
      },
    });
  };

  const updateSocial = (field: string, val: any) => {
    if (!data) return;
    setData({
      ...data,
      contact: {
        ...data.contact,
        social: {
          ...data.contact.social,
          [field]: val,
        },
      },
    });
  };

  // Projects mutators
  const addProject = () => {
    if (!data) return;
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "New Project",
      description: "Brief project overview and goals.",
      tags: ["Python", "SQL"],
      insights: ["Key insight or outcome 1", "Key insight or outcome 2"],
      githubUrl: "https://github.com/",
      demoUrl: "",
      accentColor: "blue",
    };
    setData({
      ...data,
      projects: [newProj, ...data.projects],
    });
    showToast("New project added. Edit details below.");
  };

  const updateProject = (index: number, updated: Partial<ProjectItem>) => {
    if (!data) return;
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], ...updated };
    setData({ ...data, projects: newProjects });
  };

  const deleteProject = (index: number) => {
    if (!data) return;
    if (confirm("Are you sure you want to delete this project?")) {
      const newProjects = data.projects.filter((_, i) => i !== index);
      setData({ ...data, projects: newProjects });
      showToast("Project deleted");
    }
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.projects.length) return;
    const newProjects = [...data.projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIdx];
    newProjects[targetIdx] = temp;
    setData({ ...data, projects: newProjects });
  };

  // Skill categories mutators
  const addCategory = () => {
    if (!data) return;
    const newCat: SkillCategory = {
      id: "cat-" + Date.now(),
      title: "New Category",
      skills: [{ id: "skill-" + Date.now(), name: "Tool Name", icon: "", note: "" }],
    };
    setData({ ...data, skillCategories: [...data.skillCategories, newCat] });
  };

  const updateCategoryTitle = (catIdx: number, title: string) => {
    if (!data) return;
    const cats = [...data.skillCategories];
    cats[catIdx] = { ...cats[catIdx], title };
    setData({ ...data, skillCategories: cats });
  };

  const deleteCategory = (catIdx: number) => {
    if (!data) return;
    if (confirm("Delete this entire skill category?")) {
      setData({ ...data, skillCategories: data.skillCategories.filter((_, i) => i !== catIdx) });
    }
  };

  const addSkillToCat = (catIdx: number) => {
    if (!data) return;
    const cats = [...data.skillCategories];
    cats[catIdx].skills.push({
      id: "skill-" + Date.now(),
      name: "New Skill",
      icon: "",
      note: "",
    });
    setData({ ...data, skillCategories: cats });
  };

  const updateSkillInCat = (catIdx: number, skillIdx: number, updated: any) => {
    if (!data) return;
    const cats = [...data.skillCategories];
    cats[catIdx].skills[skillIdx] = { ...cats[catIdx].skills[skillIdx], ...updated };
    setData({ ...data, skillCategories: cats });
  };

  const deleteSkillFromCat = (catIdx: number, skillIdx: number) => {
    if (!data) return;
    const cats = [...data.skillCategories];
    cats[catIdx].skills = cats[catIdx].skills.filter((_, i) => i !== skillIdx);
    setData({ ...data, skillCategories: cats });
  };

  // Certifications mutators
  const addCertification = () => {
    if (!data) return;
    const newCert: CertificationItem = {
      id: "cert-" + Date.now(),
      title: "New Certification",
      issuer: "Issuing Organization",
      image: "/certificates/sql.png",
      link: "",
      accentColor: "blue",
    };
    setData({ ...data, certifications: [newCert, ...data.certifications] });
    showToast("New certification added.");
  };

  const updateCert = (idx: number, updated: Partial<CertificationItem>) => {
    if (!data) return;
    const certs = [...data.certifications];
    certs[idx] = { ...certs[idx], ...updated };
    setData({ ...data, certifications: certs });
  };

  const deleteCert = (idx: number) => {
    if (!data) return;
    if (confirm("Delete this certification?")) {
      setData({ ...data, certifications: data.certifications.filter((_, i) => i !== idx) });
      showToast("Certification deleted");
    }
  };

  // Loading spinner during auth check
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Login Screen if not authenticated
  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1d] to-[#040711]">
        <div className="w-full max-w-md p-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2">Portfolio Admin Studio</h1>
          <p className="text-slate-400 text-sm text-center mb-8">
            Enter your admin password to edit portfolio content, projects, skills, and settings.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                autoFocus
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Sign In to Studio
            </button>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500">Secure Admin Access</span>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                ← Return to Live Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Fallback if data is not yet loaded
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile & Hero", icon: User },
    { id: "about", label: "About Me", icon: FileText },
    { id: "projects", label: "Projects", count: data.projects.length, icon: FolderGit2 },
    { id: "skills", label: "Skills", count: data.skillCategories.length, icon: Wrench },
    { id: "certifications", label: "Certifications", count: data.certifications.length, icon: Award },
    { id: "contact", label: "Contact & Social", icon: Mail },
    { id: "security", label: "Security & Settings", icon: Lock },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080c16]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
                : "bg-rose-950/90 text-rose-200 border-rose-500/40"
            }`}
          >
            {toastMessage.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0c1222] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">Admin Studio</h2>
              <p className="text-[11px] text-slate-400">Live Portfolio CMS</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Portfolio</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 border-b border-slate-800/80 bg-[#0a0f1e]/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-10">
          <div>
            <h1 className="text-lg font-semibold text-white capitalize">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>

            <button
              onClick={handleSaveData}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-lg transition-all cursor-pointer ${
                isSaving
                  ? "bg-slate-700 cursor-not-allowed opacity-75"
                  : "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-rose-600/25 hover:shadow-rose-600/40 hover:-translate-y-0.5"
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 shadow-xl">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-medium mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> Full Portfolio Control
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-2">
                    Welcome, {data.profile.name} 👋
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Aapka portfolio management system ready hai. Yahan se aap apna Bio, Projects, Technical Skills, Certifications, Contact Information aur AI Chatbot knowledge ko aasaani se edit kar sakte hain. Changes save karte hi live website turant update ho jayegi!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                    >
                      Manage Projects ({data.projects.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                    >
                      Edit Profile & Bio
                    </button>
                    <Link
                      href="/"
                      target="_blank"
                      className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all flex items-center gap-1.5"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveTab("projects")}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Total Projects</span>
                    <FolderGit2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-white">{data.projects.length}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Live in Projects section</p>
                </div>

                <div
                  onClick={() => setActiveTab("skills")}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Skill Categories</span>
                    <Wrench className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {data.skillCategories.length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {data.skillCategories.reduce((acc, c) => acc + c.skills.length, 0)} total tools & skills
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("certifications")}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Certifications</span>
                    <Award className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-white">{data.certifications.length}</div>
                  <p className="text-[11px] text-slate-500 mt-1">With interactive preview modal</p>
                </div>

                <div
                  onClick={() => setActiveTab("profile")}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Profile Status</span>
                    <User className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active & Online
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{data.profile.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & HERO */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-400" /> Hero & Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Alternate Name / Alias</label>
                    <input
                      type="text"
                      value={data.profile.alternateName || ""}
                      onChange={(e) => updateProfile("alternateName", e.target.value)}
                      placeholder="e.g. Nikhil Ydv"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Typed.js Strings (Comma-separated for looping hero title)
                    </label>
                    <input
                      type="text"
                      value={data.profile.typedStrings.join(", ")}
                      onChange={(e) =>
                        updateProfile(
                          "typedStrings",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Example: Nikhil Yadav, Data Analyst, Problem Solver</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Role / Tagline</label>
                    <input
                      type="text"
                      value={data.profile.role}
                      onChange={(e) => updateProfile("role", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Status / Opportunities Quote</label>
                    <input
                      type="text"
                      value={data.profile.statusQuote}
                      onChange={(e) => updateProfile("statusQuote", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Profile Photo Uploader */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Profile Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-500 relative flex-shrink-0 bg-slate-950">
                      <img
                        src={data.profile.profileImage || "/main-photo.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 flex-1 w-full">
                      <input
                        type="text"
                        value={data.profile.profileImage}
                        onChange={(e) => updateProfile("profileImage", e.target.value)}
                        placeholder="Image URL or upload file..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Profile Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => updateProfile("profileImage", url));
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Resume Link */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Resume / CV Document</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={data.profile.resumeUrl || ""}
                      onChange={(e) => updateProfile("resumeUrl", e.target.value)}
                      placeholder="Resume URL (PDF link or upload file)"
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, (url) => updateProfile("resumeUrl", url));
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-400" /> About Me Section
                  </h3>
                  <button
                    onClick={() => updateAbout("paragraphs", [...data.about.paragraphs, "New bio paragraph."])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={data.about.title}
                    onChange={(e) => updateAbout("title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-300">Bio Paragraphs</label>
                  {data.about.paragraphs.map((p, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="text-xs font-bold text-slate-500 pt-3">{idx + 1}.</span>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const newPars = [...data.about.paragraphs];
                          newPars[idx] = e.target.value;
                          updateAbout("paragraphs", newPars);
                        }}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        onClick={() => {
                          const newPars = data.about.paragraphs.filter((_, i) => i !== idx);
                          updateAbout("paragraphs", newPars);
                        }}
                        disabled={data.about.paragraphs.length <= 1}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Delete Paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Project Showcase</h3>
                  <p className="text-xs text-slate-400">Add, edit, reorder, or delete projects</p>
                </div>
                <button
                  onClick={addProject}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.projects.map((proj, pIdx) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5 hover:border-slate-700 transition-all"
                  >
                    {/* Project Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300">
                          #{pIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(pIdx, { title: e.target.value })}
                          className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-rose-500 focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveProject(pIdx, "up")}
                          disabled={pIdx === 0}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveProject(pIdx, "down")}
                          disabled={pIdx === data.projects.length - 1}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(pIdx)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(pIdx, { description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    {/* Tags / Tech Stack */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Tech Stack Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.tags.join(", ")}
                        onChange={(e) =>
                          updateProject(pIdx, {
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    {/* Key Insights bullets */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">Key Insights / Bullet Points</label>
                        <button
                          onClick={() =>
                            updateProject(pIdx, { insights: [...proj.insights, "New insight point"] })
                          }
                          className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Insight
                        </button>
                      </div>
                      {proj.insights.map((ins, insIdx) => (
                        <div key={insIdx} className="flex gap-2 items-center">
                          <span className="text-rose-400 text-sm">•</span>
                          <input
                            type="text"
                            value={ins}
                            onChange={(e) => {
                              const newIns = [...proj.insights];
                              newIns[insIdx] = e.target.value;
                              updateProject(pIdx, { insights: newIns });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
                          />
                          <button
                            onClick={() => {
                              const newIns = proj.insights.filter((_, i) => i !== insIdx);
                              updateProject(pIdx, { insights: newIns });
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={proj.githubUrl}
                          onChange={(e) => updateProject(pIdx, { githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="text"
                          value={proj.demoUrl || ""}
                          onChange={(e) => updateProject(pIdx, { demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Technical Skills & Categories</h3>
                  <p className="text-xs text-slate-400">Organize skills by categories like Data Analysis, Tools, AI, etc.</p>
                </div>
                <button
                  onClick={addCategory}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.skillCategories.map((cat, cIdx) => (
                  <div
                    key={cat.id}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-rose-400" />
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => updateCategoryTitle(cIdx, e.target.value)}
                          className="text-base font-bold text-white bg-transparent border-b border-slate-700 hover:border-slate-500 focus:border-rose-500 focus:outline-none px-2 py-0.5"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => addSkillToCat(cIdx)}
                          className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Tool/Skill
                        </button>
                        <button
                          onClick={() => deleteCategory(cIdx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {cat.skills.map((skill, sIdx) => (
                        <div
                          key={skill.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) =>
                                updateSkillInCat(cIdx, sIdx, { name: e.target.value })
                              }
                              placeholder="Skill name"
                              className="w-full text-xs font-semibold text-white bg-transparent border-b border-transparent hover:border-slate-800 focus:border-rose-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={skill.note || ""}
                              onChange={(e) =>
                                updateSkillInCat(cIdx, sIdx, { note: e.target.value })
                              }
                              placeholder="Note: (basic), etc."
                              className="w-full text-[10px] text-slate-400 bg-transparent border-b border-transparent hover:border-slate-800 focus:border-rose-500 focus:outline-none"
                            />
                          </div>
                          <button
                            onClick={() => deleteSkillFromCat(cIdx, sIdx)}
                            className="p-1 text-slate-600 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Certificates & Credentials</h3>
                  <p className="text-xs text-slate-400">Manage certificate cards and full-resolution images</p>
                </div>
                <button
                  onClick={addCertification}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.certifications.map((cert, cIdx) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer backdrop-blur-md">
                        <Upload className="w-3 h-3" /> Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => updateCert(cIdx, { image: url }));
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => updateCert(cIdx, { title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCert(cIdx, { issuer: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={cert.image}
                          onChange={(e) => updateCert(cIdx, { image: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => deleteCert(cIdx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & SOCIAL */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-rose-400" /> Contact & Social Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Section Heading</label>
                    <input
                      type="text"
                      value={data.contact.heading}
                      onChange={(e) => updateContact("heading", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Subheading / Status</label>
                    <input
                      type="text"
                      value={data.contact.subheading}
                      onChange={(e) => updateContact("subheading", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={data.contact.social.email}
                      onChange={(e) => updateSocial("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.contact.social.linkedin}
                      onChange={(e) => updateSocial("linkedin", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">LinkedIn Username / Display</label>
                    <input
                      type="text"
                      value={data.contact.social.linkedinUser}
                      onChange={(e) => updateSocial("linkedinUser", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={data.contact.social.github}
                      onChange={(e) => updateSocial("github", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">GitHub Username / Display</label>
                    <input
                      type="text"
                      value={data.contact.social.githubUser}
                      onChange={(e) => updateSocial("githubUser", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY & SETTINGS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 max-w-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" /> Change Admin Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Min 3 characters"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {passwordChangeMsg && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                        passwordChangeMsg.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {passwordChangeMsg.type === "success" ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{passwordChangeMsg.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Data Backup / Export */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Save className="w-5 h-5 text-teal-400" /> Backup & Export Data
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download a complete JSON backup of all your portfolio content, projects, and configurations.
                </p>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Download JSON Backup</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

