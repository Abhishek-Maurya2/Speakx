import React, { useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const baseURL = import.meta.env.VITE_API_URL;
const search = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/search/`, { ...data });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

function SearchPage() {
  const [parameters, setParameters] = useState({
    title: "",
    type: "",
    anagramType: "",
  });
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const handleSearch = async () => {
    let { type, anagramType } = parameters;

    if (type === "All") type = "";
    if ((type === "ANAGRAM" && anagramType === "ALL") || type !== "ANAGRAM") {
      anagramType = "";
    }

    try {
      setLoading(true);
      const results = await search({ ...parameters, type, anagramType });
      setAllResults(results);
      setCurrentPage(1); // Reset to first page on new search
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(allResults.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentResults = allResults.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4 items-center justify-center px-10 bg-[#f4f4f5]">
      <h1 className="text-[8vw] sm:text-[4vw] font-bold">Search Questions</h1>
      <div className="flex flex-row flex-wrap justify-center items-center gap-2">
        <div className="flex flex-row border border-gray rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) =>
              setParameters({ ...parameters, title: e.target.value })
            }
            value={parameters.title}
            className="px-2 py-4 outline-none focus:outline-none min-w-[300px] w-[40vw] bg-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-full outline-none focus:outline-none"
          >
            <ArrowRight />
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <select
            name="type"
            onChange={(e) =>
              setParameters((prev) => ({
                ...prev,
                type: e.target.value,
                anagramType:
                  e.target.value !== "ANAGRAM" ? "" : prev.anagramType,
              }))
            }
            value={parameters.type}
            className="
              px-2 py-4 outline-none focus:outline-none border rounded-full
            "
          >
            <option value="All">All</option>
            <option value="MCQ">MCQ</option>
            <option value="ANAGRAM">ANAGRAM</option>
            <option value="READ_ALONG">READ_ALONG</option>
          </select>
          {parameters.type === "ANAGRAM" && (
            <select
              name="anagramType"
              onChange={(e) =>
                setParameters({ ...parameters, anagramType: e.target.value })
              }
              value={parameters.anagramType}
              className="
                px-2 py-4 outline-none focus:outline-none border rounded-full
              "
            >
              <option value="All">All</option>
              <option value="WORD">WORD</option>
              <option value="SENTENCE">SENTENCE</option>
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* Results list */}
          <div>
            {currentResults.map((result) => (
              <div key={result._id}>
                <h1>{result.title}</h1>
                <p>{result.type}</p>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {allResults.length > 0 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
