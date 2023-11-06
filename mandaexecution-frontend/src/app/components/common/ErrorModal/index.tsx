import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'

  import React from 'react';
import { ModalProps } from '../../../type';

  const ErrorModal = (props: ModalProps) => {
    const {isOpen, onOpen, onClose, errorMessage} = props; 

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color='red.400'>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent='center'>
          {errorMessage}
          </ModalBody>
           <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}

export default ErrorModal; 
