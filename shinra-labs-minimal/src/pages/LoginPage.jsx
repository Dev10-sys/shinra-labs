export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>

      <input 
        className="w-full p-3 border rounded mb-3" 
        placeholder="Email" 
      />
      <input 
        className="w-full p-3 border rounded mb-3"
        placeholder="Password"
        type="password"
      />

      <button 
        className="w-full p-3 bg-gray-900 text-white rounded hover:bg-gray-800"
      >
        Login
      </button>
    </div>
  );
}
