package backend.datn.controllers;

import backend.datn.dto.ApiResponse;
import backend.datn.dto.request.ProductCreateRequest;
import backend.datn.dto.request.ProductUpdateRequest;
import backend.datn.dto.response.ProductDetailResponse;
import backend.datn.dto.response.ProductResponse;
import backend.datn.dto.response.UserProductResponse;
import backend.datn.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        try {
            Page<ProductResponse> products = productService.getAllProducts(keyword, status, page, size, sortBy, sortDirection);
            return new ResponseEntity<>(new ApiResponse("success", "Products retrieved successfully", products), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Integer id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return new ResponseEntity<>(new ApiResponse("success", "Product retrieved successfully", product), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProduct(@Valid @RequestBody ProductCreateRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return new ResponseEntity<>(new ApiResponse("error", "Validation failed", errors), HttpStatus.BAD_REQUEST);
        }
        try {
            ProductResponse product = productService.createProduct(request);
            return new ResponseEntity<>(new ApiResponse("success", "Product created successfully", product), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductUpdateRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return new ResponseEntity<>(new ApiResponse("error", "Validation failed", errors), HttpStatus.BAD_REQUEST);
        }
        try {
            ProductResponse product = productService.updateProduct(id, request);
            return new ResponseEntity<>(new ApiResponse("success", "Product updated successfully", product), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>(new ApiResponse("success", "Product deleted successfully"), HttpStatus.NO_CONTENT);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse> toggleProductStatus(@PathVariable Integer id) {
        try {
            ProductResponse product = productService.toggleProductStatus(id);
            return new ResponseEntity<>(new ApiResponse("success", "Product status toggled successfully", product), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details/{productCode}")
    public ResponseEntity<ApiResponse> getProductDetailsByProductCode(@PathVariable String productCode) {
        try {
            List<ProductDetailResponse> productDetails = productService.getProductDetailsByProductCode(productCode);
            return new ResponseEntity<>(new ApiResponse("success", "Product details retrieved successfully", productDetails), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/filter")
    public ResponseEntity<Page<UserProductResponse>> getFilteredProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<Integer> brandIds,
            @RequestParam(required = false) List<Integer> categoryIds,
            @RequestParam(required = false) List<Integer> materialIds,
            @RequestParam(required = false) List<Integer> collarIds,
            @RequestParam(required = false) List<Integer> sleeveIds,
            @RequestParam(required = false) List<Integer> colorIds,
            @RequestParam(required = false) List<Integer> sizeIds,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserProductResponse> products = productService.getAllProductUser(
                search, brandIds, categoryIds, materialIds, collarIds, sleeveIds,
                colorIds, sizeIds, minPrice, maxPrice, sortBy, sortDir, page, size
        );
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter-by-attributes")
    public ResponseEntity<Page<UserProductResponse>> getProductsByAttributes(
            @RequestParam(required = false) String brandName,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String materialName,
            @RequestParam(required = false) String collarName,
            @RequestParam(required = false) String sleeveName,
            @RequestParam(required = false) String colorName,
            @RequestParam(required = false) String sizeName,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<UserProductResponse> products = productService.getProductsByAttributes(
                brandName, categoryName, materialName, collarName, sleeveName,
                colorName, sizeName, minPrice, maxPrice, sortBy, sortDir, page, size
        );
        return ResponseEntity.ok(products);
    }

}