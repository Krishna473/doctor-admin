package com.zenve.admin.service;

import com.zenve.admin.model.Doctor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class ZippyCrmNotifier {

    private static final Logger log = LoggerFactory.getLogger(ZippyCrmNotifier.class);
    private final RestTemplate restTemplate;

    public ZippyCrmNotifier(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void notifyApproved(Doctor doctor) {
        push(doctor.getPhone(), "Approved");
    }

    public void notifyRejected(Doctor doctor) {
        push(doctor.getPhone(), "Rejected");
    }

    private void push(String phone, String status) {
        if (phone == null || phone.isBlank()) {
            log.warn("Cannot notify Zippy CRM: Doctor does not have a phone number.");
            return;
        }

        String url = "http://localhost:8000/internal/doctors/status";

        Map<String, String> body = new HashMap<>();
        body.put("phone", phone);
        body.put("status", status);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            restTemplate.postForEntity(url, new HttpEntity<>(body, headers), Void.class);
        } catch (RestClientException ex) {
            log.warn("Could not notify Zippy CRM backend about status change for phone {}: {}", phone, ex.getMessage());
        }
    }
}
