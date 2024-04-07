import { useContext, useEffect, useRef, useState } from "react";
import { Notification } from "@classes/Notification";
import { db } from '../config/firebase';
import { UserContext } from "src/App";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import '@styles/Inbox.css';

const Inbox: React.FC = () => {
    const [user] = useContext(UserContext);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [Notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const inboxMenu = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setOpen(!open);

    // opens notification popup and changes the read status
    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setOpen(false);
        if (!notification.read) {
            updateDoc(doc(db, 'Notification', notification.id), { read: true });
            const updatedNotification = { ...notification, read: true };
            setNotifications(prevNotifications =>
                prevNotifications.map(prevNotif =>
                    prevNotif.id === notification.id ? updatedNotification : prevNotif
                )
            );
            setUnreadNotifications(unreadNotifications - 1);
        }
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    // gets the user's notifications
    useEffect(() => {
        const q = query(collection(db, 'Notification'), where('user_id', '==', user?.username));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notifs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return new Notification(doc.id, data.title, data.sender, data.info, data.priority, data.read)
            });
            setNotifications(notifs);
            setUnreadNotifications(notifs.filter(e => !e.read).length);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let closeDropdown = (e: MouseEvent) => {
            if (!inboxMenu.current?.contains(e.target as Node)) {
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
                        {Notifications.length === 0 &&
                            <div className="empty-inbox">
                                <p>No notifications</p>
                            </div>}
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