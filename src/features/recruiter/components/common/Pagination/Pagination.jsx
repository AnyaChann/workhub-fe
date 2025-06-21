import React from 'react';
import { 
  Pagination as MuiPagination, 
  Typography, 
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import './Pagination.css';

// Styled MUI Pagination để giống CHÍNH XÁC hình mẫu
const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: '#6b7280',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.875rem',
    fontWeight: 400,
    minWidth: '40px',
    height: '40px',
    margin: '0 4px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    '&.Mui-selected': {
      backgroundColor: '#e5e7eb',
      color: '#111827',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#d1d5db',
      },
    },
    '&.MuiPaginationItem-ellipsis': {
      border: 'none',
      backgroundColor: 'transparent',
      color: '#9ca3af',
      fontSize: '0.875rem',
      fontWeight: 400,
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#9ca3af',
      },
    },
  },
  '& .MuiPaginationItem-previousNext': {
    borderRadius: '8px',
    padding: '0 12px',
    minWidth: '40px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaginationItem-root': {
      minWidth: '32px',
      height: '32px',
      fontSize: '0.8rem',
      margin: '0 2px',
    },
    '& .MuiPaginationItem-previousNext': {
      padding: '0 8px',
      minWidth: '32px',
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
      },
    },
  },
}));

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showInfo = true,
  maxVisiblePages = 6,
  disabled = false,
  className = '',
  // Thêm prop để force hiển thị cho debug
  forceShow = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Debug log
  console.log('🔍 Pagination Debug:', {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    forceShow,
    shouldShow: totalPages > 1 || forceShow
  });

  // CHỈNH SỬA: Cho phép hiển thị ngay cả khi chỉ có 1 trang nếu forceShow = true
  if (totalPages <= 1 && !forceShow) {
    console.log('❌ Pagination hidden: totalPages <= 1 and forceShow = false');
    return null;
  }

  // Nếu totalPages <= 1 nhưng forceShow = true, set tối thiểu 1 trang
  const displayTotalPages = Math.max(totalPages, 1);
  const displayCurrentPage = Math.min(currentPage, displayTotalPages);

  // Tính toán thông tin hiển thị
  const startItem = (displayCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(displayCurrentPage * itemsPerPage, totalItems);

  // Settings giống CHÍNH XÁC hình mẫu
  const getPaginationProps = () => {
    if (isMobile) {
      return {
        siblingCount: 0,
        boundaryCount: 1,
        showFirstButton: false,
        showLastButton: false,
      };
    }
    return {
      siblingCount: 2,
      boundaryCount: 1,
      showFirstButton: false,
      showLastButton: false,
    };
  };

  const paginationProps = getPaginationProps();

  const handlePageChange = (event, page) => {
    console.log('📄 Page changed to:', page);
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box className={`pagination-container clean ${className}`}>
      {/* Debug Info */}
      {/* {process.env.NODE_ENV === 'development' && (
        <Box sx={{ 
          fontSize: '0.75rem', 
          color: '#ef4444', 
          mb: 1,
          p: 1,
          bgcolor: '#fef2f2',
          borderRadius: 1,
          border: '1px solid #fecaca'
        }}>
          🐛 Debug: Pages={displayTotalPages}, Current={displayCurrentPage}, Items={totalItems}, Force={forceShow.toString()}
        </Box>
      )} */}

      {/* Info Text - Bên trái như hình */}
      {showInfo && !isMobile && (
        <Box className="pagination-info-left">
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 400,
              color: '#6b7280',
              fontFamily: 'inherit'
            }}
          >
            Hiển thị {startItem}-{endItem} trong tổng số {totalItems.toLocaleString()} mục
          </Typography>
        </Box>
      )}

      {/* Mobile compact info */}
      {showInfo && isMobile && (
        <Box className="pagination-info-mobile">
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem',
              color: '#6b7280',
              fontFamily: 'inherit'
            }}
          >
            Trang {displayCurrentPage} / {displayTotalPages}
          </Typography>
        </Box>
      )}

      {/* Pagination Controls - Bên phải như hình */}
      <Box className="pagination-controls">
        <StyledPagination
          count={displayTotalPages}
          page={displayCurrentPage}
          onChange={handlePageChange}
          variant="text"
          shape="rounded"
          disabled={disabled}
          {...paginationProps}
          sx={{
            '& .MuiPagination-ul': {
              flexWrap: 'nowrap',
              justifyContent: 'center',
              gap: '0px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Pagination;