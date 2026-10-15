import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { ReportData } from '../types/report';

export interface SavedReportMeta {
  id: string;
  ownerId: string;
  title: string;
  projectTitle: string;
  companyName: string;
  overallProgress: number;
  reportDate: string;
  createdAt: string;
  updatedAt: string;
}

export async function syncUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export const getDirectImageLink = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();

  // Match Google Drive file URLs (file/d/ID/view... or open?id=ID or open?id=ID)
  const driveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }

  // Also support share link patterns like drive.google.com/file/d/ID
  return trimmed;
};

export async function testCloudinaryConnection(
  cloudName: string,
  uploadPreset: string
): Promise<{ success: boolean; message: string }> {
  const cleanCloud = cloudName?.trim();
  const cleanPreset = uploadPreset?.trim();

  if (!cleanCloud || !cleanPreset) {
    return {
      success: false,
      message: 'يرجى إدخال اسم السحابة (Cloud Name) و الـ (Upload Preset) معاً لتجربة الاتصال.'
    };
  }

  const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const url = `https://api.cloudinary.com/v1_1/${cleanCloud}/image/upload`;
  const formData = new FormData();
  formData.append('file', testPixel);
  formData.append('upload_preset', cleanPreset);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const rawMsg = errData?.error?.message || res.statusText || 'فشل الاتصال';
      if (rawMsg.includes('Upload preset not found')) {
        return {
          success: false,
          message: `اسم الـ Upload Preset غير موجود في هذا الحساب. يرجى التأكد من كتابة الاسم بدقة وتفعيله كـ Unsigned.`
        };
      }
      if (rawMsg.includes('Unknown API key') || rawMsg.includes('unsigned')) {
        return {
          success: false,
          message: `يجب تفعيل خيار (Unsigned) في إعدادات Upload Preset في لوحة تحكم Cloudinary ليسمح بالرفع المباشر.`
        };
      }
      return { success: false, message: `تعذر الاتصال بالسحابة: ${rawMsg}` };
    }

    return {
      success: true,
      message: 'الاتصال بسحابة Cloudinary سليم 100%! السحابة جاهزة لرفع كافة الصور بجودة فائقة وتخزين دائم.'
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { success: false, message: 'انتهت مهلة فحص الاتصال (10 ثوانٍ). يرجى مراجعة سرعة الإنترنت.' };
    }
    return { success: false, message: `تعذر الوصول لـ Cloudinary: ${err?.message || err}` };
  }
}

export async function uploadToCloudinary(
  fileOrBase64: File | string,
  cloudName?: string,
  uploadPreset?: string
): Promise<string> {
  const activeCloud = cloudName?.trim();
  const activePreset = uploadPreset?.trim();

  if (!activeCloud || !activePreset) {
    throw new Error('يرجى تحديد اسم السحابة (Cloud Name) و الـ (Upload Preset) في إعدادات Cloudinary أو نافذة الرفع.');
  }

  const url = `https://api.cloudinary.com/v1_1/${activeCloud}/image/upload`;
  const formData = new FormData();
  formData.append('file', fileOrBase64);
  formData.append('upload_preset', activePreset);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || 'فشل الرفع السحابي';
      throw new Error(msg);
    }

    const data = await res.json();
    return data.secure_url;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('انتهت مهلة الرفع السحابي (20 ثانية). يرجى التأكد من سرعة اتصال الإنترنت وحجم الصورة.');
    }
    throw err;
  }
}

export async function saveReportToFirestore(
  reportId: string,
  reportData: ReportData
) {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('يجب تسجيل الدخول باستخدام حساب Google لحفظ التقرير في السحابة.');
  }

  const reportPath = `reports/${reportId}`;
  try {
    const reportRef = doc(db, 'reports', reportId);
    const serializedData = JSON.stringify(reportData);
    const sizeInBytes = serializedData.length;

    if (sizeInBytes > 1000000) {
      throw new Error(`حجم التقرير (${(sizeInBytes / 1024).toFixed(1)} KB) تجاوز الحد الأقصى المسموح به للمزامنة السحابية (1 ميجابايت) بسبب الصور المرفوعة محلياً. يرجى مسح بعض الصور المحلية واستخدام روابط "Google Drive" لتوثيق غير محدود للصور.`);
    }

    await setDoc(reportRef, {
      id: reportId,
      ownerId: currentUid,
      title: reportData.slides[0]?.title || reportData.projectInfo.projectTitle,
      projectTitle: reportData.projectInfo.projectTitle,
      companyName: reportData.projectInfo.companyName,
      overallProgress: reportData.projectInfo.overallProgress,
      reportDate: reportData.projectInfo.reportDate,
      reportData: serializedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return reportId;
  } catch (error: any) {
    if (error?.message && error.message.includes('Google Drive')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, reportPath);
  }
}

export function subscribeToUserReports(
  userId: string,
  onReports: (reports: SavedReportMeta[]) => void
) {
  const reportsColPath = 'reports';
  try {
    const q = query(collection(db, reportsColPath), where('ownerId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SavedReportMeta[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: d.id,
            ownerId: d.ownerId,
            title: d.title || 'تقرير بدون عنوان',
            projectTitle: d.projectTitle || '',
            companyName: d.companyName || '',
            overallProgress: d.overallProgress || 0,
            reportDate: d.reportDate || '',
            createdAt: d.createdAt || '',
            updatedAt: d.updatedAt || ''
          });
        });
        onReports(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, reportsColPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, reportsColPath);
    return () => {};
  }
}

export async function loadReportFromFirestore(reportId: string): Promise<ReportData | null> {
  const reportPath = `reports/${reportId}`;
  try {
    const snap = await getDoc(doc(db, 'reports', reportId));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.reportData) {
      return JSON.parse(data.reportData) as ReportData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, reportPath);
    return null;
  }
}

export async function deleteReportFromFirestore(reportId: string) {
  const reportPath = `reports/${reportId}`;
  try {
    await deleteDoc(doc(db, 'reports', reportId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, reportPath);
  }
}

export async function savePublicBranding(logoUrl: string): Promise<boolean> {
  const configPath = 'public_config/branding';
  try {
    const configRef = doc(db, 'public_config', 'branding');
    await setDoc(configRef, {
      id: 'branding',
      consultantLogoUrl: logoUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save public branding to Firestore (will use local persistence):', error);
    return false;
  }
}

export function subscribePublicBranding(callback: (logoUrl: string | null) => void) {
  try {
    const configRef = doc(db, 'public_config', 'branding');
    return onSnapshot(
      configRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const d = snapshot.data();
          if (d && typeof d.consultantLogoUrl === 'string') {
            callback(d.consultantLogoUrl);
            return;
          }
        }
        callback(null);
      },
      (error) => {
        console.warn('subscribePublicBranding notice:', error);
      }
    );
  } catch (e) {
    return () => {};
  }
}

export async function getPublicBranding(): Promise<string | null> {
  try {
    const configRef = doc(db, 'public_config', 'branding');
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      const d = snap.data();
      if (d && typeof d.consultantLogoUrl === 'string') {
        return d.consultantLogoUrl;
      }
    }
  } catch (e) {
    console.warn('getPublicBranding notice:', e);
  }
  return null;
}

export async function saveSharedMasterReport(reportData: ReportData): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Persist slide photos to separate photos document so document size limit (1MB) is never breached
    const slideImagesMap: Record<string, any[]> = {};
    let hasCustomImages = false;
    reportData.slides.forEach((s) => {
      if (s.images && s.images.length > 0) {
        slideImagesMap[s.id] = s.images;
        hasCustomImages = true;
      }
    });

    if (hasCustomImages) {
      try {
        const photosRef = doc(db, 'shared_reports', 'photos');
        await setDoc(photosRef, {
          id: 'photos',
          updatedAt: new Date().toISOString(),
          slideImages: JSON.stringify(slideImagesMap)
        }, { merge: true });
      } catch (pErr) {
        console.warn('Photos doc save notice:', pErr);
      }
    }

    // 2. If projectFiles exists, also persist to separate files document so size never bottlenecks master
    if (reportData.projectFiles && reportData.projectFiles.length > 0) {
      try {
        const filesRef = doc(db, 'shared_reports', 'files');
        await setDoc(filesRef, {
          id: 'files',
          updatedAt: new Date().toISOString(),
          files: JSON.stringify(reportData.projectFiles),
          customFileCategories: reportData.customFileCategories || []
        }, { merge: true });
      } catch (fErr) {
        console.warn('Files doc save notice:', fErr);
      }
    }

    let serialized = JSON.stringify(reportData);
    let sizeInBytes = serialized.length;

    // 3. If size exceeds 700KB, offload heavy local data URLs to keep master document ultra lean and fast
    if (sizeInBytes > 700000) {
      const leanReportData: ReportData = {
        ...reportData,
        slides: reportData.slides.map((s) => ({
          ...s,
          images: (s.images || []).map((img) => ({
            ...img,
            url: img.url && img.url.length > 30000 ? '' : img.url
          }))
        })),
        projectFiles: (reportData.projectFiles || []).map((f) => ({
          ...f,
          fileUrl: f.fileUrl && f.fileUrl.length > 30000 ? '' : f.fileUrl
        }))
      };
      serialized = JSON.stringify(leanReportData);
      sizeInBytes = serialized.length;
    }

    if (sizeInBytes > 1000000) {
      return {
        success: false,
        error: `حجم ملف التقرير الحالي (${(sizeInBytes / 1024).toFixed(1)} KB) تجاوز الحد الأقصى للمزامنة السحابية (1 ميجابايت) بسبب الصور المرفوعة محلياً. يرجى استخدام زر ضغط الصور أو استخدام روابط سحابية لتوفير مساحة والمزامنة الفورية.`
      };
    }

    const masterRef = doc(db, 'shared_reports', 'master');
    const writePromise = setDoc(masterRef, {
      id: 'master',
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || auth.currentUser?.displayName || 'مسؤول النظام (أدمن)',
      projectTitle: reportData.projectInfo.projectTitle,
      overallProgress: reportData.projectInfo.overallProgress,
      reportData: serialized
    }, { merge: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('انتهت مهلة الحفظ السحابي (20 ثانية). يرجى مراجعة سرعة الإنترنت وحجم الصور المرفقة.')), 20000)
    );

    await Promise.race([writePromise, timeoutPromise]);
    return { success: true };
  } catch (error: any) {
    console.warn('saveSharedMasterReport notice:', error?.message || error);
    let errorMsg = error?.message || String(error);
    if (errorMsg.includes('resource-exhausted') || errorMsg.includes('Quota exceeded')) {
      errorMsg = 'تجاوزت سعة التقرير الحد الأقصى للمزامنة السحابية (1 ميجابايت). يرجى تقليص حجم الصور المرفوعة أو استخدام روابط Google Drive لتوثيق غير محدود.';
    }
    return { success: false, error: errorMsg };
  }
}

export function subscribeToSharedMasterReport(callback: (data: ReportData | null, updatedAt?: string) => void) {
  try {
    const masterRef = doc(db, 'shared_reports', 'master');
    return onSnapshot(
      masterRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const d = snapshot.data();
          if (d && d.reportData) {
            try {
              const parsed = JSON.parse(d.reportData) as ReportData;

              // Check if there are separate slide photos in shared_reports/photos
              try {
                const photosSnap = await getDoc(doc(db, 'shared_reports', 'photos'));
                if (photosSnap.exists()) {
                  const pData = photosSnap.data();
                  if (pData && pData.slideImages) {
                    const photosMap = JSON.parse(pData.slideImages);
                    if (photosMap && typeof photosMap === 'object') {
                      parsed.slides = parsed.slides.map((s) => {
                        const storedImages = photosMap[s.id];
                        if (Array.isArray(storedImages) && storedImages.length > 0) {
                          // If current slide images are missing URLs or were offloaded, restore them
                          const needsRestore = !s.images || s.images.length === 0 || s.images.some(img => !img.url);
                          if (needsRestore) {
                            return { ...s, images: storedImages };
                          }
                        }
                        return s;
                      });
                    }
                  }
                }
              } catch (pErr) {
                console.warn('Failed to restore photos from separate doc:', pErr);
              }

              // Check if there are separate files in shared_reports/files
              try {
                const filesSnap = await getDoc(doc(db, 'shared_reports', 'files'));
                if (filesSnap.exists()) {
                  const filesData = filesSnap.data();
                  if (filesData && filesData.files) {
                    const parsedFiles = JSON.parse(filesData.files);
                    if (Array.isArray(parsedFiles) && parsedFiles.length > 0) {
                      parsed.projectFiles = parsedFiles;
                    }
                    if (Array.isArray(filesData.customFileCategories) && filesData.customFileCategories.length > 0) {
                      parsed.customFileCategories = filesData.customFileCategories;
                    }
                  }
                }
              } catch (e) {}

              callback(parsed, d.updatedAt);
              return;
            } catch (err) {
              console.error('Failed to parse master report from Firestore:', err);
            }
          }
        }
        callback(null);
      },
      (error) => {
        console.warn('subscribeToSharedMasterReport notice:', error);
      }
    );
  } catch (e) {
    return () => {};
  }
}
