export interface ModalProps {
    onClose: () => void; 
    isOpen: boolean; 
    onOpen?: () => void; 
    errorMessage?: string;
}