import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import authService from "../../appwrite/auth.js";
import { logout } from "../../store/authSlice.js";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        toast.success("Logged out");
      })
      .catch((err) => {
        console.error("Error during logout:", err);
        toast.error("Could not log out. Please try again.");
      });
  };

  return (
    <button
      type="button"
      onClick={logoutHandler}
      className="inline-flex items-center rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
