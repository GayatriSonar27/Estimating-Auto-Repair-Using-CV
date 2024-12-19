export const Header = () => {
  return (
    <header className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center">
            <img
              src="/aress-logo.png"
              className="mr-6 h-10 sm:h-12"
              alt="Aress Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Estimating Auto Repair Using CV
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
};
