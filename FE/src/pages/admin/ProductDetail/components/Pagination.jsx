import React from 'react';

const Pagination = ({ page, totalPages, setPage, pageSize, setPageSize }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
        <select
          id="entries"
          className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <span className="text-sm text-gray-700">Sản phẩm</span>
      </div>


      <div className="flex items-center">
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
          onClick={() => setPage(page > 0 ? page - 1 : 0)}
        >
          {"<"}
        </button>
        <div className="mx-2 text-xs">{`Trang ${page + 1} / ${totalPages}`}</div>
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
          onClick={() => setPage(page < totalPages - 1 ? page + 1 : totalPages - 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
