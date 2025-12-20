
import { useState, useEffect, useCallback } from 'react';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Pill, ArrowUpDown, X, ChevronDown, Loader2, ImageIcon } from 'lucide-react';

import type { Medicine } from '../types/Medicine';
import MedicineDetailsModal from '../components/MedicineDetailsModal';
import MedicineCardSkeleton from '../components/MedicineCardSkeleton';

const Medicines = () => {
    // 1. States for Data & UI
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
    const [selectedDosageForm, setSelectedDosageForm] = useState<string>('');
    const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high' | 'newest'>('newest');
    const [showOnlyWithImage, setShowOnlyWithImage] = useState(false);

    // UI Toggles
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

    // 2. Fetch Helper for API
    const { call: fetchMedicinesAPI, loading: isFetching } = useFrappePostCall<{ message: Medicine[] }>('genmedai.api.browse_medicines');

    // 3. Debounce Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 4. Fetch Filters (Manufacturers & Dosages)
    // We fetch this once independently.
    const { data: filterOptions } = useFrappeGetCall<{ message: { manufacturers: string[], dosage_forms: string[] } }>('genmedai.api.get_catalog_filters');

    const manufacturers = filterOptions?.message?.manufacturers || [];
    const dosageForms = filterOptions?.message?.dosage_forms || [];

    // 5. Main Fetch Logic
    const loadMedicines = useCallback(async (reset = false) => {
        setIsLoading(true);
        const currentPage = reset ? 0 : page;
        const limit = 30; // 30 items per page

        try {
            const response = await fetchMedicinesAPI({
                start: currentPage * limit,
                limit: limit,
                search_text: debouncedSearch,
                manufacturer: selectedManufacturer,
                dosage_form: selectedDosageForm,
                has_image: showOnlyWithImage,
                order_by: getOrderByString(sortBy)
            });

            if (response && response.message) {
                const newMedicines = response.message;

                if (reset) {
                    setMedicines(newMedicines);
                } else {
                    setMedicines(prev => [...prev, ...newMedicines]);
                }

                // Determine if we have more to load
                if (newMedicines.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (e) {
            console.error("Failed to fetch medicines", e);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedManufacturer, selectedDosageForm, showOnlyWithImage, sortBy, page, fetchMedicinesAPI]);

    // Helper to map sort state to backend field
    const getOrderByString = (sortState: string) => {
        switch (sortState) {
            case 'last_updated': return 'modified desc';
            case 'id': return 'name desc';
            case 'created': return 'creation desc';
            case 'name': return 'brand_name asc';
            case 'salt_composition': return 'salt_composition asc';
            case 'strength': return 'strength asc';
            case 'price_low': return 'price asc';
            case 'price_high': return 'price desc';
            default: return 'modified desc'; // Default to last updated
        }
    };

    // 6. Trigger Fetch on Search/Filter Changes
    useEffect(() => {
        // Reset page and fetch whenever filters change
        setPage(0);
        setHasMore(true);
        loadMedicines(true);
    }, [debouncedSearch, selectedManufacturer, selectedDosageForm, showOnlyWithImage, sortBy]);

    // Handle Load More
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        // We use a separate effect or call it directly?
        // state update is async, so calling loadMedicines() here uses old page.
        // Better to wait for page to update? 
        // Actually, easier to just pass the new page explicitly to loadMedicines if I refactored it to accept page.
        // But loadMedicines uses `page` from state.
        // Let's rely on rule: only call loadMedicines when we are sure, or pass arg.

        // Alternative: separate effect for page change? No that triggers on reset too.
        // I'll call API directly here for append logic context.

        setIsLoading(true);
        try {
            const response = await fetchMedicinesAPI({
                start: nextPage * 30,
                limit: 30,
                search_text: debouncedSearch,
                manufacturer: selectedManufacturer,
                dosage_form: selectedDosageForm,
                has_image: showOnlyWithImage,
                order_by: getOrderByString(sortBy)
            });
            if (response && response.message) {
                const newMedicines = response.message;
                setMedicines(prev => [...prev, ...newMedicines]);
                if (newMedicines.length < 30) setHasMore(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSelectedManufacturer('');
        setSelectedDosageForm('');
        setSearchQuery('');
        setShowOnlyWithImage(false);
    };

    const hasActiveFilters = searchQuery || selectedManufacturer || selectedDosageForm || showOnlyWithImage;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            {/* Hero / Header Section */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30 pb-6 pt-6 px-4 shadow-sm/50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Title & Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
                                Browse Medicines
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {medicines.length > 0 ? `${medicines.length}+ products loaded` : 'Loading catalog...'}
                            </p>
                        </div>

                        {/* Big Search Bar */}
                        <div className="relative flex-grow md:max-w-xl group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                {isFetching && searchQuery !== debouncedSearch ? (
                                    <Loader2 className="h-5 w-5 text-brand-teal animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                                )}
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search generic, brand, or subs..."
                                className="block w-full pl-12 pr-12 py-3.5 bg-gray-100 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 border-2 focus:border-brand-teal/50 rounded-2xl text-lg transition-all shadow-sm focus:shadow-lg focus:shadow-brand-teal/10 outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Controls (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 cursor-pointer text-sm font-semibold shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                                >
                                    <option value="last_updated">Last Updated On</option>
                                    <option value="id">ID</option>
                                    <option value="created">Created On</option>
                                    <option value="name">Name</option>
                                    <option value="salt_composition">Salt Composition</option>
                                    <option value="strength">Strength</option>
                                    <option value="price_low">Price (High to Low)</option>
                                    <option value="price_high">Price (Low to High)</option>
                                </select>
                                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-teal' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-teal' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            className="md:hidden p-3 bg-gray-100 dark:bg-gray-800 rounded-xl"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* Mobile Controls (Sort) */}
                    <div className="md:hidden flex gap-2">
                        <div className="relative w-full">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 cursor-pointer text-sm font-medium"
                            >
                                <option value="last_updated">Last Updated On</option>
                                <option value="id">ID</option>
                                <option value="created">Created On</option>
                                <option value="name">Name</option>
                                <option value="salt_composition">Salt Composition</option>
                                <option value="strength">Strength</option>
                                <option value="price_low">Price (High to Low)</option>
                                <option value="price_high">Price (Low to High)</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
                {/* Modern Sidebar Filters (Desktop) */}
                <div className={`
                    fixed md:sticky md:top-48 inset-0 z-40 bg-white md:bg-transparent dark:bg-gray-900 md:dark:bg-transparent
                    transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-out
                    w-full md:w-72 h-full md:h-[calc(100vh-140px)] overflow-y-auto md:overflow-hidden p-6 md:p-0
                    border-r md:border-r-0 border-gray-100 dark:border-gray-800 md:dark:border-none shadow-2xl md:shadow-none
                `}>
                    <div className="flex justify-between md:hidden mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X /></button>
                    </div>

                    <div className="md:pr-4 space-y-8 h-full md:overflow-y-auto custom-scrollbar pb-20">
                        {/* Active Filters Summary */}
                        {hasActiveFilters && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Filters</span>
                                    <button onClick={handleResetFilters} className="text-xs text-brand-teal hover:underline font-semibold">
                                        Reset All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {showOnlyWithImage && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium border border-purple-200 dark:border-purple-800">
                                            With Image <X className="w-3 h-3 cursor-pointer" onClick={() => setShowOnlyWithImage(false)} />
                                        </span>
                                    )}
                                    {selectedManufacturer && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-medium border border-brand-teal/20">
                                            {selectedManufacturer} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedManufacturer('')} />
                                        </span>
                                    )}
                                    {selectedDosageForm && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800">
                                            {selectedDosageForm} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDosageForm('')} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Image Filter Toggle */}
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center justify-between cursor-pointer group select-none">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${showOnlyWithImage ? 'bg-brand-teal/10 text-brand-teal' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-teal transition-colors">Has Image</span>
                                        <span className="block text-[10px] text-gray-500 dark:text-gray-400">Show only verified images</span>
                                    </div>
                                </div>
                                <div className={`w-11 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 duration-300 ease-in-out ${showOnlyWithImage ? 'bg-brand-teal' : ''}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${showOnlyWithImage ? 'translate-x-5' : ''}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showOnlyWithImage}
                                    onChange={() => setShowOnlyWithImage(!showOnlyWithImage)}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                        {/* Dosage Form Filter */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Pill className="w-4 h-4 text-brand-teal" /> Dosage Form
                            </h3>
                            <div className="space-y-2.5">
                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedDosageForm === '' ? 'border-brand-teal bg-brand-teal' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-teal'}`}>
                                        {selectedDosageForm === '' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className={`text-sm ${selectedDosageForm === '' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                        All Forms
                                    </span>
                                </label>
                                {dosageForms.map((d) => (
                                    <label key={d} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedDosageForm === d ? 'border-brand-teal bg-brand-teal' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-teal'}`}>
                                            {selectedDosageForm === d && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className={`text-sm ${selectedDosageForm === d ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {d}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                        {/* Manufacturer Filter */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-bold">M</div>
                                Manufacturer
                            </h3>
                            <div className="space-y-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedManufacturer === '' ? 'border-brand-teal bg-brand-teal' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-teal'}`}>
                                        {selectedManufacturer === '' && <span className="text-white text-[10px] font-bold">✓</span>}
                                    </div>
                                    <span className={`text-sm ${selectedManufacturer === '' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                        All Manufacturers
                                    </span>
                                </label>
                                {manufacturers.map((m) => (
                                    <label key={m} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedManufacturer === m ? 'border-brand-teal bg-brand-teal' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-teal'}`}>
                                            {selectedManufacturer === m && <span className="text-white text-[10px] font-bold">✓</span>}
                                        </div>
                                        <span className={`text-sm ${selectedManufacturer === m ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {m}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1 w-full min-w-0">
                    {/* Items Grid */}
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }>
                        <AnimatePresence mode="popLayout">
                            {medicines.map((medicine, i) => (
                                <motion.div
                                    key={`${medicine.name}-${i}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                                    onClick={() => setSelectedMedicine(medicine)}
                                    className={`
                                        bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden 
                                        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] 
                                        hover:border-brand-teal/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer
                                        ${viewMode === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col'}
                                    `}
                                >
                                    {/* Image / Icon */}
                                    <div className={`
                                        relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden
                                        ${viewMode === 'list' ? 'w-24 h-24 rounded-xl shrink-0' : 'h-48 w-full'}
                                    `}>
                                        {medicine.image ? (
                                            <img
                                                src={medicine.image.startsWith('http') ? medicine.image : `${window.location.origin}${medicine.image}`}
                                                alt={medicine.brand_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement?.classList.add('fallback-active');
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback Placeholder (shown if no image OR onError triggered) */}
                                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${medicine.image ? 'hidden fallback:flex' : 'flex'}`}>
                                            <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(13,148,136,0.1),transparent_70%)]" />
                                                <Pill className="w-16 h-16 text-gray-200 dark:text-gray-700 relative z-10" />
                                            </div>
                                        </div>

                                        {viewMode === 'grid' && (
                                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                                {medicine.is_discontinued === 1 && (
                                                    <span className="bg-red-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                                                        Discontinued
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5' : 'py-1 pr-4'}`}>
                                        <div className="mb-1 flex justify-between items-start gap-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-brand-teal transition-colors">
                                                    {medicine.brand_name}
                                                </h3>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                                    {medicine.manufacturer_name}
                                                </p>
                                            </div>
                                            {viewMode === 'list' && medicine.is_discontinued === 1 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                                                    Discontinued
                                                </span>
                                            )}
                                        </div>

                                        <div className="my-4 space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-2.5 py-1.5 rounded-lg w-fit border border-gray-100 dark:border-gray-700/50">
                                                <span className="font-semibold text-gray-400">Salt</span>
                                                <span className="truncate max-w-[180px] font-medium text-gray-700 dark:text-gray-300">{medicine.salt_composition}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500 font-medium">{medicine.dosage_form}</span>
                                                {medicine.pack_size_label && <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500">{medicine.pack_size_label}</span>}
                                            </div>
                                        </div>

                                        <div className={`mt-auto flex items-end justify-between gap-4 border-t border-dashed border-gray-100 dark:border-gray-800 pt-4 ${viewMode === 'list' ? 'md:ml-auto w-full md:w-auto md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0' : ''}`}>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">MRP</p>
                                                <p className="text-xl font-bold text-brand-teal tracking-tight">₹{medicine.price}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMedicine(medicine);
                                                }}
                                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg shadow-gray-200 dark:shadow-none hover:shadow-xl transform active:scale-95"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Sketches for Loading State */}
                        {isLoading && (
                            Array.from({ length: 6 }).map((_, i) => (
                                <MedicineCardSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
                            ))
                        )}
                    </div>

                    {/* Modern Empty State */}
                    {!isLoading && medicines.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50/50 dark:ring-gray-800/50">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No medicines found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                                We couldn't find any medicines matching your search. Try adjusting your filters or search term.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-2.5 bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white rounded-xl font-semibold transition-all"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Load More Button */}
                    {!isLoading && hasMore && medicines.length > 0 && (
                        <div className="mt-16 flex justify-center pb-20">
                            <button
                                onClick={handleLoadMore}
                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-brand-teal/30 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-lg transition-all flex items-center gap-3 group"
                            >
                                <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-brand-teal/20 group-hover:text-brand-teal transition-colors">
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                                Load More Medicines
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedMedicine && (
                    <MedicineDetailsModal
                        medicine={selectedMedicine}
                        onClose={() => setSelectedMedicine(null)}
                    />
                )}
            </AnimatePresence>
        </div >
    );
};

export default Medicines;
