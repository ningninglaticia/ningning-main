/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdSend, MdAttachFile, MdTag } from 'react-icons/md';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import UploadForm from '../../components/Input/UploadForm';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const [formData, setFormData] = useState({
        title: noteData?.title || "",
        content: noteData?.content || "",
        tags: noteData?.tags || [],
        document: noteData?.document || ""
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null); // Clear error when user types
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("กรุณากรอกอีเมลผู้รับ");
            return false;
        }
        if (!formData.content.trim()) {
            setError("กรุณากรอกรายละเอียด");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const endpoint = type === 'edit'
                ? `/edit-note/${noteData._id}`
                : "/add-note";

            const method = type === 'edit' ? 'put' : 'post';

            const response = await axiosInstance[method](endpoint, formData);

            if (response.data?.note) {
                showToastMessage(
                    type === 'edit'
                        ? "อัพเดทเอกสารสำเร็จ"
                        : "อัพโหลดเอกสารสำเร็จ"
                );
                getAllNotes();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='relative space-y-6'
        >
            {/* Close Button */}
            <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
                className='absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md transition-colors'
                onClick={onClose}
            >
                <MdClose className='text-xl text-gray-500' />
            </motion.button>

            {/* Form Content */}
            <div className='space-y-6'>
                {/* Email Input */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 block'>ถึง</label>
                    <input
                        type="email"
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        placeholder='กรุณากรอกอีเมลผู้รับ'
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                {/* Content Textarea */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 block'>รายละเอียด</label>
                    <textarea
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[200px] resize-none'
                        placeholder='กรุณากรอกรายละเอียด'
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                    />
                </div>

                {/* Tags and Document Section */}
                <div className='flex flex-col gap-4'>
                    {/* Tags Section */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <MdTag className='text-blue-500' />
                            แท็ก
                        </label>
                        <TagInput
                            tags={formData.tags}
                            setTags={(tags) => handleChange('tags', tags)}
                        />
                    </div>

                    {/* Document Upload Section */}
                    <div className=''>
                        <label className='text-sm font-medium text-gray-700 flex items-center'>
                            <MdAttachFile className='text-blue-500' />
                            เอกสารแนบ
                        </label>
                        <UploadForm
                            document={formData.document}
                            setDocument={(doc) => handleChange('document', doc)}
                        />
                    </div>
                </div>

                {/* Error Message */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2'
                        >
                            <span className='block w-1 h-1 rounded-full bg-red-500'></span>
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className='w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={handleSubmit}
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <MdSend className='text-lg' />
                            {type === 'edit' ? 'อัพเดทเอกสาร' : 'ส่งเอกสาร'}
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AddEditNotes;
