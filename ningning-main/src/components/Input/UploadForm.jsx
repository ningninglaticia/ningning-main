/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiSend, FiFileText, FiUser, FiInfo, FiDownload } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../Navbar/Navbar";
import { jsPDF } from "jspdf";
import 'react-tooltip/dist/react-tooltip.css';

const UploadForm = () => {
  const [reasons, setReasons] = useState("");
  const [woldLike, setwoldLike] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    fetchUserInfo();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!woldLike || !reasons) {
      setUploadStatus("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/add-document", {
        woldLike,
        reasons,
      });

      if (response.data && response.data.error) {
        setUploadStatus(response.data.message);
      } else {
        setUploadStatus("บันทึกข้อมูลสำเร็จ!");
        setwoldLike("");
        setReasons("");
        setTimeout(() => navigate("/my-documents"), 1500);
      }
    } catch (error) {
      setUploadStatus(
        error.response?.data?.message ||
        "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!woldLike || !reasons) {
      setUploadStatus("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setIsLoading(true);
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      doc.addFont(
        'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf',
        'Noto Sans Thai',
        'normal'
      );
      doc.setFont('Noto Sans Thai');

      let yPos = 20;
      const xPos = 20;
      const lineHeight = 10;

      const addText = (text, maxWidth = 170) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, xPos, yPos);
        yPos += lines.length * lineHeight;
      };

      doc.setFontSize(16);
      addText("แบบฟอร์มข้อมูลผู้ใช้");
      yPos += lineHeight;

      if (userInfo) {
        doc.setFontSize(12);

        const fields = [
          { label: "คำนำหน้า", value: userInfo.titleName },
          { label: "ชื่อ", value: userInfo.fullName },
          { label: "รหัสประจำตัว", value: userInfo.studentId },
          { label: "คณะ", value: userInfo.faculty },
          { label: "สาขา", value: userInfo.major },
          { label: "บ้านเลขที่", value: userInfo.address?.homeAddress },
          { label: "หมู่", value: userInfo.address?.moo },
          { label: "ซอย", value: userInfo.address?.soi },
          { label: "ถนน", value: userInfo.address?.street },
          { label: "ตำบล", value: userInfo.address?.subDistrict },
          { label: "อำเภอ", value: userInfo.address?.District },
          { label: "จังหวัด", value: userInfo.address?.province },
          { label: "รหัสไปรษณีย์", value: userInfo.address?.postCode },
          { label: "โทรศัพท์", value: userInfo.mobile }
        ];

        fields.forEach(({ label, value }) => {
          addText(`${label}: ${value || "N/A"}`);
        });

        yPos += lineHeight;
        addText("ข้อมูลการกรอกฟอร์ม:");
        addText(`มีความประสงค์: ${woldLike}`);
        addText(`เนื่องจาก: ${reasons}`);
      }

      const pdfDataUrl = doc.output("dataurlstring");
      setPdfUrl(pdfDataUrl);

      const response = await axiosInstance.post("/add-document", {
        pdfData: pdfDataUrl,
        woldLike,
        reasons,
        userId: userInfo?.id
      });

      if (response.data && response.data.message) {
        setUploadStatus("บันทึก PDF สำเร็จ!");
        setwoldLike("");
        setReasons("");
      }
    } catch (error) {
      console.error('Error details:', error);
      setUploadStatus(
        "ไม่สามารถบันทึก PDF ได้: " +
        (error.response?.data?.message || error.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto px-4 pt-[64px] ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Preview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="lg:flex-1 sticky top-24 h-fit"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <div className="relative group cursor-pointer">
                  <img
                    src="src/assets/แบบคำร้องทั่วไป.jpg"
                    alt="แบบฟอร์มทั่วไป"
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-[600px]"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 my-8">
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    แบบฟอร์มข้อมูลผู้ใช้
                  </h2>
                </div>

                {userInfo ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <FiUser className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-700">ข้อมูลส่วนตัว</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <InfoField label="คำนำหน้า" value={userInfo.titleName} />
                      <InfoField label="ชื่อ" value={userInfo.fullName} />
                      <InfoField label="รหัสประจำตัว" value={userInfo.studentId} />
                      <InfoField label="คณะ" value={userInfo.faculty} />
                      <InfoField label="สาขา" value={userInfo.major} />
                      <InfoField label="บ้านเลขที่" value={userInfo.address?.homeAddress} />
                      <InfoField label="หมู่" value={userInfo.address?.moo} />
                      <InfoField label="ซอย" value={userInfo.address?.soi} />
                      <InfoField label="ถนน" value={userInfo.address?.street} />
                      <InfoField label="ตำบล" value={userInfo.address?.subDistrict} />
                      <InfoField label="อำเภอ" value={userInfo.address?.District} />
                      <InfoField label="จังหวัด" value={userInfo.address?.province} />
                      <InfoField label="รหัสไปรษณีย์" value={userInfo.address?.postCode} />
                      <InfoField label="โทรศัพท์" value={userInfo.mobile} />
                    </div>

                    <div className="space-y-6">
                      {/* Purpose Field */}
                      <FormField
                        label="มีความประสงค์"
                        value={woldLike}
                        onChange={(e) => setwoldLike(e.target.value)}
                        placeholder="กรุณาระบุความประสงค์..."
                        tooltip="กรุณาระบุความประสงค์ของคุณให้ชัดเจน"
                      />

                      {/* Reason Field */}
                      <FormField
                        label="เนื่องจาก"
                        value={reasons}
                        onChange={(e) => setReasons(e.target.value)}
                        placeholder="กรุณาระบุเหตุผล..."
                        tooltip="กรุณาระบุเหตุผลประกอบคำร้อง"
                      />

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <ActionButton
                          icon={<FiSend />}
                          onClick={handleSubmit}
                          isLoading={isLoading}
                          loadingText="กำลังส่งข้อมูล..."
                          text="ส่งแบบฟอร์ม"
                          primary
                        />
                        <ActionButton
                          icon={<FiDownload />}
                          onClick={generatePDF}
                          isLoading={isLoading}
                          loadingText="กำลังสร้าง PDF..."
                          text="ดูแบบฟอร์ม PDF"
                        />
                      </div>

                      {/* Status Message */}
                      <AnimatePresence>
                        {uploadStatus && (
                          <StatusMessage message={uploadStatus} />
                        )}
                      </AnimatePresence>

                      {/* PDF Preview */}
                      <AnimatePresence>
                        {pdfUrl && (
                          <PDFPreview url={pdfUrl} />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Tooltip id="form-tooltip" />
    </div>
  );
};

// Utility Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-12">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
  </div>
);

const InfoField = ({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
  >
    <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
    <span className="text-gray-900 font-medium">{value || "N/A"}</span>
  </motion.div>
);

const FormField = ({ label, value, onChange, placeholder, tooltip }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="relative">
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
      <span>{label}</span>
      <FiInfo
        className="w-4 h-4 text-gray-400 cursor-help"
        data-tooltip-id="form-tooltip"
        data-tooltip-content={tooltip}
      />
    </label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px] resize-none shadow-sm"
      placeholder={placeholder}
    />
  </motion.div>
);

const ActionButton = ({ icon, onClick, isLoading, text, primary }) => (
  <motion.button
    whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={isLoading}
    className={`flex-1 ${
      primary
        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
    } text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 flex items-center justify-center space-x-2`}
  >
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <>
        {icon}
        <span>{text}</span>
      </>
    )}
  </motion.button>
);

const StatusMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`p-4 rounded-xl ${
      message.includes("สำเร็จ")
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-red-50 text-red-700 border border-red-200"
    }`}
  >
    {message}
  </motion.div>
);

const PDFPreview = ({ url }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="mt-6"
  >
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent text-white p-4">
        <h4 className="text-sm font-medium">ตัวอย่างเอกสาร PDF</h4>
      </div>
      <iframe
        src={url}
        title="PDF Preview"
        className="w-full h-[600px]"
      />
    </div>
  </motion.div>
);

export default UploadForm;
