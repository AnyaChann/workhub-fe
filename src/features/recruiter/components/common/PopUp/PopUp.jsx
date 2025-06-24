import ReactDOM from 'react-dom';
import React from 'react';
import './PopUp.css';

const PopUp = ({
    isOpen,
    onClose,
    title,
    children,
    type = 'default',
    showCloseButton = true,
    closeOnOverlayClick = true,
    actions = null,
    icon = null,
    size = 'medium'
}) => {
    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const modalContent = (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className={`popup-modal ${type} ${size}`}>
                <div className="popup-header">
                    <div className="header-content">
                        {icon && <div className="header-icon">{icon}</div>}
                        <h3 className="popup-title">{title}</h3>
                    </div>
                    {showCloseButton && (
                        <button className="close-button" onClick={onClose}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="popup-content">{children}</div>
                {actions && <div className="popup-actions">{actions}</div>}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default PopUp;