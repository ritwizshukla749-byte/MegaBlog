export default function readingTime(content = "") {
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*`_>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}
