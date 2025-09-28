import React, { useEffect, useState } from "react";
import Select from 'react-select';
import BrandService from "../../../../services/BrandService";
import CategoryService from "../../../../services/CategoryService";
import MaterialService from "../../../../services/MaterialService";

const CreateModal = ({ isVisible, onConfirm, onCancel }) => {
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [newProduct, setNewProduct] = useState({
        brandId: '',
        categoryId: '',
        materialId: '',
        productName: ''
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const brands = await BrandService.getAllBrands();
                setBrandOptions(brands.content.map(brand => ({ value: brand.id, label: brand.brandName })));

                const categories = await CategoryService.getAll();
                setCategoryOptions(categories.content.map(category => ({ value: category.id, label: category.name })));

                const materials = await MaterialService.getAllMaterials();
                setMaterialOptions(materials.content.map(material => ({ value: material.id, label: material.materialName })));
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        if (isVisible) {
            setNewProduct({
                brandId: '',
                categoryId: '',
                materialId: '',
                productName: '',
                productCode: ''
            });
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm sản phẩm mới</h2>
                <div className="mb-4">
                    <label className="block mb-2">Tên sản phẩm</label>
                    <input
                        type="text"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={newProduct.productName}
                        onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                        placeholder="Nhập tên sản phẩm..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Thương hiệu</label>
                    <Select
                        options={[{ value: '', label: 'Chọn thương hiệu...' }, ...brandOptions]}
                        value={brandOptions.find(option => option.value === newProduct.brandId) || { value: '', label: 'Chọn thương hiệu...' }}
                        onChange={(selected) => setNewProduct({ ...newProduct, brandId: selected?.value || '' })}
                        placeholder="Chọn thương hiệu..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Danh mục</label>
                    <Select
                        options={[{ value: '', label: 'Chọn danh mục...' }, ...categoryOptions]}
                        value={categoryOptions.find(option => option.value === newProduct.categoryId) || { value: '', label: 'Chọn danh mục...' }}
                        onChange={(selected) => setNewProduct({ ...newProduct, categoryId: selected?.value || '' })}
                        placeholder="Chọn danh mục..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Chất liệu</label>
                    <Select
                        options={[{ value: '', label: 'Chọn chất liệu...' }, ...materialOptions]}
                        value={materialOptions.find(option => option.value === newProduct.materialId) || { value: '', label: 'Chọn chất liệu...' }}
                        onChange={(selected) => setNewProduct({ ...newProduct, materialId: selected?.value || '' })}
                        placeholder="Chọn chất liệu..."
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => onConfirm(newProduct)}
                    >
                        Thêm mới
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;