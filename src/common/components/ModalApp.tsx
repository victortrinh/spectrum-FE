import * as React from "react";
import styled from "styled-components";
import { StyledButton } from "./Button.styles";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: boolean;
  title: string;
  cancelButton: string;
  saveButton: string;
  toggle: () => void;
  onSave: () => void;
};

export class ModalApp extends React.PureComponent<Props> {
  public render() {
    const {
      isOpen,
      toggle,
      title,
      children,
      onSave,
      cancelButton,
      saveButton
    } = this.props;

    return (
      <StyledModal centered={true} isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <StyledButton variant="secondary" onClick={toggle}>
            {cancelButton}
          </StyledButton>{" "}
          <StyledButton variant="primary" onClick={onSave}>
            {saveButton}
          </StyledButton>
        </ModalFooter>
      </StyledModal>
    );
  }
}

const StyledModal = styled(Modal)`
  width: 1000px;
`;
