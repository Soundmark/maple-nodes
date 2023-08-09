function Popover() {
  return (
    <>
      <button
        data-popover-target="popover-default"
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Default popover
      </button>
      <div
        data-popover
        id="popover-default"
        role="tooltip"
        className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
      >
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Popover title
          </h3>
        </div>
        <div className="px-3 py-2">
          <p>And here's some amazing content. It's very engaging. Right?</p>
        </div>
        <div data-popper-arrow></div>
      </div>
    </>
  );
}

export default Popover;
