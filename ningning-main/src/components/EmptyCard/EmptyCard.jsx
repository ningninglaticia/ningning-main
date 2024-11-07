import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdCreate, MdClose, MdOpenInNew } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const documents = [
  {
    id: 1,
    title: "แบบคำร้องทั่วไป(สำหรับนักศึกษาใหม่)",
    image: "src/assets/แบบคำร้องทั่วไป.jpg",
    path: "/edit-document"
  },
  {
    id: 2,
    title: "ใบคำร้อง ลาป่วย ลากิจส่วนตัว",
    image: "src/assets/แบบคำร้องทั่วไป.jpg",
    path: "/edit-document"
  },
  {
    id: 3,
    title: "ใบคำร้องขออนุญาตสอบ",
    image: "src/assets/แบบคำร้องทั่วไป.jpg",
    path: "/edit-document"
  }
];

const EmptyCard = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/get-user");
        if (response.data?.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, [navigate]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tableVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <motion.h2
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                เอกสารทั้งหมด
              </motion.h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        ชื่อเอกสาร
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {documents.map((doc) => (
                      <motion.tr
                        key={doc.id}
                        variants={rowVariants}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:text-green-800 transition-colors rounded-full hover:bg-green-50"
                              onClick={() => navigate(doc.path)}
                            >
                              <MdCreate className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                              onClick={() => setSelectedImage(doc.image)}
                            >
                              ดูเอกสาร
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <>
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedImage(null)}
            />

            <motion.div
              key="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-4xl mx-auto px-4 my-8">
                <motion.div
                  className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
                  layoutId={`image-${selectedImage}`}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ตัวอย่างเอกสาร
                    </h3>
                    <motion.button
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage(null)}
                    >
                      <MdClose className="w-6 h-6 text-gray-600" />
                    </motion.button>
                  </div>

                  {/* Image container */}
                  <div className="p-6">
                    <motion.img
                      src={selectedImage}
                      alt="Document Preview"
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                      layoutId={`image-content-${selectedImage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      onClick={() => window.open(selectedImage, '_blank')}
                    >
                      <MdOpenInNew className="w-5 h-5" />
                      <span>เปิดในแท็บใหม่</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                      onClick={() => setSelectedImage(null)}
                    >
                      ปิด
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmptyCard;
