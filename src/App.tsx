import React, { useState, useEffect } from 'react';
import { INITIAL_REPORT_DATA } from './data/initialReportData';
import { ReportData, ReportSlide, SlideImage, ProjectInfo, BoqItem, ScheduleItem } from './types/report';
import { Header } from './components/Header';
import { PresentationMode } from './components/PresentationMode';
import { BoqEditor } from './components/BoqEditor';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { SlidesGridView } from './components/SlidesGridView';
import { ImageUploadModal } from './components/ImageUploadModal';
import { SlideManagerModal } from './components/SlideManagerModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { LightboxModal } from './components/LightboxModal';
import { PrintReportView } from './components/PrintReportView';

const STORAGE_KEY = 'cement_factory_report_data_v1';

export default function App() {
  const [data, setData] = useState<ReportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved report data', e);
    }
    return INITIAL_REPORT_DATA;
  });

  const [currentView, setCurrentView] = useState<'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'print'>('presentation');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetSlideId, setUploadTargetSlideId] = useState<string | undefined>();
  const [isSlideManagerOpen, setIsSlideManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState<SlideImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed, probably storage quota limit exceeded with base64 images', e);
    }
  }, [data]);

  // Handlers for Slides & Images
  const handleOpenLightbox = (images: SlideImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleOpenAddPhoto = (slideId?: string) => {
    setUploadTargetSlideId(slideId || data.slides[currentSlideIndex]?.id);
    setIsUploadModalOpen(true);
  };

  const handleAddImageToSlide = (slideId: string, image: SlideImage) => {
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return {
          ...s,
          type: s.type === 'cover' || s.type === 'boq' || s.type === 'timeline' ? s.type : 'photos',
          images: [...(s.images || []), image]
        } as ReportSlide;
      }
      return s;
    });

    setData((prev) => ({
      ...prev,
      slides: updatedSlides
    }));
  };

  const handleCreateNewPhotoSlide = (
    title: string,
    subTitle: string,
    image: SlideImage,
    layout: 'single' | 'two-column' | 'three-column'
  ) => {
    const newSlide: ReportSlide = {
      id: `slide-${Date.now()}`,
      slideNumber: data.slides.length + 1,
      type: 'photos',
      title,
      subTitle,
      images: [image],
      layout
    };

    const newSlides = [...data.slides, newSlide];
    setData((prev) => ({
      ...prev,
      slides: newSlides
    }));

    setCurrentSlideIndex(newSlides.length - 1);
    setCurrentView('presentation');
  };

  const handleDeleteImage = (slideId: string, imageId: string) => {
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return {
          ...s,
          images: (s.images || []).filter((img) => img.id !== imageId)
        };
      }
      return s;
    });

    setData((prev) => ({
      ...prev,
      slides: updatedSlides
    }));
  };

  const handleUpdateSlideTitle = (slideId: string, newTitle: string) => {
    const updatedSlides = data.slides.map((s) => {
      if (s.id === slideId) {
        return { ...s, title: newTitle };
      }
      return s;
    });

    setData((prev) => ({
      ...prev,
      slides: updatedSlides
    }));
  };

  const handleDeleteSlide = (slideId: string) => {
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

  const handleUpdateBoqItems = (newItems: BoqItem[]) => {
    setData((prev) => ({
      ...prev,
      boqItems: newItems
    }));
  };

  const handleUpdateScheduleItems = (newItems: ScheduleItem[]) => {
    setData((prev) => ({
      ...prev,
      scheduleItems: newItems
    }));
  };

  const handleSaveProjectInfo = (newInfo: ProjectInfo) => {
    setData((prev) => ({
      ...prev,
      projectInfo: newInfo
    }));
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        projectInfo={data.projectInfo}
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        onOpenAddPhoto={() => handleOpenAddPhoto()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPrint={() => setCurrentView('print')}
        totalSlides={data.slides.length}
      />

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
            onDeleteImage={handleDeleteImage}
            onUpdateSlideTitle={handleUpdateSlideTitle}
            onPrintReport={() => setCurrentView('print')}
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
            onOpenSlideManager={() => setIsSlideManagerOpen(true)}
            onDeleteSlide={handleDeleteSlide}
          />
        )}
      </main>

      {/* Upload Image Modal */}
      <ImageUploadModal
        slides={data.slides}
        currentSlideId={uploadTargetSlideId}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddImageToSlide={handleAddImageToSlide}
        onCreateNewPhotoSlide={handleCreateNewPhotoSlide}
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
      />

      {/* Lightbox Modal */}
      <LightboxModal
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}
