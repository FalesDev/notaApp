import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router";
import useAuth from "../context/useAuth";
import { HiMenu, HiX, HiLogout } from "react-icons/hi";
import Container from "../layouts/Container";

interface UserAvatarProps {
  className?: string;
  initials: string;
}

const UserAvatar = ({ className = "", initials }: UserAvatarProps) => (
  <div
    className={`flex items-center justify-center bg-yellow-500 text-white font-bold rounded-full select-none ${className}`}
  >
    {initials}
  </div>
);

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!user) return "";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  }, [user]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full border-b border-gray-300 bg-white text-black z-30 relative">
      <Container className="h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl md:text-2xl font-bold"
        >
          <img src="/logo.png" alt="Cyber Logo" width={32} height={32} />
          <span className="hidden sm:inline">Note App</span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            type="button"
            className="cursor-pointer text-3xl focus:outline-none"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-700" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <UserAvatar
                  initials={initials}
                  className="w-10 h-10 text-sm border-2 border-transparent group-hover:border-yellow-600 transition-all"
                />
              </button>

              {/* DROPDOWN DESKTOP */}
              {showDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-gray-100 text-gray-900 rounded-xl shadow-xl py-2 z-50 border border-gray-300 transform origin-top-right transition-all max-h-[80vh] overflow-y-auto"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-300 flex items-center gap-3 bg-gray-50/5">
                    <UserAvatar
                      initials={initials}
                      className="w-9 h-9 text-xs shadow-sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold truncate text-gray-800">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-600 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-500/20 transition-colors flex items-center gap-2"
                    >
                      <HiLogout className="text-lg" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="py-2 px-6 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 font-medium transition-colors shadow-sm hover:shadow-md">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </Container>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-gray-100 shadow-2xl p-5 flex flex-col overflow-y-auto">
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-3xl focus:outline-none p-1 text-gray-800 hover:bg-gray-500 rounded-full transition-colors"
              >
                <HiX />
              </button>
            </div>

            <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-6">
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500" />
                </div>
              ) : user ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                    <UserAvatar
                      initials={initials}
                      className="w-12 h-12 text-lg"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-lg truncate">
                        {user.firstName}
                      </span>
                      <span className="text-sm text-gray-600 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left text-lg font-medium text-gray-800 py-3 px-2 hover:bg-gray-500/20 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <HiLogout className="text-xl" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-3 px-4 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 font-medium text-lg shadow-md">
                    Sign in
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
