const required = {
  appwriteUrl: ["VITE_APPWRITE_URL", import.meta.env.VITE_APPWRITE_URL],
  appwriteProjectId: [
    "VITE_APPWRITE_PROJECT_ID",
    import.meta.env.VITE_APPWRITE_PROJECT_ID,
  ],
  appwriteDatabaseId: [
    "VITE_APPWRITE_DATABASE_ID",
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
  ],
  appwriteTablesId: [
    "VITE_APPWRITE_COLLECTION_ID",
    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  ],
  appwriteBucketId: [
    "VITE_APPWRITE_BUCKET_ID",
    import.meta.env.VITE_APPWRITE_BUCKET_ID,
  ],
};

Object.entries(required).forEach(([, [envName, value]]) => {
  if (!value) {
    console.error(
      "MegaBlog: missing required environment variable",
      envName,
      "— add it to your .env file.",
    );
  }
});

const conf = Object.fromEntries(
  Object.entries(required).map(([key, [, value]]) => [
    key,
    String(value || ""),
  ]),
);

export default conf;
