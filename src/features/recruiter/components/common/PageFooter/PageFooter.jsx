import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Pagination from '../Pagination/Pagination';
import { paginationTheme } from '../Pagination/PagintionTheme';
import './PageFooter.css';

const PageFooter = ({
    // Pagination props
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    showPagination = true,
    showInfo = true,
    maxVisiblePages = 7,

    // Debug props
    forceShowPagination = false,

    // Pagination Material UI props
    paginationSize = 'medium',
    paginationVariant = 'outlined',
    paginationColor = 'primary',
    paginationShape = 'rounded',
    showFirstButton = false,
    showLastButton = false,

    // Footer content props
    showFooterInfo = true,
    showQuickActions = false,
    quickActions = [],

    // Additional info
    lastUpdated,
    showLastUpdated = false,

    // Stats
    stats = [],
    showStats = false,

    // Custom content
    children,

    // Styling
    className = '',
    variant = 'default'
}) => {
    const hasContent = showFooterInfo || showQuickActions || showLastUpdated || showStats || children;
    const shouldShowPagination = showPagination && (totalPages > 1 || forceShowPagination);

    // Debug log
    console.log('🦶 PageFooter Debug:', {
        hasContent,
        showPagination,
        totalPages,
        shouldShowPagination,
        forceShowPagination,
        currentPage,
        totalItems
    });

    if (!hasContent && !shouldShowPagination) {
        console.log('❌ PageFooter hidden: no content and no pagination');
        return null;
    }

    const formatLastUpdated = (date) => {
        if (!date) return '';
        try {
            const dateObj = new Date(date);
            return dateObj.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return '';
        }
    };

    return (
        <footer className={`page-footer ${variant} ${className}`}>
            {/* Debug Info */}
            {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          margin: '8px 0',
          fontSize: '0.75rem',
          color: '#92400e'
        }}>
          🐛 Footer Debug: Content={hasContent.toString()}, Pagination={shouldShowPagination.toString()}, 
          Pages={totalPages}, Items={totalItems}
        </div>
      )} */}

            {/* Main Footer Content */}
            {hasContent && (
                <div className="footer-content">
                    {/* Simple Material UI Pagination Section */}
                    {shouldShowPagination && (
                        <div className="footer-pagination simple">
                            <ThemeProvider theme={paginationTheme}>
                                <CssBaseline />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={totalItems}
                                    showInfo={showInfo}
                                    maxVisiblePages={maxVisiblePages}
                                    forceShow={forceShowPagination}
                                    className="simple-pagination"
                                />
                            </ThemeProvider>
                        </div>
                    )}

                    {/* Stats Section */}
                    {showStats && stats.length > 0 && (
                        <div className="footer-stats">
                            <div className="stats-grid">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <span className="stat-value" style={{ color: stat.color || '#3b82f6' }}>
                                            {stat.value}
                                        </span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Info Section */}
                    {showFooterInfo && (
                        <div className="footer-info">
                            <div className="footer-left">
                                {showLastUpdated && lastUpdated && (
                                    <div className="last-updated">
                                        <svg className="clock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span>Cập nhật lần cuối: {formatLastUpdated(lastUpdated)}</span>
                                    </div>
                                )}

                                <div className="footer-meta">
                                    <span className="copyright">© 2025 WorkHub. All rights reserved.</span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            {showQuickActions && quickActions.length > 0 && (
                                <div className="footer-actions">
                                    <div className="quick-actions">
                                        {quickActions.map((action, index) => (
                                            <button
                                                key={index}
                                                className={`action-btn ${action.variant || 'secondary'} ${action.loading ? 'loading' : ''}`}
                                                onClick={action.onClick}
                                                disabled={action.disabled || action.loading}
                                                title={action.tooltip}
                                            >
                                                {action.icon && (
                                                    <span className="action-icon">{action.icon}</span>
                                                )}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Custom Content */}
                    {children && (
                        <div className="footer-custom">
                            {children}
                        </div>
                    )}
                </div>
            )}



            {/* Scroll to Top Button */}
            {/* <button
                className="scroll-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Cuộn lên đầu trang"
            >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="18,15 12,9 6,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button> */}
        </footer>
    );
};

export default PageFooter;