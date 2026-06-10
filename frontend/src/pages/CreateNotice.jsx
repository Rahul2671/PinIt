import { useState } from "react";

function CreateNotice() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [community, setCommunity] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNotice = {
      title,
      category,
      community,
      description,
    };

    console.log(newNotice);

    setTitle("");
    setCategory("");
    setCommunity("");
    setDescription("");
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-6">
          Create Notice
        </h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        >
          <option value="">Select Category</option>
          <option value="Events">Events</option>
          <option value="Lost & Found">
            Lost & Found
          </option>
          <option value="Services">
            Services
          </option>
        </select>

        <input
          type="text"
          placeholder="Community"
          value={community}
          onChange={(e) =>
            setCommunity(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
          rows="4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Post Notice
        </button>
      </form>
    </div>
  );
}

export default CreateNotice;