package com.zenve.admin.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ExecutiveDoctorAddRequest(
        @NotBlank String fullName,
        String email,
        String password,
        @NotBlank String phone,
        String qualification,
        String specializations,
        Integer experienceYears,
        BigDecimal consultationFee,
        String pincode,
        String city
) {
}
