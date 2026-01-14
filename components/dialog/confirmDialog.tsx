import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {JSX} from "react";

type DialogProps = {
    isShow?: boolean;
    title?: string;
    children: JSX.Element;
    
    okText?: string;
    cancelText?: string;
    ok: () => void;
    cancel: () => void;
};

export default function ConfirmationDialog(props: DialogProps) {
    const {
        isShow,
        title,
        children,
        okText,
        cancelText,

        ok,
        cancel,
    } = props;

    const handleOk = (): void => {
        ok();
    };

    const handleCancel = (): void => {
        cancel();
    };

    return (
        <>
            <Modal show={isShow} onHide={cancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            {cancelText}
                        </Button>
                        <Button variant="primary" onClick={handleOk}>
                            {okText}
                        </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
