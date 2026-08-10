import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { THEME_KEY } from "./store/themeSlice";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{outlet}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    try {
      localStorage.setItem(THEME_KEY, themeMode);
    } catch {
      // storage unavailable — theme still applies for this session
    }
  }, [themeMode]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (!mq) return;

    const applySystem = (e) => {
      if (localStorage.getItem(THEME_KEY)) return;
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mq.addEventListener("change", applySystem);
    return () => mq.removeEventListener("change", applySystem);
  }, []);

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        dispatch(login({ userData }));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-[#0a0a0c] dark:text-white">
      <Header />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!border !border-stone-200 !bg-white !text-stone-900 !shadow-lg dark:!border-white/15 dark:!bg-[#111114] dark:!text-zinc-100",
          success: {
            iconTheme: { primary: "#10b981", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#f43f5e", secondary: "#ffffff" },
          },
        }}
      />
    </div>
  );
}

export default App;
