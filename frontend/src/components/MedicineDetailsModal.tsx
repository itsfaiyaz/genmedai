
import { X, Pill, Building2, FileText, Info, Beaker, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Medicine } from '../types/Medicine';

interface MedicineDetailsModalProps {
    medicine: Medicine;
    onClose: () => void;
}

const MedicineDetailsModal = ({ medicine, onClose }: MedicineDetailsModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 flex flex-col"
            >
                {/* Header with Image or Gradient */}
                <div className="relative h-48 bg-gradient-to-r from-brand-teal/10 to-blue-500/10 flex items-center justify-center shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>

                    {medicine.image ? (
                        <img
                            src={medicine.image}
                            alt={medicine.brand_name}
                            className="h-full w-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-brand-teal/50">
                            <Pill className="w-20 h-20" />
                        </div>
                    )}

                    <div className="absolute bottom-4 left-6 flex gap-2">
                        {medicine.is_discontinued === 1 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                                Discontinued
                            </span>
                        )}
                        {medicine.is_generic === 1 && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                                Generic
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{medicine.brand_name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{medicine.manufacturer_name}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Beaker className="w-4 h-4" /> Composition
                                </h3>
                                <p className="font-medium text-gray-900 dark:text-white">{medicine.salt_composition}</p>
                                {medicine.short_composition1 && (
                                    <p className="text-sm text-gray-500 mt-1">{medicine.short_composition1}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Product Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Form</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{medicine.dosage_form || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Pack Size</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{medicine.pack_size_label || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{medicine.type || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-brand-teal/5 dark:bg-brand-teal/10 p-4 rounded-xl border border-brand-teal/20">
                                <h3 className="text-sm font-semibold text-brand-teal uppercase tracking-wider mb-2">Price</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{medicine.price}</span>
                                    <span className="text-gray-500 text-sm">MRP</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Inclusive of all taxes</p>
                            </div>

                            {medicine.affiliate_link && (
                                <a
                                    href={medicine.affiliate_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-gradient-to-r from-brand-teal to-blue-600 hover:from-brand-teal/90 hover:to-blue-600/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-teal/20 transform transition-all hover:-translate-y-0.5"
                                >
                                    Buy on Partner Site ↗
                                </a>
                            )}

                            {medicine.description && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Description
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {medicine.description}
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Metadata
                                </h3>
                                <div className="space-y-1 text-xs text-gray-500">
                                    <p>ID: {medicine.idx}</p>
                                    <p>Source ID: {medicine.source_id}</p>
                                    <p>Last Sync: {medicine.creation?.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MedicineDetailsModal;
