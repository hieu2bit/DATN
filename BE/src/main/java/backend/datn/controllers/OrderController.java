package backend.datn.controllers;

import backend.datn.dto.ApiResponse;
import backend.datn.dto.response.OrderResponse;
import backend.datn.dto.response.PagedResponse;
import backend.datn.entities.*;
import backend.datn.exceptions.EntityNotFoundException;
import backend.datn.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAlOrder(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Page<OrderResponse> orderPage = orderService.getAllOrders(search, page, size, sortBy, sortDir);

            // Bọc dữ liệu vào PagedResponse
            PagedResponse<OrderResponse> responseData = new PagedResponse<>(orderPage);

            ApiResponse response = new ApiResponse("success", "Lấy danh sách hóa đơn thành công", responseData);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("error", "Đã xảy ra lỗi khi lấy danh sách hóa đơn", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOrderId(@PathVariable int id) {
        try {
            OrderResponse orderRespone = orderService.getOrderById(id);
            ApiResponse response = new ApiResponse("success", "Lấy hóa đơn theo ID thành công", orderRespone);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            ApiResponse response = new ApiResponse("error", e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("error", "Đã xảy ra lỗi khi lấy hóa đơn", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse> toggleStatusOrder(@PathVariable Integer id){
        try {
            OrderResponse orderResponse = orderService.toggleStatusOrder(id);
            ApiResponse response = new ApiResponse("success", "Chuyển đổi trạng thái hóa đơn thành công", orderResponse);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            ApiResponse response = new ApiResponse("error", e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("error", "Đã xảy ra lỗi khi chuyển đổi trạng thái của hóa đơn", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse> getOrderDetails(@PathVariable int id) {
        try {
            OrderResponse orderResponse = orderService.getOrderWithDetails(id);
            ApiResponse response = new ApiResponse("success", "Lấy chi tiết hóa đơn thành công", orderResponse);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            ApiResponse response = new ApiResponse("error", e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("error", "Đã xảy ra lỗi khi lấy chi tiết hóa đơn", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cập nhật trạng thái đơn hàng theo mã số
    @PutMapping("/{id}/pending")
    public ResponseEntity<ApiResponse> pendingOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, 0); // 0: Chờ xác nhận
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse> confirmOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, 2); // 2: Đã xác nhận
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse> processOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, 1); // 1: Chờ thanh toán
    }

    @PutMapping("/{id}/ship")
    public ResponseEntity<ApiResponse> shipOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, 3); // 3: Đang giao hàng
    }

    @PutMapping("/{id}/failed-delivery")
    public ResponseEntity<ApiResponse> failedDelivery(@PathVariable Integer id) {
        return updateOrderStatus(id, 4); // 4: Giao hàng không thành công
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse> completeOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, 5); // 5: Hoàn thành
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelOrder(@PathVariable Integer id) {
        return updateOrderStatus(id, -1); // -1: Đã hủy
    }

    private ResponseEntity<ApiResponse> updateOrderStatus(Integer id, int status) {
        try {
            OrderResponse orderResponse = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(new ApiResponse("success", "Cập nhật trạng thái đơn hàng thành công", orderResponse));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Lỗi khi cập nhật trạng thái đơn hàng", null));
        }
    }
}
