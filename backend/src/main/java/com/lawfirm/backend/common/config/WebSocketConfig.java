package com.lawfirm.backend.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Realtime transport foundation only (per docs/11-system-design-document.md's WebSocket/STOMP
 * design), justified for Phase 3 by the master prompt's "WebSocket foundation only where
 * justified" instruction. Registers the STOMP endpoint and a simple in-memory broker — no
 * {@code @MessageMapping} handlers or Lead-notification business logic exist yet; that lives
 * in {@link com.lawfirm.backend.notification} in a later phase.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
