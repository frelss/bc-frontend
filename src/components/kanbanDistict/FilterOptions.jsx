import { useState, useRef, useEffect } from "react";

const FilterOptions = () => {
  const dropdownRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState(
    localStorage.getItem("selectedFilter") || "All tasks"
  );
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    localStorage.setItem("selectedFilter", filter);
    window.dispatchEvent(new CustomEvent("filterChange", { detail: filter }));
    setShowDropdown(false);
  };

  const filters = [
    "All tasks",
    "Incomplete tasks",
    "Completed tasks",
    "Due this week",
    "Due next week",
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {selectedFilter}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`${
                  selectedFilter === filter
                    ? "bg-blue-500 text-white"
                    : "text-gray-200"
                } group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-blue-600 hover:text-white`}
                role="menuitem"
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
