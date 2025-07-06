import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, UsersIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const { logoutMutation } = useLogout();

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
          h-20
          rounded-3xl
          backdrop-blur-sm
          bg-black/30
          border
          border-neutral-700/50
          shadow-lg
          flex
          items-center
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img className="size-9" src="/linguaLogo.png" alt="Logo" />
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-wider">
            LinguaHub
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-2 lg:gap-3 ml-8">
          <Link
            to="/"
            className={`btn btn-ghost normal-case gap-2 ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-yellow-300" />
            <span>Home</span>
          </Link>

          <Link
            to="/friends"
            className={`btn btn-ghost normal-case gap-2 ${
              currentPath === "/friends" ? "btn-active" : ""
            }`}
          >
            <UsersIcon className="size-5 text-yellow-300" />
            <span>Friends</span>
          </Link>

          <Link
            to="/notifications"
            className={`btn btn-ghost normal-case gap-2 ${
              currentPath === "/notifications" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-yellow-300" />
            <span>Notifications</span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme selector */}
        <ThemeSelector />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full ring-2 ring-yellow-300 ring-offset-2">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-ghost btn-circle hover:bg-neutral-800/40 transition ml-1"
          onClick={logoutMutation}
        >
          <LogOutIcon className="h-6 w-6 text-yellow-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
