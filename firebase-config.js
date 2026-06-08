// ============================================
// Firebase Configuration — firebase-config.js
// ============================================
// ใช้ร่วมกับ Firebase CDN (compat mode) ที่โหลดใน index.html
//
// วิธีตั้งค่า:
// 1. ไปที่ Firebase Console -> Project Settings
// 2. คัดลอกค่า Config มาวางแทนค่าด้านล่าง
// 3. เปิดใช้งาน Authentication, Firestore, Storage ใน Firebase Console
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBbejxg9D7SJtynVJY-V39upIOSAYTjW8Q",
    authDomain: "portfolio-tanaborde.firebaseapp.com",
    projectId: "portfolio-tanaborde",
    storageBucket: "portfolio-tanaborde.firebasestorage.app",
    messagingSenderId: "541175984616",
    appId: "1:541175984616:web:b954029a37761eae54f45d",
    measurementId: "G-V78ZSK5RY2"
};

// ตรวจสอบว่า Firebase SDK โหลดมาแล้วหรือยัง และค่า config ถูกตั้งค่าแล้วหรือยัง
const isFirebaseConfigured = (
    typeof firebase !== 'undefined' &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

if (isFirebaseConfigured) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully!");
} else {
    console.warn(
        "⚠️ Firebase ยังไม่ได้ตั้งค่า หรือ SDK ยังไม่โหลด\n" +
        "ระบบจะทำงานในโหมดทดสอบ (Local Demo Mode)"
    );
}
