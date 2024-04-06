import { useEffect, useRef, useState } from "react";
import { Notification } from "@classes/Notification";
import '@styles/Inbox.css';

const Inbox: React.FC = () => {
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [Notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const inboxMenu = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setOpen(!open);

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setOpen(false);
        if (!notification.read) {
            notification.read = true;
            setUnreadNotifications(unreadNotifications - 1);
        }
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    useEffect(() => {
        // Fetch unread Notifications count and Notifications data from your API
        // Example:
        // fetchUnreadNotificationsCount()
        //   .then(count => setUnreadNotifications(count))
        // fetchNotifications()
        //   .then(Notifications => setNotifications(Notifications))
    }, []);
    
    useEffect(() => {
        let closeDropdown = (e: MouseEvent) => {
            if(!inboxMenu.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        
        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        }
    });

    return (
        <div className="inbox" ref={inboxMenu}>
            <div className="inbox-icon" onClick={toggleDropdown}>
                <i className="fa-solid fa-bell" />
                {unreadNotifications > 0 && <span className="unread-count">{unreadNotifications}</span>}
            </div>
            {open && (
                <div className="inbox-dropdown">
                    <div>
                        {Notifications.map((notification, index) => (
                            <div className="inbox-content" key={index} onClick={() => handleNotificationClick(notification)}>
                                <div className="unread">{!notification.read && <p>&#8226;</p>}</div>
                                <div className="notif-info">
                                    <div className="notif-title">{notification.title}</div>
                                    <div className="notif-sender">{notification.sender}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {selectedNotification && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>{selectedNotification.title}</h2>
                                <p>{selectedNotification.sender}</p>
                            </div>
                            <button className="modal-close-button" onClick={handleCloseModal}>X</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Priority:</strong> {selectedNotification.priority}</p>
                            <p>{selectedNotification.info}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;