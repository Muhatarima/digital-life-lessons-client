export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-900 text-gray-300 px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-white">
            Digital Life Lessons
          </h2>
          <p className="text-sm mt-2">
            Preserve wisdom. Share growth. Learn together.
          </p>
        </div>

        <div className="text-sm">
          <p>Contact: support@digitallifelessons.com</p>
          <a href="#" className="underline block mt-1">
            Terms & Conditions
          </a>
        </div>

        <div className="flex gap-4 text-sm items-center">
          <a href="#" aria-label="X">
            𝕏
          </a>
          <a href="#" aria-label="Facebook">
            Facebook
          </a>
          <a href="#" aria-label="LinkedIn">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}