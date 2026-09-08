package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.Notification;
import com.inventory.nextStock.Services.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public Notification addNotification(
            @RequestBody Notification notification) {

        return notificationService.addNotification(notification);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @PutMapping("/{id}")
    public Notification updateNotification(
            @PathVariable Integer id,
            @RequestBody Notification notification) {

        return notificationService.updateNotification(id, notification);
    }
}