import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from './Modal';

export default function AddOptionDialog({ isOpen, onClose, onConfirm }) {
    const [text, setText] = useState('');
    const handleConfirm = () => { if (text.trim()) { onConfirm(text.trim()); setText(''); } };
    useEffect(() => { if (isOpen) setText(''); }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Option</h3>
                <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleConfirm()} placeholder="Enter new option text" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition disabled:bg-gray-500" disabled={!text.trim()}>Add</button>
                </div>
            </div>
        </Modal>
    );
}
