import { createPortal } from "react-dom";
import { MaterialCloseRounded } from "./icons/MaterialCloseRounded";
import { ReactNode } from "react";
import { Button } from "./Button";

export interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children?: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null

    return createPortal(<div className="modalContainer">
        <div className="modal">
            <div className="header">
                <h2>{title}</h2>
                <button onClick={onClose}>
                    <MaterialCloseRounded />
                </button>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
        <style jsx>{`
            .modalContainer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal {
                background-color: var(--main-bg-color);
                border: 2px solid var(--divider-color);
                color: var(--text-color);
                width: 400px;
                max-width: 100%;
                max-height: 100%;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 2px solid var(--divider-color);
            }
            .header h2 {
                margin: 0;
            }
            .header button {
                background: transparent;
                border: none;
                padding: 0;
                cursor: pointer;
            }
            .content {
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
        `}</style>
    </div>, document.querySelector('#modals')!)
}

export interface ModalConfirmOrDecline {
    onCancel: () => void
    onConfirm?: () => void
    confirmIsSubmit?: boolean
    disableConfirm?: boolean
    confirmText: string
}

export function ModalConfirmOrDecline({ onCancel, onConfirm, confirmIsSubmit, disableConfirm, confirmText }: ModalConfirmOrDecline) {
    const styleOpts = { width: 'auto', flex: '1' }

    return <div className="buttons">
        <Button style={styleOpts} type="button" secondary onClick={onCancel}>Cancel</Button>
        <Button style={styleOpts} type={confirmIsSubmit ? "submit" : "button"} disabled={disableConfirm} onClick={onConfirm}>{confirmText}</Button>
        <style jsx>{`
            .buttons {
                margin-top: 20px;
                display: flex;
                width: 100%;
                gap: 20px;
            }
        `}</style>
    </div>
}