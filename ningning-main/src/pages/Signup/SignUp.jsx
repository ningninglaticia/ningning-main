import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [titleName, setTitleName] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");
  const [address, setAddress] = useState({
    homeAddress: "",
    moo: "",
    soi: "",
    street: "",
    subDistrict: "",
    District: "",
    province: "",
    postCode: "",
  });
  const [advisor, setAdvisor] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!titleName) {
      setError("Please enter your title name");
      return;
    }

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!studentId) {
      setError("Please enter your student ID");
      return;
    }

    if (!faculty) {
      setError("Please enter your faculty");
      return;
    }

    if (!major) {
      setError("Please enter your major");
      return;
    }
    if (!advisor) {
      setError("Please enter your advisor");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // การเรียก API สำหรับการสมัครสมาชิก
    try {
      const response = await axiosInstance.post("/create-account", {
        titleName,
        fullName,
        studentId,
        faculty,
        major,
        address,
        advisor,
        email,
        mobile,
        password,
      });

      // จัดการกับการตอบกลับที่ลงทะเบียนสำเร็จ
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      // จัดการกับข้อผิดพลาดในการลงชื่อเข้าใช้
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      {!window.location.pathname.includes("/signup") && <Navbar />}

      <section className="relative flex flex-wrap lg:h-screen lg:items-center">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Get started today!
            </h1>

            <p className="mt-4 text-gray-500">
              Create your account and join us for a seamless experience!
            </p>
          </div>

          <form
            onSubmit={handleSignUp}
            className="mx-auto mb-0 mt-8 max-w-md space-y-4"
          >
            <div className="flex space-x-2">
              <select
                value={titleName}
                onChange={(e) => setTitleName(e.target.value)}
                className="flex-1 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
              </select>

              <input
                type="text"
                placeholder="ชื่อจริง"
                className="flex-1 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="รหัสประจําตัวนักศึกษา"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="โทรศัพท์ (ที่ติดต่อได้)"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <div>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="flex-1 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                >
                  <option value="">นักศึกษาคณะ</option>
                  <option value="ครุศาสตร์อุตสาหกรรม">
                    ครุศาสตร์อุตสาหกรรม
                  </option>
                </select>
              </div>

              <div>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="flex-1 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                >
                  <option value="">สาขาวิชา</option>
                  <option value="วิศวกรรมคอมพิวเตอร์">
                    วิศวกรรมคอมพิวเตอร์
                  </option>
                  <option value="วิศวกรรมไฟฟ้า">วิศวกรรมไฟฟ้า</option>
                  <option value="วิศวกรรมเครื่องกล">วิศวกรรมเครื่องกล</option>
                  <option value="วิศวกรรมอิเล็กทรอนิกส์และระบบอัตโนมัติ">
                    วิศวกรรมอิเล็กทรอนิกส์และระบบอัตโนมัติ
                  </option>
                  <option value="วิศวกรรมอุตสาหกรรม">วิศวกรรมอุตสาหกรรม</option>
                </select>
              </div>
            </div>
            {/* Advisor List */}
            <div className="flex space-x-2">
              <select
                value={advisor}
                onChange={(e) => setAdvisor(e.target.value)}
                className="flex-1 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              >
                <option value="">เลือกอาจารย์ที่ปรึกษา</option>
                <option value="อาจารย์ธงชาติ พิกุลทอง">
                  อาจารย์ธงชาติ พิกุลทอง
                </option>
                <option value="ผศ.กิตติ จุ้ยกำจร">ผศ.กิตติ จุ้ยกำจร</option>
                <option value="ผศ.ดร.สิริพร อั้งโสภา">
                  ผศ.ดร.สิริพร อั้งโสภา
                </option>
                <option value="ผศ.จักรี รัศมีฉาย">ผศ.จักรี รัศมีฉาย</option>
                <option value="ผศ.ดร.อัครวุฒิ ปรมะปุญญา">
                  ผศ.ดร.อัครวุฒิ ปรมะปุญญา
                </option>
                <option value="ผศ.ณัฐภณ หรรษกรคณโชค">
                  ผศ.ณัฐภณ หรรษกรคณโชค
                </option>
                <option value="ผศ.เกียรติศักดิ์ สมฤทธิ์">
                  ผศ.เกียรติศักดิ์ สมฤทธิ์
                </option>
              </select>
            </div>

            <h4 className="text-lg mt-4 mb-2">ที่อยู่</h4>
            <input
              type="text"
              placeholder="อยู่บ้านเลขที่"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.homeAddress}
              onChange={(e) =>
                setAddress({ ...address, homeAddress: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="หมู่"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.moo}
              onChange={(e) => setAddress({ ...address, moo: e.target.value })}
            />
            <input
              type="text"
              placeholder="ตรอก/ซอย"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.soi}
              onChange={(e) => setAddress({ ...address, soi: e.target.value })}
            />
            <input
              type="text"
              placeholder="ถนน"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="ตําบล/แขวง"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.subDistrict}
              onChange={(e) =>
                setAddress({ ...address, subDistrict: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="อําเภอ/เขต"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.District}
              onChange={(e) =>
                setAddress({ ...address, District: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="จังหวัด"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.province}
              onChange={(e) =>
                setAddress({ ...address, province: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="รหัสไปรษณีย์"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              value={address.postCode}
              onChange={(e) =>
                setAddress({ ...address, postCode: e.target.value })
              }
            />

            <div>
              <input
                type="text"
                placeholder="Email"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <div className="flex items-center justify-between">
              <p className="text-sm">
                มีบัญชีอยู่แล้วหรือ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline"
                >
                  Login
                </Link>
              </p>
              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                สมัครสมาชิก
              </button>
            </div>
          </form>
        </div>

        <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt=""
            src="src/assets/rmutt.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
    </>
  );
};

export default SignUp;
