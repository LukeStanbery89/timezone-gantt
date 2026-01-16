import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]" onClick={onClose}>
      <div className="bg-white rounded-lg w-[90%] max-w-[700px] max-h-[80vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="m-0 text-[1.2rem] text-gray-800">{title}</h3>
          <button className="bg-transparent border-none text-2xl cursor-pointer text-gray-600 p-0 w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-gray-800" onClick={onClose}>×</button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;