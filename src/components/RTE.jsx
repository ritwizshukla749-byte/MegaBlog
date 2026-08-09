import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

export default function RTE({ name, control, label, defaultValue = "", rules }) {
  const isDark = useSelector((state) => state.theme.mode === "dark");
  const fieldName = name || "content";
  const currentContent = useWatch({ control, name: fieldName, defaultValue });

  const [prevTheme, setPrevTheme] = useState(isDark);
  const [initialContent, setInitialContent] = useState(() => defaultValue);

  if (prevTheme !== isDark) {
    setPrevTheme(isDark);
    setInitialContent(currentContent);
  }

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-stone-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <Controller
        name={name || "content"}
        control={control}
        rules={rules}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <Editor
              key={isDark ? "dark" : "light"}
              initialValue={initialContent}
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              init={{
                initialValue: initialContent,
                height: 500,
                menubar: true,
                skin: isDark ? "oxide-dark" : "oxide",
                content_css: isDark ? "dark" : "default",
                placeholder: "Start writing your editorial piece...",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={onChange}
            />
            {error && (
              <p className="mt-1.5 text-sm text-rose-500" role="alert">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
