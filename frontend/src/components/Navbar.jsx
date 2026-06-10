function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">
        PinIt
      </h1>

      <div className="flex gap-4">
        <button>Home</button>
        <button>Create Notice</button>
        <button>Login</button>
      </div>
    </nav>
  );
}

export default Navbar;