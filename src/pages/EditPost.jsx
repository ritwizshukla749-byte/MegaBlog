import { useEffect, useState } from "react";
import { Container, PageLoader, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    let cancelled = false;

    appwriteService
      .getPost(slug)
      .then((post) => {
        if (cancelled) return;
        if (post) {
          setPost(post);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching post:", err);
        toast.error("Could not load the post.");
        navigate("/");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  if (!post) return <PageLoader />;

  return (
    <div className="py-12">
      <Container>
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
          Edit Post
        </h1>
        <p className="mt-2 text-stone-500 dark:text-zinc-400">
          Refine your post before it goes live.
        </p>
        <div className="mt-8">
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  );
}

export default EditPost;
