import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth.js";
import { logout } from "../../store/authSlice.js";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  };

  return (
    <button
      type="button"
      onClick={logoutHandler}
      className="inline-flex items-center rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
