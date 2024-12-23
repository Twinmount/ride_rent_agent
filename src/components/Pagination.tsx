import ReactPaginate from "react-paginate";

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

export default function Pagination({
  page,
  setPage,
  totalPages,
}: PaginationProps) {
  const handlePageChange = (event: { selected: number }) => {
    setPage(event.selected + 1); // Update the page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };
  return (
    <ReactPaginate
      containerClassName="flex items-center justify-center gap-x-3 !mx-auto h-8 mt-10 mb-5 max-w-[95%]" // The class name for the pagination container
      activeClassName="bg-yellow w-6 h-6 flex justify-center aspect-square rounded-[5px] font-bold text-white " // The class name for the active page
      activeLinkClassName="text-white "
      breakClassName="" // The class name for the break ('...')
      initialPage={page - 1} // The initial page is 0-based
      marginPagesDisplayed={2}
      onPageChange={handlePageChange} // The function to call when the page changes
      pageCount={totalPages} // The total number of pages
      pageRangeDisplayed={2} // The range of pages displayed
      pageClassName="w-6 h-6 text-lg flex justify-center items-center aspect-square rounded-[5px] hover:cursor-pointer " // The class name for the page
      nextClassName="border border-black/20 px-2 rounded-[5px] hover:bg-yellow transition-colors group" // The class name for the next button
      nextLinkClassName="transition-colors group-hover:text-white"
      previousClassName="border border-black/20 px-2 rounded-[5px] hover:bg-yellow transition-colors group" // The class name for the previous button
      previousLinkClassName="transition-colors group-hover:text-white"
      disabledClassName="hover:bg-transparent  cursor-default" //The className for disabled previous and next buttons.
      disabledLinkClassName="text-gray-500 group-hover:text-gray-600 cursor-default" //The className on tag a for disabled previous and next buttons
    />
  );
}
