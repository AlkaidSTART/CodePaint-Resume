import { useEffect, type ReactNode } from "react";
import { Header } from "./Header";
import { ApplyOverlay } from "./ApplyOverlay";
import { useAppStore } from "../store/appStore";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const isApplyOpen = useAppStore((state) => state.isApplyOpen);
  const closeApply = useAppStore((state) => state.closeApply);

  useEffect(() => {
    document.body.style.overflow = isApplyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isApplyOpen]);

  return (
    <div className="min-h-screen bg-[#fffffc] text-black">
      <Header />
      <main>{children}</main>
      {isApplyOpen && <ApplyOverlay onClose={closeApply} />}
    </div>
  );
}
