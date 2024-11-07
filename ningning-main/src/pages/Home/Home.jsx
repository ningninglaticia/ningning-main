import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdClose, MdRefresh } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  const handleEdit = useCallback((noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  }, []);

  const showToastMessage = useCallback((message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  }, []);

  const handleCloseToast = useCallback(() => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "add",
    });
  }, []);

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  const getAllNotes = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data?.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error(error);
      showToastMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToastMessage]);

  const deleteNote = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delette-note/${data._id}`);
      if (response.data && !response.data.error) {
        showToastMessage("ลบเอกสารสำเร็จ", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.error(error);
      showToastMessage("เกิดข้อผิดพลาดในการลบเอกสาร", "error");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, [getUserInfo, getAllNotes]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800">เอกสารทั้งหมด</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            onClick={getAllNotes}
            disabled={isRefreshing}
          >
            <MdRefresh
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </motion.button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            {allNotes.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {allNotes.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NoteCard
                      title={item.title}
                      date={item.createdOn}
                      content={item.content}
                      tags={item.tags}
                      form={item.form}
                      isPinned={item.isPinned}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => deleteNote(item)}
                      onPinNote={() => {}}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyCard />
            )}
          </AnimatePresence>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed right-8 bottom-8 w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </motion.button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          },
          content: {
            position: "relative",
            border: "none",
            background: "none",
            padding: 0,
            width: "100%",
            maxWidth: "800px",
            margin: "auto",
            inset: "auto",
          },
        }}
        className="modal-content"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {openAddEditModal.type === "add" ? "เพิ่มบันทึก" : "แก้ไขบันทึก"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() =>
                setOpenAddEditModal({ isShown: false, type: "add", data: null })
              }
            >
              <MdClose className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[calc(80vh-120px)] overflow-y-auto custom-scrollbar">
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() =>
                setOpenAddEditModal({ isShown: false, type: "add", data: null })
              }
              getAllNotes={getAllNotes}
              showToastMessage={showToastMessage}
            />
          </div>
        </motion.div>
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
