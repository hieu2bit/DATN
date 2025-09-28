import React from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { AiOutlineSearch } from "react-icons/ai";

const ProductFilters = ({
  filters,
  search,
  handlePriceChange,
  handleSearchChange,
  handleFilterChange,
  collars,
  sleeves,
  colors,
  sizes,
  minPrice,
  maxPrice,
}) => {
  return (
    <div className="space-y-3 mb-4">
      {/* Hàng 1: Ô tìm kiếm & Khoảng giá */}
      <div className="grid grid-cols-6 gap-3">
        {/* Ô tìm kiếm */}
        <div className="relative col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Mã / tên sản phẩm"
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full pl-8 text-sm"
          />
          <AiOutlineSearch className="absolute left-2 top-7 text-gray-400" />
        </div>

        {/* Khoảng giá */}
        <div className="relative col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Khoảng giá
          </label>
          <div className="px-3 py-1 border border-gray-300 rounded-md">
            <div className="flex justify-between text-sm">
              <span>{filters.minPrice.toLocaleString()} đ</span>
              <span>{filters.maxPrice.toLocaleString()} đ</span>
            </div>
            <Slider
              range
              min={0}
              max={10000000}
              step={10000}
              value={[filters.minPrice, filters.maxPrice]}
              defaultValue={[0, 10000000]}
              onChange={(value) => {
                handlePriceChange("minPrice", value[0]);
                handlePriceChange("maxPrice", value[1]);
              }}
              trackStyle={[{ backgroundColor: "#3b82f6" }]}
              handleStyle={[
                { borderColor: "#3b82f6", backgroundColor: "#3b82f6" },
                { borderColor: "#3b82f6", backgroundColor: "#3b82f6" },
              ]}
              railStyle={{ backgroundColor: "#e5e7eb" }}
            />
          </div>
        </div>
      </div>

      {/* Hàng 2: Các bộ lọc */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cổ áo
          </label>
          <Select
            name="collarId"
            options={collars.map((collar) => ({
              value: collar.id,
              label: collar.name,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              handleFilterChange("collarIds", selectedOptions)
            }
            className="text-sm"
            placeholder="Chọn kiểu cổ áo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tay áo
          </label>
          <Select
            name="sleeveId"
            options={sleeves.map((sleeve) => ({
              value: sleeve.id,
              label: sleeve.sleeveName,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              handleFilterChange("sleeveIds", selectedOptions)
            }
            className="text-sm"
            placeholder="Chọn kiểu tay áo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Màu sắc
          </label>
          <Select
            name="colorId"
            options={colors.map((color) => ({
              value: color.id,
              label: color.name,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              handleFilterChange("colorIds", selectedOptions)
            }
            className="text-sm"
            placeholder="Chọn màu sắc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kích thước
          </label>
          <Select
            name="sizeId"
            options={sizes.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              handleFilterChange("sizeIds", selectedOptions)
            }
            className="text-sm"
            placeholder="Chọn kích thước"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
