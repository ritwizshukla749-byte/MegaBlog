import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useBlocker, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import resizeImage from "../../utils/imageResize";
import validateImageFile from "../../utils/validateImageFile";

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111114]">
      <h2 className="mb-4 font-display text-lg font-semibold text-stone-900 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status ?? true,
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() =>
    post?.featuredImage ? appwriteService.getFileView(post.featuredImage) : null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const objectUrlRef = useRef(null);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);
  const submittedRef = useRef(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const blocker = useBlocker(() => isDirty && !submittedRef.current);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const leave = window.confirm(
      "You have unsaved changes. Leave without saving?",
    );
    if (leave) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    try {
      await validateImageFile(f);
      if (!mountedRef.current) return;

      setImageProcessing(true);
      const resized = await resizeImage(f);
      if (!mountedRef.current) return;

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(resized);
      objectUrlRef.current = url;
      setFile(resized);
      setImagePreview(url);
    } catch (err) {
      console.error("Error processing image:", err);
      if (mountedRef.current) {
        toast.error(err?.message || "Could not process the image.");
      }
    } finally {
      if (mountedRef.current) setImageProcessing(false);
    }
  }, []);

  const submit = async (data) => {
    if (submittingRef.current) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      data = { ...data, slug: slugTransform(data.title) };
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      if (post) {
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: post.featuredImage,
        });
        if (!dbPost) throw new Error("Update failed");

        if (file) {
          const uploaded = await appwriteService.uploadFile(file);
          if (uploaded) {
            try {
              await appwriteService.updatePost(post.$id, {
                featuredImage: uploaded.$id,
              });
            } catch (err) {
              await appwriteService
                .deleteFile(uploaded.$id)
                .catch((cleanupErr) =>
                  console.error("Failed to clean up orphaned file:", cleanupErr),
                );
              throw err;
            }
            await appwriteService.deleteFile(post.featuredImage);
          }
        }

        submittedRef.current = true;
        toast.success("Post updated");
        navigate(`/post/${post.$id}`);
      } else {
        if (!file) {
          toast.error("Please add a featured image");
          return;
        }

        const uploaded = await appwriteService.uploadFile(file);
        if (!uploaded) throw new Error("Upload failed");

        const uploadedFileId = uploaded.$id;
        let dbPost;

        try {
          dbPost = await appwriteService.createPost({
            ...data,
            featuredImage: uploadedFileId,
            userId: userData.$id,
          });
        } catch (err) {
          if (err?.code === 409 || err?.response?.status === 409) {
            try {
              dbPost = await appwriteService.createPost({
                ...data,
                featuredImage: uploadedFileId,
                userId: userData.$id,
                slug: `${data.slug}-${Date.now()}`,
              });
            } catch (retryErr) {
              await appwriteService
                .deleteFile(uploadedFileId)
                .catch((cleanupErr) =>
                  console.error("Failed to clean up orphaned file:", cleanupErr),
                );
              throw retryErr;
            }
          } else {
            await appwriteService
              .deleteFile(uploadedFileId)
              .catch((cleanupErr) =>
                console.error("Failed to clean up orphaned file:", cleanupErr),
              );
            throw err;
          }
        }

        if (!dbPost) {
          await appwriteService
            .deleteFile(uploadedFileId)
            .catch((cleanupErr) =>
              console.error("Failed to clean up orphaned file:", cleanupErr),
            );
          throw new Error("Create failed");
        }

        submittedRef.current = true;
        toast.success(data.status ? "Post published" : "Post saved as draft");
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (err) {
      console.error("Error saving post:", err);
      toast.error("Could not save the post. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    return "";
  }, []);

  const debouncedSlugUpdate = useCallback(
    (title) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        setValue("slug", slugTransform(title), { shouldValidate: true });
      }, 300);
    },
    [setValue, slugTransform],
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        debouncedSlugUpdate(value.title);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, debouncedSlugUpdate]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Content">
            <div className="space-y-5">
              <Input
                label="Title"
                placeholder="Enter an engaging headline..."
                error={errors.title?.message}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />

              <div>
                <label
                  htmlFor="slug"
                  className="mb-1.5 block text-sm font-semibold text-stone-700 dark:text-zinc-300"
                >
                  Slug
                </label>
                <div className="flex h-11 overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-white/15 dark:bg-[#111114]">
                  <span className="flex items-center border-r border-stone-200 bg-stone-50 px-4 text-sm text-stone-500 dark:border-white/15 dark:bg-[#111114] dark:text-zinc-400">
                    megablog.com/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    placeholder="your-post-slug"
                    aria-invalid={errors.slug ? true : undefined}
                    className="h-full w-full bg-transparent px-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-white dark:placeholder:text-zinc-500"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                      setValue("slug", slugTransform(e.currentTarget.value), {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
                {errors.slug?.message && (
                  <p className="mt-1.5 text-sm text-rose-500" role="alert">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <RTE
                label="Content"
                name="content"
                control={control}
                defaultValue={getValues("content")}
                rules={{ required: "Content is required" }}
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Publish">
            <div className="space-y-5">
              <Select
                options={[
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ]}
                label="Status"
                error={errors.status?.message}
                {...register("status", {
                  required: "Please choose a status",
                  setValueAs: (value) => value === true || value === "true",
                })}
              />

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="secondary"
                  className="flex-1"
                  disabled={submitting}
                  onClick={() => setValue("status", false)}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  loading={submitting}
                  onClick={() => setValue("status", true)}
                >
                  {post ? "Update Post" : "Publish Post"}
                </Button>
              </div>
            </div>
          </Panel>

          <Panel title="Featured Image">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (imageProcessing) return;
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                imageProcessing
                  ? "border-stone-300 bg-stone-50 dark:border-white/15 dark:bg-[#0a0a0c]/50"
                  : "border-stone-300 bg-stone-50 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-white/15 dark:bg-[#0a0a0c]/50 dark:hover:border-pink-500/60 dark:hover:bg-pink-500/5"
              }`}
            >
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                className="sr-only"
                disabled={imageProcessing}
                onChange={(e) => {
                  if (imageProcessing) return;
                  handleFile(e.target.files?.[0]);
                }}
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                {imageProcessing ? (
                  <svg
                    className="animate-spin"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-stone-600 dark:text-zinc-300">
                {imageProcessing
                  ? "Processing image..."
                  : "Drag & drop or click to upload"}
              </span>
              <span className="text-xs text-stone-400 dark:text-zinc-500">
                PNG, JPG, JPEG, GIF · Max 5MB
              </span>
            </label>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Featured image preview"
                  className="max-h-48 w-full rounded-xl object-cover"
                />
                {post && !file && (
                  <p className="mt-2 text-center text-xs text-stone-400 dark:text-zinc-500">
                    Current image
                  </p>
                )}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
