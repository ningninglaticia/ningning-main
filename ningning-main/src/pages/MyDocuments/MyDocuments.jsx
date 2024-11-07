import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MdCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MyDocuments = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Animations for table
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Animations for modal
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Fetch user info and documents
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get("/get-user-documents");
        if (response.data && response.data.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
    fetchDocuments();
  }, [navigate]);

  const handleViewClick = (imagePath) => {
    setSelectedImage(imagePath);
    setShowImage(true);
  };

  const closeImage = () => {
    setShowImage(false);
    setSelectedImage(null);
  };

  const handleEditClick = (documentId) => {
    navigate(`/edit-document/${documentId}`);
  };

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="min-h-screen py-20">
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
                  เอกสารทั้งหมดของฉัน
                </motion.h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
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
                          key={doc._id}
                          variants={rowVariants}
                          whileHover={{
                            backgroundColor: "rgba(59, 130, 246, 0.05)",
                          }}
                          className="transition-colors"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800 text-center">
                            {"แบบคำร้องทั่วไป(สำหรับนักศึกษาใหม่)" ||
                              "ไม่มีชื่อเอกสาร"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <div className="flex justify-center items-center gap-3">

                              {/* Status => 'Pending' for now*/}
                              <span className="text-green-600 text-sm font-semibold">
                                {doc.status || "รอดำเนินการ"}
                              </span>

                              {/* Document Preview */}
                              <button
                                onClick={() => handleViewClick(doc.imagePath)}
                                className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                              >
                                ดูเอกสาร
                              </button>

                              {/* Edit Document */}
                              <button
                                onClick={() => handleEditClick(doc._id)}
                                className="inline-block rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
                              >
                                แก้ไข
                              </button>
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

        <AnimatePresence mode="wait">
          {showImage && (
            <>
              <motion.div
                key="overlay"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={closeImage}
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
                  <div className="relative bg-white p-4 rounded shadow-lg max-w-2xl">
                    <button
                      onClick={closeImage}
                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900 text-xl"
                    >
                      ✕
                    </button>
                    <img
                      src={selectedImage}
                      alt="Document Preview"
                      className="w-full h-auto max-h-[90vh] object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyDocuments;
