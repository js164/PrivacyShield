export default function Modal({ isOpen, onClose, children, size = 'md' }) {
    if (!isOpen) return null;
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity p-4" onClick={onClose}>
            <div className={`bg-white rounded-xl w-full ${sizeClasses[size]} shadow-xl border border-gray-200 transform transition-all flex flex-col max-h-[90vh]`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
