import { createPortal } from "react-dom";
import { MaterialCloseRounded } from "./icons/MaterialCloseRounded";
import { ReactNode } from "react";

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
                {/* <MaterialCloseRounded onClick={onClose} /> */}
            </div>
            {children}
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
                padding: 20px;
                width: 400px;
                max-width: 100%;
                max-height: 100%;
            }
            .header h2 {
                margin: 0;
            }
        `}</style>
    </div>, document.querySelector('#modals')!)
}