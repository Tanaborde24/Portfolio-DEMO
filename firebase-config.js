// ============================================
// Firebase Configuration — firebase-config.js
// ============================================
//
// ======================== วิธีตั้งค่า Firebase สำหรับมือใหม่ ========================
//
// ขั้นตอนที่ 1: สร้างโปรเจกต์ Firebase
//   1. ไปที่ https://console.firebase.google.com/
//   2. คลิก "Add project" (เพิ่มโปรเจกต์)
//   3. ตั้งชื่อโปรเจกต์ เช่น "my-portfolio"
//   4. กด "Continue" จนเสร็จ
//
// ขั้นตอนที่ 2: เปิดใช้งาน Authentication
//   1. ในเมนูซ้าย คลิก "Build" > "Authentication"
//   2. คลิก "Get started"
//   3. เลือก "Email/Password" แล้วเปิดใช้งาน (Enable)
//   4. คลิก "Save"
//   5. ไปที่แท็บ "Users" แล้วคลิก "Add user"
//   6. ใส่ Email และ Password ที่คุณต้องการใช้ล็อกอิน
//      (เช่น admin@myportfolio.com / mypassword123)
//
// ขั้นตอนที่ 3: เปิดใช้งาน Firestore Database
//   1. ในเมนูซ้าย คลิก "Build" > "Firestore Database"
//   2. คลิก "Create database"
//   3. เลือก "Start in test mode" (เริ่มในโหมดทดสอบ)
//      ** หมายเหตุ: หลัง deploy จริง ควรตั้ง Security Rules ให้ปลอดภัย **
//   4. เลือก Region เช่น asia-southeast1 (สิงคโปร์)
//   5. คลิก "Enable"
//
// ขั้นตอนที่ 4: เปิดใช้งาน Firebase Storage
//   1. ในเมนูซ้าย คลิก "Build" > "Storage"
//   2. คลิก "Get started"
//   3. เลือก "Start in test mode"
//   4. เลือก Region เดียวกับ Firestore
//   5. คลิก "Done"
//
// ขั้นตอนที่ 5: สร้าง Web App และดึง Config
//   1. ไปที่หน้า "Project settings" (ไอคอนรูปเฟืองมุมบนซ้าย)
//   2. เลื่อนลงมาที่ "Your apps" แล้วคลิกไอคอน </> (Web)
//   3. ตั้งชื่อ App เช่น "my-portfolio-web"
//   4. กด "Register app"
//   5. จะได้ Config object → คัดลอกค่ามาใส่ด้านล่างนี้
//
// ขั้นตอนที่ 6 (เสริม): ตั้ง Firestore Security Rules
//   ไปที่ Firestore > Rules แล้วใส่:
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /projects/{projectId} {
//         allow read: if true;
//         allow write: if request.auth != null;
//       }
//     }
//   }
//
// ขั้นตอนที่ 7 (เสริม): ตั้ง Storage Security Rules
//   ไปที่ Storage > Rules แล้วใส่:
//
//   rules_version = '2';
//   service firebase.storage {
//     match /b/{bucket}/o {
//       match /projects/{allPaths=**} {
//         allow read: if true;
//         allow write: if request.auth != null;
//       }
//     }
//   }
//
// =====================================================================

// ★★★ แก้ไขค่าด้านล่างนี้ โดยใส่ค่าจาก Firebase Console ของคุณ ★★★
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ตรวจสอบว่าได้ตั้งค่าแล้วหรือยัง
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

if (isFirebaseConfigured) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully!");
} else {
    console.warn(
        "⚠️ Firebase ยังไม่ได้ตั้งค่า!\n" +
        "กรุณาแก้ไขไฟล์ firebase-config.js โดยใส่ค่า Config จาก Firebase Console\n" +
        "ดูวิธีตั้งค่าได้ที่ด้านบนของไฟล์นี้"
    );
}
