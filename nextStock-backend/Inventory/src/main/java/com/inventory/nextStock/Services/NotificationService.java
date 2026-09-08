package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.Notification;
import com.inventory.nextStock.Repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification updateNotification(
            Integer id,
            Notification newNotification) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        notification.setProduct(newNotification.getProduct());
        notification.setNotification_type(
                newNotification.getNotification_type());
        notification.setMessage(newNotification.getMessage());
        notification.setIs_read(newNotification.getIs_read());

        return notificationRepository.save(notification);
    }
}