package backend.datn.mapper;

import backend.datn.dto.response.CartItemResponse;
import backend.datn.entities.Cart;
import backend.datn.entities.ProductDetail;
import backend.datn.entities.Promotion;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

public class CartMapper {
    public static CartItemResponse toCartItemResponse(Cart cart) {
        if (cart == null || cart.getProductDetail() == null) {
            throw new IllegalArgumentException("Cart hoặc ProductDetail không hợp lệ");
        }

        CartItemResponse response = new CartItemResponse();
        response.setId(cart.getId());
        response.setProductDetailId(cart.getProductDetail().getId());
        response.setProductName(cart.getProductDetail().getProduct().getProductName());
        response.setProductDetailName(getDetailName(cart.getProductDetail())); // ✅ Sử dụng getDetailName()
        response.setPhoto(cart.getProductDetail().getPhoto());
        response.setBrandName(cart.getProductDetail().getProduct().getBrand().getBrandName()); // Nếu có brand
        response.setCategoryName(cart.getProductDetail().getProduct().getCategory().getCategoryName()); // Nếu có
                                                                                                        // category
        response.setQuantity(cart.getQuantity());

        BigDecimal salePrice = cart.getProductDetail().getSalePrice();
        response.setPrice(salePrice);

        // Tính giá giảm nếu có khuyến mãi
        // Lấy thông tin promotion từ ProductDetail trong giỏ hàng
        Promotion promotion = cart.getProductDetail().getPromotion();

        // Giá mặc định = giá gốc
        BigDecimal discountPrice = salePrice;

        // Nếu có khuyến mãi, đang hoạt động và có % giảm giá
        if (promotion != null && promotion.getStatus() && promotion.getPromotionPercent() != null) {
            LocalDateTime now = LocalDateTime.now();

            // Kiểm tra thời gian khuyến mãi có hợp lệ không
            if (!now.isBefore(promotion.getStartDate()) && !now.isAfter(promotion.getEndDate())) {

                // Tính số tiền được giảm = salePrice * %khuyến mãi / 100
                BigDecimal discountAmount = salePrice
                        .multiply(BigDecimal.valueOf(promotion.getPromotionPercent()))
                        .divide(BigDecimal.valueOf(100));

                // Giá sau khuyến mãi = giá gốc - số tiền được giảm
                discountPrice = salePrice.subtract(discountAmount);
            }
        }

        // Set giá giảm vào response DTO
        response.setDiscountPrice(discountPrice);

        return response;

    }

    public static String getDetailName(ProductDetail productDetail) {
        if (productDetail == null || productDetail.getProduct() == null) {
            return "Sản phẩm không hợp lệ";
        }

        StringBuilder detailName = new StringBuilder(productDetail.getSize().getSizeName());

        if (productDetail.getColor() != null) {
            detailName.append(" - ").append(productDetail.getColor().getColorName());
        }
        if (productDetail.getCollar() != null) {
            detailName.append(" - ").append(productDetail.getCollar().getCollarName());
        }
        if (productDetail.getSleeve() != null) {
            detailName.append(" - ").append(productDetail.getSleeve().getSleeveName());
        }

        return detailName.toString();
    }
}
