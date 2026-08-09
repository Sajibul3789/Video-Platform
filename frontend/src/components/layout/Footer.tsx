import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="navbar-glass mt-8 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-white/30 hover:text-white/60 text-sm transition font-medium"
            >
              VideoHub
            </Link>
            <span className="text-white/10">|</span>
            <Link
              href="/privacy"
              className="text-white/30 hover:text-white/60 text-sm transition font-medium"
            >
              Privacy
            </Link>
            <span className="text-white/10">|</span>
            <Link
              href="/terms"
              className="text-white/30 hover:text-white/60 text-sm transition font-medium"
            >
              Terms
            </Link>
          </div>
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} VideoHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
