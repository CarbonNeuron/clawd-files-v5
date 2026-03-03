import Link from "next/link";
import { LayoutDashboard, Key, FolderOpen, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/buckets", label: "Buckets", icon: FolderOpen },
  { href: "/dashboard/keys", label: "API Keys", icon: Key },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
];

export function DashboardNav() {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
        <Link href="/dashboard" className="mr-6 font-brand text-lg font-bold text-accent">
          clawd-files
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm text-text-muted hover:border-accent hover:text-text"
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
