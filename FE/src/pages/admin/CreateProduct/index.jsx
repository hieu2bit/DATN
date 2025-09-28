
import React, { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ProductVariants from "./components/ProductVariants";
import ProductService from "../../../services/ProductService";
import ProductDetailService from "../../../services/ProductDetailService";
import CollarService from "../../../services/CollarService";
import SleeveService from "../../../services/SleeveService";
import ColorService from "../../../services/ColorService";
import SizeService from "../../../services/SizeService";
import PromotionService from "../../../services/PromotionServices";

export default function CreateProduct() {
  const [products, setProducts] = useState([]);
  const [collars, setCollars] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [generateData, setGenerateData] = useState({
    productId: null,
    sizeId: [], // Start empty
    colorId: [], // Start empty
    collarId: [], // Start empty
    sleeveId: [], // Start empty
    promotionId: null,
    importPrice: "",
    salePrice: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  const fetchSelectOptions = async () => {
    try {
      const productData = await ProductService.getAllProducts(0, 1000);
      setProducts(productData.content);

      const collarData = await CollarService.getAllCollars();
      setCollars(collarData.content);

      const sizeData = await SizeService.getAllSizes();
      setSizes(sizeData.content);

      const colorData = await ColorService.getAllColors();
      setColors(colorData.content);

      const sleeveData = await SleeveService.getAllSleeves();
      setSleeves(sleeveData.content);

      const promotionData = await PromotionService.getAllPromotions();
      const today = new Date();
      const validPromotions = promotionData.content.filter((promotion) => {
        const end = new Date(promotion.endDate);
        return promotion.status === true && end >= today;
      });
      setPromotions(validPromotions);
    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    const newGenerateData = { ...generateData };

    if (name === "product") {
      newGenerateData.productId = selectedOption ? selectedOption.value : null;
    } else if (name === "collar") {
      newGenerateData.collarId = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
    } else if (name === "sleeve") {
      newGenerateData.sleeveId = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
    } else if (name === "color") {
      newGenerateData.colorId = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
    } else if (name === "size") {
      newGenerateData.sizeId = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
    } else if (name === "promotion") {
      newGenerateData.promotionId = selectedOption
        ? selectedOption.value
        : null;
    }

    setGenerateData(newGenerateData);
  };

  const handleCreateOption = async (name, newOption) => {
    try {
      let createdOption;
      if (name === "collar") {
        createdOption = await CollarService.createCollar({ name: newOption });
        setCollars((prev) => [...prev, createdOption]);
      } else if (name === "sleeve") {
        createdOption = await SleeveService.createSleeve({ name: newOption });
        setSleeves((prev) => [...prev, createdOption]);
      } else if (name === "color") {
        createdOption = await ColorService.createColor({ name: newOption });
        setColors((prev) => [...prev, createdOption]);
      } else if (name === "size") {
        createdOption = await SizeService.createSize({ name: newOption });
        setSizes((prev) => [...prev, createdOption]);
      }
      fetchSelectOptions();
      return createdOption;
    } catch (error) {
      console.error("Error creating new option:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenerateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const productDetailData = {
        productId: generateData.productId,
        sizeId: generateData.sizeId || [],
        colorId: generateData.colorId || [],
        collarId: generateData.collarId || [],
        sleeveId: generateData.sleeveId || [],
        promotionId: generateData.promotionId,
        importPrice: generateData.importPrice
          ? parseFloat(generateData.importPrice)
          : null,
        salePrice: generateData.salePrice
          ? parseFloat(generateData.salePrice)
          : null,
        quantity: generateData.quantity
          ? parseInt(generateData.quantity)
          : null,
        description: generateData.description,
      };

      await ProductDetailService.generateProductDetails(productDetailData);
      alert("Product detail generated successfully!");
    } catch (error) {
      console.error("Error generating product detail:", error);
      alert("Error generating product detail");
    }
  };

  // Validation requires productId, sizeId, colorId, collarId, and sleeveId
  const isFormValid = () => {
    return (
      generateData.productId &&
      generateData.sizeId.length > 0 &&
      generateData.colorId.length > 0 &&
      generateData.collarId.length > 0 &&
      generateData.sleeveId.length > 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 p-6 border rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Thuộc tính sản phẩm
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black">
                Tên sản phẩm
              </label>
              <Select
                name="product"
                options={products.map((product) => ({
                  value: product.id,
                  label: product.productName,
                }))}
                isClearable
                placeholder="Chọn sản phẩm"
                onChange={(selectedOption) =>
                  handleSelectChange("product", selectedOption)
                }
                className="rounded-lg text-sm w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Cổ áo
                </label>
                <CreatableSelect
                  name="collar"
                  options={collars.map((collar) => ({
                    value: collar.id,
                    label: collar.name,
                  }))}
                  value={collars
                    .filter((collar) =>
                      generateData.collarId.includes(collar.id)
                    )
                    .map((collar) => ({
                      value: collar.id,
                      label: collar.name,
                    }))}
                  isMulti
                  onChange={(selectedOption) =>
                    handleSelectChange("collar", selectedOption)
                  }
                  onCreateOption={(newOption) =>
                    handleCreateOption("collar", newOption)
                  }
                  placeholder="Chọn hoặc tạo cổ áo"
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Tay áo
                </label>
                <CreatableSelect
                  name="sleeve"
                  options={sleeves.map((sleeve) => ({
                    value: sleeve.id,
                    label: sleeve.sleeveName,
                  }))}
                  value={sleeves
                    .filter((sleeve) =>
                      generateData.sleeveId.includes(sleeve.id)
                    )
                    .map((sleeve) => ({
                      value: sleeve.id,
                      label: sleeve.sleeveName,
                    }))}
                  isMulti
                  onChange={(selectedOption) =>
                    handleSelectChange("sleeve", selectedOption)
                  }
                  onCreateOption={(newOption) =>
                    handleCreateOption("sleeve", newOption)
                  }
                  placeholder="Chọn hoặc tạo tay áo"
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Màu sắc
                </label>
                <CreatableSelect
                  name="color"
                  options={colors.map((color) => ({
                    value: color.id,
                    label: color.name,
                  }))}
                  value={colors
                    .filter((color) => generateData.colorId.includes(color.id))
                    .map((color) => ({ value: color.id, label: color.name }))}
                  isMulti
                  onChange={(selectedOption) =>
                    handleSelectChange("color", selectedOption)
                  }
                  onCreateOption={(newOption) =>
                    handleCreateOption("color", newOption)
                  }
                  placeholder="Chọn hoặc tạo màu sắc"
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Kích thước
                </label>
                <CreatableSelect
                  name="size"
                  options={sizes.map((size) => ({
                    value: size.id,
                    label: size.name,
                  }))}
                  value={sizes
                    .filter((size) => generateData.sizeId.includes(size.id))
                    .map((size) => ({ value: size.id, label: size.name }))}
                  isMulti
                  onChange={(selectedOption) =>
                    handleSelectChange("size", selectedOption)
                  }
                  onCreateOption={(newOption) =>
                    handleCreateOption("size", newOption)
                  }
                  placeholder="Chọn hoặc tạo kích thước"
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Khuyến mãi (không bắt buộc)
                </label>
                <Select
                  name="promotion"
                  options={promotions.map((promotion) => ({
                    value: promotion.id,
                    label: `${promotion.promotionName} - ${promotion.promotionPercent}% (${new Date(
                      promotion.startDate
                    ).toLocaleDateString(
                      "vi-VN"
                    )} - ${new Date(promotion.endDate).toLocaleDateString("vi-VN")})`,
                  }))}
                  isClearable
                  placeholder="Chọn khuyến mãi (tùy chọn)"
                  value={
                    generateData.promotionId
                      ? promotions
                          .filter(
                            (promotion) =>
                              generateData.promotionId === promotion.id
                          )
                          .map((promotion) => ({
                            value: promotion.id,
                            label: `${promotion.promotionName} - ${promotion.promotionPercent}%`,
                          }))
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange("promotion", selectedOption)
                  }
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Số lượng (bắt buộc)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={generateData.quantity}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số lượng (bắt buộc)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Giá nhập (bắt buộc)
                </label>
                <input
                  type="number"
                  name="importPrice"
                  value={generateData.importPrice}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá nhập (bắt buộc)"
                  step={10000}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Giá bán (bắt buộc)
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={generateData.salePrice}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá bán (bắt buộc)"
                  step={10000}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-black mb-1 w-100">
                  Mô tả (không bắt buộc)
                </label>
                <textarea
                  name="description"
                  value={generateData.description}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả (tùy chọn)"
                  maxLength={1024}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biến thể sản phẩm */}
        {isFormValid() ? (
          <div className="col-span-3 bg-white p-3 border rounded-lg shadow-lg">
            <ProductVariants generateData={generateData} />
          </div>
        ) : (
          <div className="col-span-3 p-3 border rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 flex items-center justify-center">
              <FaInfoCircle className="text-5xl text-blue-500" />
            </div>
            <p className="text-gray-600 mt-4">
              Chọn các thuộc tính bắt buộc để hiển thị sản phẩm chi tiết.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
