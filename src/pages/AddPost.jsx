import { Container, PostForm } from "../components/index";

function AddPost() {
  return (
    <div className="py-12">
      <Container>
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
          Create New Post
        </h1>
        <p className="mt-2 text-stone-500 dark:text-zinc-400">
          Draft, polish, and publish your editorial piece.
        </p>
        <div className="mt-8">
          <PostForm />
        </div>
      </Container>
    </div>
  );
}

export default AddPost;
