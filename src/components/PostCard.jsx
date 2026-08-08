import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        {featuredImage ? (
          <img
            src={appwriteService.getFileView(featuredImage)}
            alt={title}
            className="w-full h-52 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-52 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
    </Link>
  );
}

export default PostCard;
