import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 5,
  onItemsPerPageChange,
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const limitOptions = [5, 10, 15, 20, 50, 100, 200, 300, 400, 500];

  const handleLimitChange = (limit: number) => {
    setShowLimitModal(false);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(limit);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            Página {currentPage} de {totalPages}
          </Text>
          {totalItems !== undefined && (
            <Text style={styles.infoText}>
              Total: {totalItems} usuarios
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.limitSelector}
          onPress={() => setShowLimitModal(true)}
        >
          <Text style={styles.limitLabel}>Mostrar:</Text>
          <Text style={styles.limitValue}>{itemsPerPage}</Text>
          <Text style={styles.limitArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
          onPress={() => canGoPrevious && onPageChange(1)}
          disabled={!canGoPrevious}
        >
          <Text style={[styles.buttonText, !canGoPrevious && styles.buttonTextDisabled]}>
            ⟪
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
          onPress={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <Text style={[styles.buttonText, !canGoPrevious && styles.buttonTextDisabled]}>
            ‹
          </Text>
        </TouchableOpacity>

        {getPageNumbers().map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.pageButton,
              page === currentPage && styles.pageButtonActive,
            ]}
            onPress={() => onPageChange(page)}
          >
            <Text
              style={[
                styles.pageButtonText,
                page === currentPage && styles.pageButtonTextActive,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, !canGoNext && styles.buttonDisabled]}
          onPress={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <Text style={[styles.buttonText, !canGoNext && styles.buttonTextDisabled]}>
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !canGoNext && styles.buttonDisabled]}
          onPress={() => canGoNext && onPageChange(totalPages)}
          disabled={!canGoNext}
        >
          <Text style={[styles.buttonText, !canGoNext && styles.buttonTextDisabled]}>
            ⟫
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLimitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLimitModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLimitModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Items por página</Text>
            <ScrollView style={styles.optionsList}>
              {limitOptions.map((limit) => (
                <TouchableOpacity
                  key={limit}
                  style={[
                    styles.optionItem,
                    limit === itemsPerPage && styles.optionItemActive,
                  ]}
                  onPress={() => handleLimitChange(limit)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      limit === itemsPerPage && styles.optionTextActive,
                    ]}
                  >
                    {limit}
                  </Text>
                  {limit === itemsPerPage && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLimitModal(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  info: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  limitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  limitLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 6,
  },
  limitValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginRight: 6,
  },
  limitArrow: {
    fontSize: 10,
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    minWidth: 36,
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
  },
  buttonDisabled: {
    backgroundColor: '#f9fafb',
  },
  buttonText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#d1d5db',
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    minWidth: 36,
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
  },
  pageButtonActive: {
    backgroundColor: '#6366f1',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  optionItemActive: {
    backgroundColor: '#e0e7ff',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#6366f1',
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Pagination;

