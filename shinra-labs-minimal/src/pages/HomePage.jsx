export default function HomePage() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
        Welcome to SHINRA Labs
      </h1>

      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        A simple platform that helps companies create labeling tasks and allows
        freelancers to work on them. (Prototype Version)
      </p>

      <div className="flex justify-center gap-4">
        <a 
          href="/login" 
          className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Login
        </a>

        <a 
          href="/signup" 
          className="px-6 py-2 border border-gray-900 rounded hover:bg-gray-100"
        >
          Create Account
        </a>
      </div>
    </div>
  );
}
