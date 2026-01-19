import React, { useState, useMemo } from 'react';
import { Pause, Play, Trash2, MessageCircle, ChevronDown, Search } from 'lucide-react';
import { Language, getTranslation } from '../i18n';
import clsx from 'clsx';

interface Contact {
    jid: string;
    displayNumber: string;
    isTracking: boolean;
    platform: 'whatsapp' | 'signal';
    state?: string;
}

interface ContactsListProps {
    contacts: Contact[];
    onPause: (jid: string) => void;
    onResume: (jid: string) => void;
    onRemove: (jid: string) => void;
    language: Language;
}

type SortBy = 'name' | 'platform' | 'status';
type FilterBy = 'all' | 'active' | 'paused' | 'whatsapp' | 'signal';

export function ContactsList({ contacts, onPause, onResume, onRemove, language }: ContactsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('name');
    const [filterBy, setFilterBy] = useState<FilterBy>('all');

    // Filter и Sort контакты
    const filteredAndSorted = useMemo(() => {
        let result = [...contacts];

        // Filter по поиску
        if (searchQuery.trim()) {
            result = result.filter(c =>
                c.displayNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter по статусу и платформе
        result = result.filter(c => {
            if (filterBy === 'active') return c.isTracking;
            if (filterBy === 'paused') return !c.isTracking;
            if (filterBy === 'whatsapp') return c.platform === 'whatsapp';
            if (filterBy === 'signal') return c.platform === 'signal';
            return true;
        });

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'platform':
                    return a.platform.localeCompare(b.platform);
                case 'status':
                    return (b.isTracking ? 1 : 0) - (a.isTracking ? 1 : 0);
                case 'name':
                default:
                    return a.displayNumber.localeCompare(b.displayNumber);
            }
        });

        return result;
    }, [contacts, searchQuery, sortBy, filterBy]);

    const stats = {
        total: contacts.length,
        active: contacts.filter(c => c.isTracking).length,
        paused: contacts.filter(c => !c.isTracking).length,
        whatsapp: contacts.filter(c => c.platform === 'whatsapp').length,
        signal: contacts.filter(c => c.platform === 'signal').length,
    };

    if (contacts.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                {getTranslation(language, 'noContactsTracked')}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Stats */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {getTranslation(language, 'trackContacts')}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                            <span>📊 {getTranslation(language, 'stop')}: <strong>{stats.total}</strong></span>
                            <span>🟢 {getTranslation(language, 'start')}: <strong>{stats.active}</strong></span>
                            <span>⏸️ {getTranslation(language, 'paused')}: <strong>{stats.paused}</strong></span>
                            <span>📱 WhatsApp: <strong>{stats.whatsapp}</strong></span>
                            <span>🔔 Signal: <strong>{stats.signal}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search, Filter, Sort */}
            <div className="px-6 py-4 border-b border-gray-200 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={getTranslation(language, 'enterPhoneNumber')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                {/* Filter и Sort Controls */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as FilterBy)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="all">📋 Все</option>
                        <option value="active">🟢 Активные</option>
                        <option value="paused">⏸️ На паузе</option>
                        <option value="whatsapp">💬 WhatsApp</option>
                        <option value="signal">🔔 Signal</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="name">🔤 По номеру</option>
                        <option value="platform">📱 По платформе</option>
                        <option value="status">🔄 По статусу</option>
                    </select>
                </div>

                {searchQuery && (
                    <p className="text-xs text-gray-500">
                        Найдено: <strong>{filteredAndSorted.length}</strong> из <strong>{contacts.length}</strong>
                    </p>
                )}
            </div>

            {/* Contacts List */}
            <div className="divide-y divide-gray-100">
                {filteredAndSorted.length > 0 ? (
                    filteredAndSorted.map((contact) => (
                        <div
                            key={contact.jid}
                            className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 hover:bg-blue-50 transition-colors duration-150"
                        >
                            {/* Contact Info */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={clsx(
                                    'w-2 h-2 rounded-full flex-shrink-0',
                                    contact.state === 'Online'
                                        ? 'bg-green-500'
                                        : contact.state === 'Standby'
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                )}/>

                                <span
                                    className={clsx(
                                        'px-2 py-1 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap flex-shrink-0',
                                        contact.platform === 'whatsapp'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                    )}
                                >
                                    <MessageCircle size={12} />
                                    {contact.platform === 'whatsapp' ? 'WhatsApp' : 'Signal'}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">
                                        {contact.displayNumber}
                                    </p>
                                    {contact.state && (
                                        <p
                                            className={clsx(
                                                'text-xs font-medium',
                                                contact.state === 'Online'
                                                    ? 'text-green-600'
                                                    : contact.state === 'Standby'
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            )}
                                        >
                                            {contact.state}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <span
                                className={clsx(
                                    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0',
                                    contact.isTracking
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                )}
                            >
                                {contact.isTracking ? '🟢 Активен' : '⏸️ На паузе'}
                            </span>

                            {/* Actions */}
                            <div className="flex gap-1 flex-shrink-0">
                                {contact.isTracking ? (
                                    <button
                                        onClick={() => onPause(contact.jid)}
                                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                        title={getTranslation(language, 'stop')}
                                    >
                                        <Pause size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onResume(contact.jid)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title={getTranslation(language, 'start')}
                                    >
                                        <Play size={16} />
                                    </button>
                                )}

                                <button
                                    onClick={() => onRemove(contact.jid)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title={getTranslation(language, 'remove')}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-8 text-center text-gray-500 text-sm">
                        Контакты не найдены
                    </div>
                )}
            </div>
        </div>
    );
}
