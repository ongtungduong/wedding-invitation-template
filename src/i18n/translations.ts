import type { Language } from '../config/schema';

export interface UiDictionary {
  skipToContent: string;
  envelope: {
    subtitle: string;
    guestPrefix: string;
    openButton: string;
    openHint: string;
  };
  nav: {
    home: string;
    invitation: string;
    couple: string;
    anniversary: string;
    countdown: string;
    story: string;
    milestones: string;
    schedule: string;
    gallery: string;
    locations: string;
    gift: string;
    rsvp: string;
    openMenu: string;
    closeMenu: string;
    mainNavLabel: string;
    switchLang: string;
  };
  hero: {
    eyebrow: string;
    guestPrefix: string;
    scrollDown: string;
  };
  invitation: {
    eyebrow: string;
    title: string;
    saveTheDate: string;
  };
  couple: {
    eyebrow: string;
    sectionLabel: string;
    brideRole: string;
    groomRole: string;
    anniversaryTagline: string;
    countdownTagline: string;
  };
  timer: {
    anniversaryHeading: string;
    countdownHeading: string;
    daysTogether: (days: string, date: string) => string;
    year: string;
    years: string;
    day: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  milestones: {
    eyebrow: string;
    title: string;
  };
  schedule: {
    eyebrow: string;
    title: string;
    dressCodeTitle: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    filterLabel: string;
    all: string;
    ceremony: string;
    party: string;
    viewPhoto: string;
    closeLightbox: string;
    prevPhoto: string;
    nextPhoto: string;
    swipeHint: string;
  };
  locations: {
    eyebrow: string;
    title: string;
    openMap: string;
    addGoogleCalendar: string;
    downloadIcs: string;
  };
  gift: {
    eyebrow: string;
    title: string;
    accountNumberLabel: string;
    accountHolderLabel: string;
    copyNumber: string;
    copied: string;
    qrAlt: string;
  };
  rsvp: {
    eyebrow: string;
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    guestsLabel: string;
    sideLabel: string;
    sideBride: string;
    sideGroom: string;
    sideBoth: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successMessage: string;
    previewMessage: string;
    errorMessage: string;
    nameRequired: string;
    wishesTitle: string;
    justSentLabel: string;
  };
  dock: {
    locations: string;
    gift: string;
    rsvp: string;
    share: string;
    copiedLink: string;
  };
  inviteTool: {
    badge: string;
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    copySingle: string;
    copied: string;
    copyAll: string;
    copiedAll: string;
    openPreview: string;
    backToCard: string;
    emptyState: string;
  };
  music: {
    play: string;
    pause: string;
  };
  error: {
    title: string;
    description: string;
    reload: string;
  };
}

export const TRANSLATIONS: Record<Language, UiDictionary> = {
  vi: {
    skipToContent: 'Chuyển tới nội dung chính',
    envelope: {
      subtitle: 'Thiệp Mời Cưới',
      guestPrefix: 'Trân trọng kính mời',
      openButton: 'Mở Thiệp',
      openHint: 'Chạm dấu sáp để mở thiệp cưới',
    },
    nav: {
      home: 'Trang chủ',
      invitation: 'Thiệp mời',
      couple: 'Cặp đôi',
      anniversary: 'Kỷ niệm',
      countdown: 'Đếm ngược',
      story: 'Chuyện tình',
      milestones: 'Dấu mốc',
      schedule: 'Lịch trình',
      gallery: 'Album',
      locations: 'Địa điểm',
      gift: 'Mừng cưới',
      rsvp: 'Xác nhận',
      openMenu: 'Mở menu điều hướng',
      closeMenu: 'Đóng menu điều hướng',
      mainNavLabel: 'Điều hướng chính',
      switchLang: 'Chuyển đổi ngôn ngữ',
    },
    hero: {
      eyebrow: 'Save The Date',
      guestPrefix: 'Trân trọng kính mời',
      scrollDown: 'Cuộn xuống nội dung thiệp cưới',
    },
    invitation: {
      eyebrow: 'Thư Mời Chính Thức',
      title: 'Trân Trọng Kính Mời',
      saveTheDate: 'Ngày Trọng Đại',
    },
    couple: {
      eyebrow: 'Nhân vật chính',
      sectionLabel: 'Cô Dâu & Chú Rể',
      brideRole: 'Cô Dâu',
      groomRole: 'Chú Rể',
      anniversaryTagline: 'Hạnh Phúc Bên Nhau!',
      countdownTagline: 'Chúng Mình Kết Hôn!',
    },
    timer: {
      anniversaryHeading: 'Cùng nhau xây tổ ấm được',
      countdownHeading: 'Cùng đếm ngược tới ngày chung đôi',
      daysTogether: (days, date) => `${days} ngày bên nhau kể từ ${date}`,
      year: 'Năm',
      years: 'Năm',
      day: 'Ngày',
      days: 'Ngày',
      hours: 'Giờ',
      minutes: 'Phút',
      seconds: 'Giây',
    },
    milestones: {
      eyebrow: 'Dấu mốc',
      title: 'Hành Trình Hạnh Phúc',
    },
    schedule: {
      eyebrow: 'Timeline Ngày Vui',
      title: 'Lịch Trình & Trang Phục',
      dressCodeTitle: 'Gợi Ý Trang Phục (Dress Code)',
    },
    gallery: {
      eyebrow: 'Khoảnh khắc',
      title: 'Album Ảnh Cưới',
      filterLabel: 'Lọc ảnh theo danh mục',
      all: 'Tất cả',
      ceremony: 'Lễ Thành Hôn',
      party: 'Tiệc Chung Vui',
      viewPhoto: 'Xem ảnh lớn',
      closeLightbox: 'Đóng trình xem ảnh',
      prevPhoto: 'Ảnh trước',
      nextPhoto: 'Ảnh kế tiếp',
      swipeHint: 'Vuốt trái / phải để xem tiếp',
    },
    locations: {
      eyebrow: 'Thời gian & Địa điểm',
      title: 'Thông Tin Tổ Chức',
      openMap: 'Mở bản đồ Google Maps',
      addGoogleCalendar: 'Google Calendar',
      downloadIcs: 'Tải lịch (.ics)',
    },
    gift: {
      eyebrow: 'Gửi trao yêu thương',
      title: 'Hộp Mừng Cưới',
      accountNumberLabel: 'Số tài khoản',
      accountHolderLabel: 'Chủ tài khoản',
      copyNumber: 'Sao chép STK',
      copied: 'Đã sao chép',
      qrAlt: 'Mã QR chuyển khoản',
    },
    rsvp: {
      eyebrow: 'Chung vui cùng gia đình',
      title: 'Xác Nhận Tham Dự & Sổ Lưu Bút',
      nameLabel: 'Họ và tên *',
      namePlaceholder: 'Nhập họ tên của bạn',
      attendingLabel: 'Bạn sẽ tham dự chứ?',
      attendingYes: 'Sẽ tham dự',
      attendingNo: 'Rất tiếc không thể tham dự',
      guestsLabel: 'Số lượng khách',
      sideLabel: 'Khách mời của',
      sideBride: 'Nhà gái',
      sideGroom: 'Nhà trai',
      sideBoth: 'Cả hai bên',
      messageLabel: 'Lời chúc gửi tới cô dâu & chú rể',
      messagePlaceholder: 'Viết lời chúc của bạn tại đây...',
      submit: 'Gửi xác nhận & lời chúc',
      submitting: 'Đang gửi...',
      successMessage: 'Cảm ơn bạn đã gửi xác nhận và lời chúc tới gia đình chúng mình!',
      previewMessage:
        'Chế độ xem trước: Lời chúc đã hiển thị trên sổ lưu bút. Hãy cấu hình rsvp.endpoint trong wedding.config.json để lưu về máy chủ.',
      errorMessage: 'Không thể gửi phản hồi lúc này. Vui lòng thử lại sau.',
      nameRequired: 'Vui lòng nhập họ và tên của bạn.',
      wishesTitle: 'Sổ Lưu Bút',
      justSentLabel: 'Vừa gửi',
    },
    dock: {
      locations: 'Địa điểm',
      gift: 'Mừng cưới',
      rsvp: 'Xác nhận',
      share: 'Chia sẻ',
      copiedLink: 'Đã chép link',
    },
    inviteTool: {
      badge: 'Công cụ dành riêng cho Cô Dâu & Chú Rể',
      title: 'Tạo Link Mời Cá Nhân Hóa Gửi Zalo',
      description:
        'Nhập danh sách tên khách mời (mỗi dòng một người) để tạo đường dẫn mang tên riêng. Khách mở link sẽ thấy lời mời trang trọng kèm tên của chính họ.',
      inputLabel: 'Danh sách khách mời (mỗi dòng 1 tên)',
      inputPlaceholder: 'Anh Hùng & Gia đình\nChị Lan Phương\nBạn Minh Tuấn',
      copySingle: 'Sao chép link',
      copied: 'Đã chép',
      copyAll: 'Sao chép toàn bộ danh sách',
      copiedAll: 'Đã chép toàn bộ',
      openPreview: 'Xem thử',
      backToCard: 'Quay lại thiệp cưới',
      emptyState: 'Nhập ít nhất một tên khách mời ở trên để tạo link.',
    },
    music: {
      play: 'Bật nhạc nền',
      pause: 'Tạm dừng nhạc nền',
    },
    error: {
      title: 'Đã xảy ra sự cố',
      description: 'Vui lòng tải lại trang để thử lại.',
      reload: 'Tải lại trang',
    },
  },
  en: {
    skipToContent: 'Skip to main content',
    envelope: {
      subtitle: 'Wedding Invitation',
      guestPrefix: 'Cordially Invited',
      openButton: 'Open Invitation',
      openHint: 'Tap the wax seal to open',
    },
    nav: {
      home: 'Home',
      invitation: 'Invitation',
      couple: 'Couple',
      anniversary: 'Anniversary',
      countdown: 'Countdown',
      story: 'Story',
      milestones: 'Milestones',
      schedule: 'Schedule',
      gallery: 'Gallery',
      locations: 'Venues',
      gift: 'Gift',
      rsvp: 'R.S.V.P',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      mainNavLabel: 'Main navigation',
      switchLang: 'Switch language',
    },
    hero: {
      eyebrow: 'Save The Date',
      guestPrefix: 'Cordially Invited',
      scrollDown: 'Scroll down to wedding invitation',
    },
    invitation: {
      eyebrow: 'Formal Invitation',
      title: 'You Are Invited',
      saveTheDate: 'The Wedding Day',
    },
    couple: {
      eyebrow: 'The Happy Pair',
      sectionLabel: 'The Couple',
      brideRole: 'The Bride',
      groomRole: 'The Groom',
      anniversaryTagline: 'Happily Married!',
      countdownTagline: 'We Are Getting Married!',
    },
    timer: {
      anniversaryHeading: 'Together as a family for',
      countdownHeading: 'Counting down to forever',
      daysTogether: (days, date) => `${days} days together since ${date}`,
      year: 'Year',
      years: 'Years',
      day: 'Day',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
    },
    milestones: {
      eyebrow: 'Wedding',
      title: 'Our Milestones',
    },
    schedule: {
      eyebrow: 'Order of Events',
      title: 'Wedding Schedule & Dress Code',
      dressCodeTitle: 'Dress Code Palette',
    },
    gallery: {
      eyebrow: 'Gallery',
      title: 'Editorial Memories',
      filterLabel: 'Filter wedding photos',
      all: 'All',
      ceremony: 'Wedding Ceremony',
      party: 'Wedding Party',
      viewPhoto: 'View larger photo',
      closeLightbox: 'Close photo viewer',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      swipeHint: 'Swipe left or right to browse',
    },
    locations: {
      eyebrow: 'When & Where',
      title: 'Venues & Directions',
      openMap: 'Open on Google Maps',
      addGoogleCalendar: 'Google Calendar',
      downloadIcs: 'Download .ics',
    },
    gift: {
      eyebrow: 'Blessings',
      title: 'Wedding Gift',
      accountNumberLabel: 'Account Number',
      accountHolderLabel: 'Account Holder',
      copyNumber: 'Copy Number',
      copied: 'Copied',
      qrAlt: 'Bank transfer QR code',
    },
    rsvp: {
      eyebrow: 'Join Our Celebration',
      title: 'R.S.V.P & Guestbook',
      nameLabel: 'Full Name *',
      namePlaceholder: 'Enter your name',
      attendingLabel: 'Attendance',
      attendingYes: 'Joyfully Accepts',
      attendingNo: 'Regretfully Declines',
      guestsLabel: 'Number of Guests',
      sideLabel: 'Guest of',
      sideBride: "Bride's Side",
      sideGroom: "Groom's Side",
      sideBoth: 'Both Families',
      messageLabel: 'Wishes for the Couple',
      messagePlaceholder: 'Write your warm wishes here...',
      submit: 'Send R.S.V.P & Wish',
      submitting: 'Sending...',
      successMessage: 'Thank you for your RSVP and warm wishes!',
      previewMessage:
        'Preview mode: Your wish was added to the live wall. Set rsvp.endpoint in wedding.config.json to persist responses.',
      errorMessage: 'Unable to submit right now. Please try again later.',
      nameRequired: 'Please enter your name.',
      wishesTitle: 'Guestbook Wishes',
      justSentLabel: 'Just now',
    },
    dock: {
      locations: 'Venues',
      gift: 'Gift',
      rsvp: 'R.S.V.P',
      share: 'Share',
      copiedLink: 'Link copied',
    },
    inviteTool: {
      badge: 'Couple Utility Mode',
      title: 'Personalized Invite Link Generator',
      description:
        'Enter guest names (one per line) to generate personalized invitation links ready to send via Zalo or Messenger.',
      inputLabel: 'Guest list (one name per line)',
      inputPlaceholder: 'Alex & Family\nMs. Lan Phuong\nMinh Tuan',
      copySingle: 'Copy link',
      copied: 'Copied',
      copyAll: 'Copy all links',
      copiedAll: 'All copied',
      openPreview: 'Preview',
      backToCard: 'Back to invitation',
      emptyState: 'Enter at least one guest name above to generate links.',
    },
    music: {
      play: 'Play background music',
      pause: 'Pause background music',
    },
    error: {
      title: 'Something went wrong',
      description: 'Please reload the page to try again.',
      reload: 'Reload Page',
    },
  },
};
