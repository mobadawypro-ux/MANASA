import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testConnection } from './firebase/config';
import { syncUserProfile } from './firebase/reportsService';
import { INITIAL_REPORT_DATA } from './data/initialReportData';
import { NEW_BOQ_ITEMS } from './data/newBoqItems';
import { INITIAL_PROJECT_FILES, DEFAULT_FILE_CATEGORIES } from './data/initialProjectFiles';
import { UNIFIED_SCHEDULE_ITEMS } from './data/unifiedScheduleItems';
import { ReportData, ReportSlide, SlideImage, ProjectInfo, BoqItem, ScheduleItem, ProjectFile } from './types/report';
import { Sidebar } from './components/Sidebar';
import { PresentationMode } from './components/PresentationMode';
import { BoqEditor } from './components/BoqEditor';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { SlidesGridView } from './components/SlidesGridView';
import { ProjectFilesView } from './components/ProjectFilesView';
import { QuantitySurveyView } from './components/QuantitySurveyView';
import { AddProjectFileModal } from './components/AddProjectFileModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { EditImageModal } from './components/EditImageModal';
import { SlideManagerModal } from './components/SlideManagerModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { LightboxModal } from './components/LightboxModal';
import { PrintReportView } from './components/PrintReportView';
import { CloudReportsModal } from './components/CloudReportsModal';
import { LoginModal } from './components/LoginModal';
import { AcademyLogoUploadModal } from './components/AcademyLogoUploadModal';
import { 
  savePublicBranding, 
  subscribePublicBranding,
  saveSharedMasterReport,
  subscribeToSharedMasterReport,
  uploadToCloudinary
} from './firebase/reportsService';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { Eye, ShieldCheck, CheckCircle2, Smartphone, RefreshCw, X, FolderArchive } from 'lucide-react';

const STORAGE_KEY = 'cement_factory_report_data_v6';

const cleanDataDate = (d: ReportData): ReportData => {
  let changed = false;
  const projectInfo = { ...d.projectInfo };
  let boqItems = d.boqItems;
  if (!boqItems || boqItems.length < 70) {
    boqItems = NEW_BOQ_ITEMS;
    changed = true;
  }
  let projectFiles = d.projectFiles;
  if (!projectFiles || projectFiles.length === 0) {
    projectFiles = INITIAL_PROJECT_FILES;
    changed = true;
  }
  let customFileCategories = d.customFileCategories;
  if (!customFileCategories || customFileCategories.length === 0) {
    customFileCategories = DEFAULT_FILE_CATEGORIES;
    changed = true;
  }
  if (projectInfo.reportDate !== '2026/10/15') {
    projectInfo.reportDate = '2026/10/15';
    changed = true;
  }
  const slides = d.slides.map(s => {
    let sChanged = false;
    let facility = s.facility;
    if (!facility) {
      if (s.type === 'cover' || s.type === 'timeline' || s.type === 'boq' || s.type === 'summary') {
        facility = 'عام - كامل المشروع';
      } else {
        const zoneCycle = [
          'هنجر الشكاير 1',
          'هنجر الشكاير 2',
          'هنجر المعدات',
          'مغسلة المعدات'
        ];
        facility = zoneCycle[(s.slideNumber - 6) % 4] || 'هنجر الشكاير 1';
      }
      changed = true;
      sChanged = true;
    }
    let subTitle = s.subTitle || '';
    if (subTitle && (subTitle.includes('2026/9/13') || subTitle.includes('2026/09/13') || subTitle.includes('2026/10/02') || subTitle.includes('2026/10/2'))) {
      subTitle = subTitle.replace(/2026\/(0?9\/13|10\/0?2)/g, '2026/10/15');
      changed = true;
      sChanged = true;
    }
    return sChanged ? { ...s, facility, subTitle } : s;
  });
  let scheduleItems = d.scheduleItems;
  if (!scheduleItems || scheduleItems.length < 30) {
    scheduleItems = UNIFIED_SCHEDULE_ITEMS;
    changed = true;
  }
  return changed ? { ...d, projectInfo, boqItems, scheduleItems, slides, projectFiles, customFileCategories } : d;
};

export default function App() {
  const { isAdmin, isGuest, openLoginModal } = useAuth();

  const [data, setData] = useState<ReportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.boqItems && parsed.boqItems.length >= 70) {
          return cleanDataDate({
            ...parsed,
            projectFiles: parsed.projectFiles && parsed.projectFiles.length > 0 ? parsed.projectFiles : INITIAL_PROJECT_FILES,
            customFileCategories: parsed.customFileCategories && parsed.customFileCategories.length > 0 ? parsed.customFileCategories : DEFAULT_FILE_CATEGORIES
          });
        }
      }
    } catch (e) {
      console.error('Failed to load saved report data', e);
    }
    return INITIAL_REPORT_DATA;
  });

  const [currentView, setCurrentView] = useState<'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'files' | 'print' | 'quantity_survey'>('presentation');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Project Files Modals State
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<ProjectFile | null>(null);
  const [viewingFile, setViewingFile] = useState<ProjectFile | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetSlideId, setUploadTargetSlideId] = useState<string | undefined>();
  const [isSlideManagerOpen, setIsSlideManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoUploadModalOpen, setIsLogoUploadModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SlideImage | null>(null);
  const [editingImageSlideId, setEditingImageSlideId] = useState<string | null>(null);

  // Cloud Live Synchronization State (Mobile & Desktop sync)
  const [isSyncingToCloud, setIsSyncingToCloud] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [hasRemoteData, setHasRemoteData] = useState(false);
  const isIncomingRemoteUpdate = useRef(false);
  const isInitialMount = useRef(true);
  const hasReceivedCloudData = useRef(false);

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState<SlideImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Conversion of old local Base64 images to Cloudinary
  const [isConvertingImages, setIsConvertingImages] = useState(false);
  const [conversionProgress, setConversionProgress] = useState('');

  // Real-time synchronization of public branding (Academy Logo) so ANY visitor sees it
  useEffect(() => {
    // Check initial cached logo if available
    try {
      const cachedLogo = localStorage.getItem('cement_app_academy_logo_v1');
      if (cachedLogo) {
        setData((prev) => ({
          ...prev,
          projectInfo: {
            ...prev.projectInfo,
            consultantLogoUrl: cachedLogo
          }
        }));
      }
    } catch (e) {}

    // Listen to Firestore public branding changes in real time
    const unsubscribeBranding = subscribePublicBranding((remoteLogo) => {
      if (remoteLogo !== null) {
        setData((prev) => ({
          ...prev,
          projectInfo: {
            ...prev.projectInfo,
            consultantLogoUrl: remoteLogo
          }
        }));
        try {
          if (remoteLogo) {
            localStorage.setItem('cement_app_academy_logo_v1', remoteLogo);
          } else {
            localStorage.removeItem('cement_app_academy_logo_v1');
          }
        } catch (e) {}
      }
    });

    return () => unsubscribeBranding();
  }, []);

  // Real-time synchronization of the Shared Master Report so ANY device (especially mobile phones) immediately displays all computer edits!
  useEffect(() => {
    const unsubscribeMaster = subscribeToSharedMasterReport((remoteData, updatedAt) => {
      hasReceivedCloudData.current = true;
      if (remoteData) {
        isIncomingRemoteUpdate.current = true;
        const cleaned = cleanDataDate(remoteData);
        setData(cleaned);
        setHasRemoteData(true);
        setLastSyncedTime(updatedAt ? new Date(updatedAt).toLocaleTimeString('ar-EG') : null);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        } catch (e) {}
      } else {
        setHasRemoteData(false);
      }
    });

    return () => unsubscribeMaster();
  }, []);

  // Boot connection check & Auth listener
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        syncUserProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed, probably storage quota limit exceeded with base64 images', e);
    }
  }, [data]);

  // Automatic debounced cloud sync whenever Admin makes modifications so mobile is always up-to-date
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isIncomingRemoteUpdate.current) {
      isIncomingRemoteUpdate.current = false;
      return;
    }

    if (!isAdmin) return;

    // CRITICAL SAFEGUARD: Never overwrite the cloud with local state until we have successfully connected and checked the cloud state!
    if (!hasReceivedCloudData.current) {
      console.warn('Auto-sync blocked: Cloud state not loaded yet.');
      return;
    }

    const timer = setTimeout(() => {
      setIsSyncingToCloud(true);
      saveSharedMasterReport(data)
        .then((res) => {
          if (res.success) {
            setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          } else {
            console.warn('Auto-sync skip:', res.error);
          }
        })
        .catch((e) => console.warn('Auto-sync exception:', e))
        .finally(() => setIsSyncingToCloud(false));
    }, 1500);

    return () => clearTimeout(timer);
  }, [data, isAdmin]);

  // Handlers for Slides & Images
  const handleOpenLightbox = (images: SlideImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleOpenAddPhoto = (slideId?: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setUploadTargetSlideId(slideId || data.slides[currentSlideIndex]?.id);
    setIsUploadModalOpen(true);
  };

  const handleOpenSettings = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setIsSettingsOpen(true);
  };

  const handleOpenSlideManager = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setIsSlideManagerOpen(true);
  };

  const handleAddImageToSlide = (slideId: string, image: SlideImage) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const targetIndex = data.slides.findIndex((s) => s.id === slideId);
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return {
          ...s,
          type: 'photos', // Always set to photos so images are rendered!
          images: [...(s.images || []), image]
        } as ReportSlide;
      }
      return s;
    });

    const updatedData = {
      ...data,
      slides: updatedSlides
    };

    setData(updatedData);

    // Immediately navigate to the target slide so user sees their new image right away
    if (targetIndex !== -1) {
      setCurrentSlideIndex(targetIndex);
      setCurrentView('presentation');
    }

    setSyncNotice({
      type: 'info',
      text: 'جاري حفظ الصورة ومزامنتها سحابياً...'
    });

    // Immediate Cloud Persistence so all visitors and mobile phones immediately receive the new photo
    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setSyncNotice({
            type: 'success',
            text: `✓ تم حفظ الصورة بنجاح بالشريحة رقم (${targetIndex !== -1 ? targetIndex + 1 : ''}) ومزامنتها سحابياً!`
          });
          setTimeout(() => setSyncNotice(null), 5000);
        } else {
          setSyncNotice({
            type: 'error',
            text: res.error || 'تعذر المزامنة السحابية للصورة'
          });
          setTimeout(() => setSyncNotice(null), 6000);
        }
      })
      .catch((e) => {
        setSyncNotice({
          type: 'error',
          text: 'حدث خطأ في المزامنة: ' + (e?.message || e)
        });
        setTimeout(() => setSyncNotice(null), 6000);
      })
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleCreateNewPhotoSlide = (
    title: string,
    subTitle: string,
    image: SlideImage,
    layout: 'single' | 'two-column' | 'three-column',
    facility?: string
  ) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const newSlide: ReportSlide = {
      id: `slide-${Date.now()}`,
      slideNumber: data.slides.length + 1,
      type: 'photos',
      title: title.trim() || 'توثيق أعمال جديدة بالموقع',
      subTitle: subTitle.trim() || `الأعمال التي تمت في الموقع حتى تاريخ اليوم (${data.projectInfo.reportDate})`,
      images: [image],
      layout,
      facility: facility || 'هنجر الشكاير 1'
    };

    const newSlides = [...data.slides, newSlide];
    const updatedData = {
      ...data,
      slides: newSlides
    };

    setData(updatedData);
    setCurrentSlideIndex(newSlides.length - 1);
    setCurrentView('presentation');

    setSyncNotice({
      type: 'info',
      text: 'جاري حفظ الشريحة الجديدة ومزامنتها سحابياً...'
    });

    // Immediate Cloud Persistence
    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setSyncNotice({
            type: 'success',
            text: `✓ تم إنشاء الشريحة الجديدة رقم (${newSlides.length}) وحفظ صورتها ومزامنتها سحابياً!`
          });
          setTimeout(() => setSyncNotice(null), 5000);
        } else {
          setSyncNotice({
            type: 'error',
            text: res.error || 'تعذر حفظ الشريحة سحابياً'
          });
          setTimeout(() => setSyncNotice(null), 6000);
        }
      })
      .catch((e) => {
        setSyncNotice({
          type: 'error',
          text: 'خطأ في الحفظ السحابي: ' + (e?.message || e)
        });
        setTimeout(() => setSyncNotice(null), 6000);
      })
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleDeleteImage = (slideId: string, imageId: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return {
          ...s,
          images: (s.images || []).filter((img) => img.id !== imageId)
        };
      }
      return s;
    });

    const updatedData = {
      ...data,
      slides: updatedSlides
    };

    setData(updatedData);

    // Immediate Cloud Persistence
    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
        }
      })
      .catch((e) => console.warn('Sync error:', e))
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleOpenEditImage = (slideId: string, image: SlideImage) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingImage(image);
    setEditingImageSlideId(slideId);
    setIsEditImageModalOpen(true);
  };

  const handleSaveEditImage = (
    originalSlideId: string,
    imageId: string,
    updatedImage: SlideImage,
    targetSlideId?: string
  ) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }

    let updatedSlides = [...data.slides];

    if (targetSlideId && targetSlideId !== originalSlideId) {
      // 1. Remove from original slide
      updatedSlides = updatedSlides.map((s) => {
        if (s.id === originalSlideId) {
          return {
            ...s,
            images: (s.images || []).filter((img) => img.id !== imageId)
          };
        }
        return s;
      });

      // 2. Append to target slide
      updatedSlides = updatedSlides.map((s) => {
        if (s.id === targetSlideId) {
          return {
            ...s,
            type: 'photos',
            images: [...(s.images || []), updatedImage]
          };
        }
        return s;
      });

      // Navigate to target slide
      const targetIdx = updatedSlides.findIndex((s) => s.id === targetSlideId);
      if (targetIdx !== -1) {
        setCurrentSlideIndex(targetIdx);
      }
    } else {
      // Update in-place
      updatedSlides = updatedSlides.map((s) => {
        if (s.id === originalSlideId) {
          return {
            ...s,
            images: (s.images || []).map((img) => (img.id === imageId ? updatedImage : img))
          };
        }
        return s;
      });
    }

    const updatedData = {
      ...data,
      slides: updatedSlides
    };

    setData(updatedData);

    setSyncNotice({
      type: 'info',
      text: 'جاري حفظ تعديلات الصورة ومزامنتها سحابياً...'
    });

    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setSyncNotice({
            type: 'success',
            text: '✓ تم تحديث بيانات الصورة وحفظها ومزامنتها سحابياً بنجاح!'
          });
          setTimeout(() => setSyncNotice(null), 4000);
        } else {
          setSyncNotice({
            type: 'error',
            text: res.error || 'تعذر حفظ تعديل الصورة سحابياً'
          });
          setTimeout(() => setSyncNotice(null), 6000);
        }
      })
      .catch((e) => {
        setSyncNotice({
          type: 'error',
          text: 'خطأ في المزامنة: ' + (e?.message || e)
        });
        setTimeout(() => setSyncNotice(null), 6000);
      })
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleUpdateSlideTitle = (slideId: string, newTitle: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return { ...s, title: newTitle };
      }
      return s;
    });

    const updatedData = {
      ...data,
      slides: updatedSlides
    };

    setData(updatedData);

    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleUpdateSlideFacility = (slideId: string, newFacility: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return { ...s, facility: newFacility };
      }
      return s;
    });

    const updatedData = {
      ...data,
      slides: updatedSlides
    };

    setData(updatedData);

    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const filtered = data.slides.filter((s) => s.id !== slideId);
    const updated = filtered.map((s, i) => ({ ...s, slideNumber: i + 1 }));

    setData((prev) => ({
      ...prev,
      slides: updated
    }));

    if (currentSlideIndex >= updated.length) {
      setCurrentSlideIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleAddNewSlide = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const newSlide: ReportSlide = {
      id: `slide-${Date.now()}`,
      slideNumber: data.slides.length + 1,
      type: 'photos',
      title: 'عنوان الشريحة المضافة حديثاً',
      subTitle: `الأعمال التي تمت في الموقع حتى تاريخ اليوم (${data.projectInfo.reportDate})`,
      images: [],
      layout: 'single',
      facility: 'هنجر الشكاير 1'
    };

    const newSlides = [...data.slides, newSlide];
    const updatedData = {
      ...data,
      slides: newSlides
    };

    setData(updatedData);
    setCurrentSlideIndex(newSlides.length - 1);
    setCurrentView('presentation');

    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setSyncNotice({
            type: 'success',
            text: '✓ تم إضافة وحفظ شريحة فارغة جديدة بنجاح! يمكنك الآن تعديل عنوانها وإضافة الصور والمنطقة الهندسية.'
          });
          setTimeout(() => setSyncNotice(null), 6000);
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleUpdateBoqItems = (newItems: BoqItem[]) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setData((prev) => ({
      ...prev,
      boqItems: newItems
    }));
  };

  const handleUpdateScheduleItems = (newItems: ScheduleItem[]) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setData((prev) => ({
      ...prev,
      scheduleItems: newItems
    }));
  };

  // Project Files Management Handlers
  const handleOpenAddFile = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingFile(null);
    setIsAddFileModalOpen(true);
  };

  const handleEditFile = (file: ProjectFile) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingFile(file);
    setIsAddFileModalOpen(true);
  };

  const handleDeleteFile = (fileId: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const filteredFiles = (data.projectFiles || INITIAL_PROJECT_FILES).filter((f) => f.id !== fileId);
    const updatedData = {
      ...data,
      projectFiles: filteredFiles
    };
    setData(updatedData);
    saveSharedMasterReport(updatedData);
  };

  const handleSaveFile = (file: ProjectFile) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const existing = data.projectFiles || INITIAL_PROJECT_FILES;
    const index = existing.findIndex((f) => f.id === file.id);
    let updatedFiles: ProjectFile[];
    if (index >= 0) {
      updatedFiles = [...existing];
      updatedFiles[index] = file;
    } else {
      updatedFiles = [file, ...existing];
    }
    const updatedData = {
      ...data,
      projectFiles: updatedFiles
    };
    setData(updatedData);
    setIsAddFileModalOpen(false);
    setEditingFile(null);

    setIsSyncingToCloud(true);
    saveSharedMasterReport(updatedData)
      .then((res) => {
        if (res.success) {
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setSyncNotice({
            type: 'success',
            text: '✓ تم حفظ مستند المشروع وتوصيفه سحابياً بنجاح!'
          });
          setTimeout(() => setSyncNotice(null), 4000);
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsSyncingToCloud(false));
  };

  const handleViewFile = (file: ProjectFile) => {
    setViewingFile(file);
    setIsPdfViewerOpen(true);
  };

  const handleAddFileCategory = (newCat: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setData((prev) => {
      const existing = prev.customFileCategories || DEFAULT_FILE_CATEGORIES;
      if (existing.includes(newCat)) return prev;
      return {
        ...prev,
        customFileCategories: [...existing, newCat]
      };
    });
  };

  const handleDeleteFileCategory = (catName: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setData((prev) => ({
      ...prev,
      customFileCategories: (prev.customFileCategories || DEFAULT_FILE_CATEGORIES).filter((c) => c !== catName)
    }));
  };

  const handleSaveLogo = async (newLogoUrl: string) => {
    setData((prev) => ({
      ...prev,
      projectInfo: {
        ...prev.projectInfo,
        consultantLogoUrl: newLogoUrl
      }
    }));
    try {
      if (newLogoUrl) {
        localStorage.setItem('cement_app_academy_logo_v1', newLogoUrl);
      } else {
        localStorage.removeItem('cement_app_academy_logo_v1');
      }
      await savePublicBranding(newLogoUrl);
    } catch (e) {}
  };

  const handleSyncToAllDevices = async () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setIsSyncingToCloud(true);
    try {
      const res = await saveSharedMasterReport(data);
      if (res.success) {
        setSyncNotice({
          type: 'success',
          text: 'تم نشر التعديلات سحابياً بنجاح! ستظهر الآن فورياً على هاتفك الجوال ولأي شخص يفتح الرابط.'
        });
        setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
        setTimeout(() => setSyncNotice(null), 5000);
      } else {
        setSyncNotice({
          type: 'error',
          text: res.error || 'تعذر النشر السحابي، تأكد من الاتصال بالإنترنت وتسجيل الدخول كأدمن.'
        });
        setTimeout(() => setSyncNotice(null), 8000);
      }
    } catch (err: any) {
      console.error(err);
      setSyncNotice({
        type: 'error',
        text: err?.message || 'حدث خطأ غير متوقع أثناء النشر السحابي.'
      });
      setTimeout(() => setSyncNotice(null), 8000);
    } finally {
      setIsSyncingToCloud(false);
    }
  };

  const handleConvertLocalImagesToCloudinary = async () => {
    if (!data.projectInfo.cloudinaryCloudName?.trim() || !data.projectInfo.cloudinaryUploadPreset?.trim()) {
      alert('يرجى أولاً إدخال اسم السحابة (Cloud Name) و الـ (Upload Preset) في نافذة الإعدادات لتتمكن من رفع وتحويل الصور إلى حسابك على Cloudinary.');
      setIsSettingsOpen(true);
      return;
    }
    setIsConvertingImages(true);
    setConversionProgress('جاري فحص الصور المحلية القديمة في ملف التقرير...');
    
    try {
      let convertedCount = 0;
      const updatedSlides = [...data.slides];
      let updatedProjectInfo = { ...data.projectInfo };

      // Automatically convert custom Consultant/Academy Logo if it's stored as Base64!
      if (updatedProjectInfo.consultantLogoUrl && updatedProjectInfo.consultantLogoUrl.startsWith('data:image/')) {
        setConversionProgress('جاري تحويل الشعار المعتمد المرفوع محلياً إلى سحابة Cloudinary...');
        try {
          const logoCloudUrl = await uploadToCloudinary(
            updatedProjectInfo.consultantLogoUrl,
            data.projectInfo.cloudinaryCloudName,
            data.projectInfo.cloudinaryUploadPreset
          );
          updatedProjectInfo.consultantLogoUrl = logoCloudUrl;
          convertedCount++;
          // Sync locally to cached logo
          try {
            localStorage.setItem('cement_app_academy_logo_v1', logoCloudUrl);
            await savePublicBranding(logoCloudUrl);
          } catch (e) {}
        } catch (logoErr: any) {
          console.error('Failed to convert custom consultant logo:', logoErr);
          throw new Error(`فشل تحويل شعار الاستشاري إلى السحابة. السبب: ${logoErr?.message || logoErr}`);
        }
      }

      for (let sIndex = 0; sIndex < updatedSlides.length; sIndex++) {
        const slide = updatedSlides[sIndex];
        if (slide.images && slide.images.length > 0) {
          const updatedImages = [...slide.images];
          let slideChanged = false;
          for (let iIndex = 0; iIndex < updatedImages.length; iIndex++) {
            const img = updatedImages[iIndex];
            if (img.url.startsWith('data:image/')) {
              setConversionProgress(`جاري تحويل الصورة رقم ${convertedCount + 1} ورفعها سحابياً إلى Cloudinary...`);
              try {
                const cloudinaryUrl = await uploadToCloudinary(
                  img.url,
                  data.projectInfo.cloudinaryCloudName,
                  data.projectInfo.cloudinaryUploadPreset
                );
                updatedImages[iIndex] = {
                  ...img,
                  url: cloudinaryUrl
                };
                convertedCount++;
                slideChanged = true;
              } catch (uploadErr: any) {
                console.error('Failed to convert image:', img.id, uploadErr);
                throw new Error(`تعذر تحويل الصورة رقم (${convertedCount + 1}) إلى السحابة. السبب: ${uploadErr?.message || uploadErr || 'تأكد من إعدادات Cloudinary أو اتصالك بالإنترنت.'}`);
              }
            }
          }
          if (slideChanged) {
            updatedSlides[sIndex] = {
              ...slide,
              images: updatedImages
            };
          }
        }
      }

      if (convertedCount > 0) {
        const updatedData = {
          ...data,
          projectInfo: updatedProjectInfo,
          slides: updatedSlides
        };
        setData(updatedData);
        setConversionProgress('جاري حفظ التعديلات سحابياً وتحديث المزامنة...');
        const res = await saveSharedMasterReport(updatedData);
        if (res.success) {
          setSyncNotice({
            type: 'success',
            text: `🎉 تم بنجاح تحويل (${convertedCount}) صورة قديمة وتفريغ المساحة! تم حفظ ومزامنة التقرير بنجاح.`
          });
          setLastSyncedTime(new Date().toLocaleTimeString('ar-EG'));
          setTimeout(() => setSyncNotice(null), 8000);
        } else {
          setSyncNotice({
            type: 'error',
            text: `تم تحويل الصور محلياً، ولكن فشلت المزامنة: ${res.error}`
          });
          setTimeout(() => setSyncNotice(null), 8000);
        }
      } else {
        alert('كافة صور التقرير مرفوعة سحابياً ومحمية بالفعل، لا يوجد أي صور محلية قديمة لتحويلها!');
      }
    } catch (err: any) {
      alert(`حدث خطأ غير متوقع أثناء عملية التحويل: ${err?.message || err}`);
    } finally {
      setIsConvertingImages(false);
      setConversionProgress('');
    }
  };

  const handleSaveProjectInfo = async (newInfo: ProjectInfo) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setData((prev) => ({
      ...prev,
      projectInfo: newInfo
    }));

    if (newInfo.consultantLogoUrl !== undefined) {
      try {
        if (newInfo.consultantLogoUrl) {
          localStorage.setItem('cement_app_academy_logo_v1', newInfo.consultantLogoUrl);
        } else {
          localStorage.removeItem('cement_app_academy_logo_v1');
        }
        await savePublicBranding(newInfo.consultantLogoUrl);
      } catch (e) {}
    }
  };

  const handleResetToDefault = () => {
    setData(INITIAL_REPORT_DATA);
    setCurrentSlideIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `executive-report-${data.projectInfo.reportDate.replace(/\//g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (importedData: ReportData) => {
    setData(importedData);
    setCurrentSlideIndex(0);
  };

  // If in Print/PDF mode
  if (currentView === 'print') {
    return (
      <PrintReportView
        slides={data.slides}
        projectInfo={data.projectInfo}
        boqItems={data.boqItems}
        scheduleItems={data.scheduleItems}
        onClose={() => setCurrentView('presentation')}
      />
    );
  }

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-200 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Sidebar Navigation (RTL side menu) */}
      <Sidebar
        projectInfo={data.projectInfo}
        currentView={currentView as any}
        onChangeView={(view) => setCurrentView(view)}
        onOpenAddPhoto={() => handleOpenAddPhoto()}
        onOpenSettings={handleOpenSettings}
        onOpenPrint={() => setCurrentView('print')}
        onOpenCloud={() => setIsCloudModalOpen(true)}
        onOpenLogoUpload={() => setIsLogoUploadModalOpen(true)}
        onSyncToCloud={handleSyncToAllDevices}
        isSyncing={isSyncingToCloud}
        lastSyncedTime={lastSyncedTime}
        user={user}
        totalSlides={data.slides.length}
        totalFiles={data.projectFiles?.length || 0}
      />

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">

      {/* Cloud Sync Feedback Banner */}
      {syncNotice && (
        <div className={`border-b px-4 py-2.5 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md select-none animate-fadeIn ${
          syncNotice.type === 'success'
            ? 'bg-emerald-600 text-white font-bold'
            : 'bg-rose-600 text-white font-bold'
        }`}>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>{syncNotice.text}</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
            {syncNotice.type === 'error' && (syncNotice.text.includes('روابط') || syncNotice.text.includes('الحد الأقصى')) && (
              <button
                onClick={handleConvertLocalImagesToCloudinary}
                className="px-3 py-1 bg-white text-rose-600 hover:bg-slate-100 font-black text-[11px] rounded-lg shadow-sm transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                ⚡ تحويل كافة صورك القديمة للسحابة وحل المشكلة بضغطة واحدة!
              </button>
            )}

            <button
              onClick={() => setSyncNotice(null)}
              className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Image Converter Loading Overlay */}
      {isConvertingImages && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-2xl shadow-amber-500/30 mb-6 animate-pulse">
            ⚡
          </div>
          <h3 className="text-lg font-black text-white mb-2">جاري تفريغ وتحويل مساحة التقرير سحابياً</h3>
          <p className="text-sm text-amber-400 font-bold max-w-md mb-4 font-mono">
            {conversionProgress}
          </p>
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full absolute inset-y-0 left-0 animate-pulse w-full"></div>
          </div>
          <p className="text-xs text-slate-400 mt-6 max-w-sm leading-relaxed">
            الرجاء عدم إغلاق هذه الصفحة أو تحديثها حتى تكتمل عملية الرفع الآمن لتفادي فقدان الصور.
          </p>
        </div>
      )}

      {/* Visitor Banner if current role is Guest */}
      {isGuest && (
        <div className={`border-b px-4 py-3 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs select-none transition-colors duration-200 ${
          isLight ? 'bg-blue-50/95 border-blue-200 text-blue-900' : 'bg-blue-950/60 border-blue-800 text-blue-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col gap-1 leading-normal">
              <span>
                <strong>وضع الزائر (للاطلاع والتصفح فقط):</strong> يمكنك تصفح كافة الشرائح، بنود المقايسة المسعرة الـ 74، والجدول الزمني. لتعديل أي عنصر أو حفظ التقرير سحابياً، يرجى تسجيل الدخول كمسؤول (أدمن).
              </span>
              <span className={`text-[10px] font-bold flex items-center gap-1.5 ${hasRemoteData ? 'text-emerald-500' : 'text-amber-500 dark:text-amber-400'}`}>
                {hasRemoteData ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    🟢 متصل بالبث السحابي الحي: تم تحميل أحدث التعديلات والشرائح بنجاح!
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    🟡 يعرض النسخة الافتراضية الاحتياطية: لم يتم العثور على نسخة مخصصة نشطة في قاعدة البيانات السحابية بعد.
                  </>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={openLoginModal}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm md:self-center self-start"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            تسجيل الدخول كأدمن
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'presentation' && (
          <PresentationMode
            slides={data.slides}
            projectInfo={data.projectInfo}
            boqItems={data.boqItems}
            scheduleItems={data.scheduleItems}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={(index) => setCurrentSlideIndex(index)}
            onOpenLightbox={handleOpenLightbox}
            onOpenAddPhoto={handleOpenAddPhoto}
            onEditImage={handleOpenEditImage}
            onDeleteImage={handleDeleteImage}
            onUpdateSlideTitle={handleUpdateSlideTitle}
            onUpdateSlideFacility={handleUpdateSlideFacility}
            onPrintReport={() => setCurrentView('print')}
            onDeleteSlide={handleDeleteSlide}
            onAddNewSlide={handleAddNewSlide}
          />
        )}

        {currentView === 'boq' && (
          <BoqEditor
            items={data.boqItems}
            overallProgress={data.projectInfo.overallProgress}
            onUpdateItems={handleUpdateBoqItems}
            onUpdateOverallProgress={(newProgress) =>
              handleSaveProjectInfo({ ...data.projectInfo, overallProgress: newProgress })
            }
          />
        )}

        {currentView === 'timeline' && (
          <ScheduleTimeline
            items={data.scheduleItems}
            onUpdateItems={handleUpdateScheduleItems}
            contractorName={data.projectInfo.contractor}
            contractNumber={data.projectInfo.contractNumber}
            reportDate={data.projectInfo.reportDate}
          />
        )}

        {currentView === 'slides_grid' && (
          <SlidesGridView
            slides={data.slides}
            projectInfo={data.projectInfo}
            onSelectSlide={(index) => {
              setCurrentSlideIndex(index);
              setCurrentView('presentation');
            }}
            onOpenAddPhoto={handleOpenAddPhoto}
            onOpenSlideManager={handleOpenSlideManager}
            onDeleteSlide={handleDeleteSlide}
          />
        )}

        {currentView === 'files' && (
          <ProjectFilesView
            files={data.projectFiles || INITIAL_PROJECT_FILES}
            categories={data.customFileCategories || DEFAULT_FILE_CATEGORIES}
            projectInfo={data.projectInfo}
            onAddFile={handleOpenAddFile}
            onEditFile={handleEditFile}
            onDeleteFile={handleDeleteFile}
            onViewFile={handleViewFile}
            onAddCategory={handleAddFileCategory}
            onDeleteCategory={handleDeleteFileCategory}
          />
        )}

        {currentView === 'quantity_survey' && (
          <QuantitySurveyView 
            onClose={() => setCurrentView('presentation')}
          />
        )}
      </main>

      {/* Add / Edit Project File Modal */}
      <AddProjectFileModal
        isOpen={isAddFileModalOpen}
        onClose={() => {
          setIsAddFileModalOpen(false);
          setEditingFile(null);
        }}
        categories={data.customFileCategories || DEFAULT_FILE_CATEGORIES}
        projectInfo={data.projectInfo}
        onSaveFile={handleSaveFile}
        onAddCategory={handleAddFileCategory}
        editingFile={editingFile}
      />

      {/* PDF and Document Interactive Viewer Modal */}
      <PdfViewerModal
        file={viewingFile}
        projectInfo={data.projectInfo}
        isOpen={isPdfViewerOpen}
        onClose={() => {
          setIsPdfViewerOpen(false);
          setViewingFile(null);
        }}
      />

      {/* Cloud & Auth Modal */}
      <CloudReportsModal
        user={user}
        currentReportData={data}
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onLoadReport={handleImportData}
      />

      {/* Upload Image Modal */}
      <ImageUploadModal
        slides={data.slides}
        currentSlideId={uploadTargetSlideId}
        projectInfo={data.projectInfo}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddImageToSlide={handleAddImageToSlide}
        onCreateNewPhotoSlide={handleCreateNewPhotoSlide}
        onUpdateCloudinaryConfig={(cloudName, preset) => {
          handleSaveProjectInfo({
            ...data.projectInfo,
            cloudinaryCloudName: cloudName,
            cloudinaryUploadPreset: preset
          });
        }}
      />

      {/* Slide Manager Modal */}
      <SlideManagerModal
        slides={data.slides}
        isOpen={isSlideManagerOpen}
        onClose={() => setIsSlideManagerOpen(false)}
        onUpdateSlides={(newSlides) => setData((prev) => ({ ...prev, slides: newSlides }))}
        onSelectSlide={(index) => {
          setCurrentSlideIndex(index);
          setCurrentView('presentation');
        }}
      />

      {/* Project Settings Modal */}
      <ProjectSettingsModal
        projectInfo={data.projectInfo}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveProjectInfo}
        onResetToDefault={handleResetToDefault}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onConvertLocalImages={handleConvertLocalImagesToCloudinary}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        onEdit={(img) => {
          const s = data.slides.find((sl) => sl.images?.some((i) => i.id === img.id));
          if (s) {
            handleOpenEditImage(s.id, img);
          }
        }}
      />

      {/* Edit Image Modal */}
      <EditImageModal
        isOpen={isEditImageModalOpen}
        onClose={() => {
          setIsEditImageModalOpen(false);
          setEditingImage(null);
          setEditingImageSlideId(null);
        }}
        slideId={editingImageSlideId || ''}
        image={editingImage}
        slides={data.slides}
        projectInfo={data.projectInfo}
        onSave={handleSaveEditImage}
        onDelete={handleDeleteImage}
      />

      {/* Admin vs Guest Login Modal */}
      <LoginModal />

      {/* Academy Logo Upload & Public Branding Modal */}
      <AcademyLogoUploadModal
        isOpen={isLogoUploadModalOpen}
        onClose={() => setIsLogoUploadModalOpen(false)}
        currentLogoUrl={data.projectInfo.consultantLogoUrl}
        onSaveLogo={handleSaveLogo}
      />
      </div>
    </div>
  );
}
