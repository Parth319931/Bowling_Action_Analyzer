// src/components/common/Modal.jsx
/**
 * Modal Component
 * ---------------
 * Reusable modal/dialog overlay with animations
 * 
 * Features:
 * - Smooth fade-in/out animations
 * - Click outside to close
 * - ESC key to close
 * - Customizable header, body, footer
 * - Responsive sizing
 * - Portal rendering (renders outside DOM hierarchy)
 * 
 * Props:
 * - isOpen: Boolean to control visibility
 * - onClose: Function called when modal should close
 * - title: Modal header title
 * - children: Modal content
 * - footer: Optional footer content (usually buttons)
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalContainer = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  max-height: 90vh;
  overflow: auto;
  position: relative;
  
  ${props => props.size === 'sm' && `max-width: 400px;`}
  ${props => props.size === 'md' && `max-width: 600px;`}
  ${props => props.size === 'lg' && `max-width: 900px;`}
  
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.neutral[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            size={size}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton onClick={onClose}>
                <MdClose />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>{children}</ModalBody>
            
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
