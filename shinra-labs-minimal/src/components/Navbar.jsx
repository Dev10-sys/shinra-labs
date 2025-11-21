export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white py-4 shadow">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">SHINRA LABS</h1>

        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-blue-400">Home</a>
          <a href="/login" className="hover:text-blue-400">Login</a>
          <a href="/signup" className="hover:text-blue-400">Signup</a>
        </div>
      </div>
    </nav>
  );
}
