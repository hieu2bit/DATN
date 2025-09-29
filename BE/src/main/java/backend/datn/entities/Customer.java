package backend.datn.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
//    @NotNull
    @Column(name = "customer_code", nullable = false, length = 50)
    private String customerCode;

    @Size(max = 255)
    @Nationalized
    @Column(name = "fullname")
    private String fullname;

    @Size(max = 100)
//    @NotNull
    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Size(max = 255)
//    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "create_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC")
    private Instant createDate;

    @Column(name = "update_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC")
    private Instant updateDate;

    @Column(name = "forget_password")
    private Boolean forgetPassword;

    @Column(name = "status")
    private Boolean status;

    @PrePersist
    protected void onCreate() {
        createDate = Instant.now();
        updateDate = Instant.now();  // ✅ Khi tạo mới, update_date = createDate
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = Instant.now();  // ✅ Khi update, update_date sẽ tự cập nhật
    }

}