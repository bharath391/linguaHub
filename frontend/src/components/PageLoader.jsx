import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        gap-4
        animate-fadeIn
      "
      data-theme={theme}
    >
      <div
        className="
          p-4
          rounded-full
          bg-base-200/60
          border border-base-300
          backdrop-blur-md
          transition-transform
          animate-pulse
        "
      >
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
      <p className="text-base-content opacity-70 text-sm">Loading, please wait...</p>
    </div>
  );
};

export default PageLoader;
