package com.example.api.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String userAgent = request.getHeader("User-Agent");
        String clientIP = getClientIP(request);
        
        // Construire l'URL complète
        String fullUrl = uri;
        if (queryString != null && !queryString.isEmpty()) {
            fullUrl += "?" + queryString;
        }
        
        logger.info("🌐 [{}] REQUEST - {} {} - IP: {} - User-Agent: {}", 
            timestamp, method, fullUrl, clientIP, userAgent);
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        
        if (ex != null) {
            logger.error("❌ [{}] RESPONSE ERROR - {} {} - Status: {} - Error: {}", 
                timestamp, method, uri, status, ex.getMessage());
        } else if (status >= 400) {
            logger.warn("⚠️ [{}] RESPONSE WARNING - {} {} - Status: {}", 
                timestamp, method, uri, status);
        } else {
            logger.info("✅ [{}] RESPONSE SUCCESS - {} {} - Status: {}", 
                timestamp, method, uri, status);
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
} 