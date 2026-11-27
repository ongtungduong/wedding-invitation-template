import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { weddingConfig } from './config/loadConfig';

describe('Luxury Wedding Template App', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('shows wax seal envelope intro first and reveals invitation after opening', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('dialog', { name: /Thiệp Mời Cưới/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Mở Thiệp/i }));
    await waitFor(
      () => {
        expect(
          screen.queryByRole('dialog', { name: /Thiệp Mời Cưới/i }),
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 },
    );
    expect(sessionStorage.getItem('wedding-envelope-opened')).toBe('1');
  });

  it('renders formal two-family invitation with lunar date, schedule, and switches VI/EN', async () => {
    sessionStorage.setItem('wedding-envelope-opened', '1');
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Minh Anh & Quốc Bảo/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ông Nguyễn Minh Đức/i)).toBeInTheDocument();
    expect(screen.getByText(/Nhằm ngày 13 Tháng 02 năm Đinh Mùi/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Lịch Trình & Trang Phục/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(
      screen.getByRole('heading', { name: /Wedding Schedule & Dress Code/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Wedding Gift/i })).toBeInTheDocument();
  });

  it('displays personalized guest greeting from ?guest= URL parameter', () => {
    sessionStorage.setItem('wedding-envelope-opened', '1');
    window.history.replaceState({}, '', '/?guest=Anh+H%C3%B9ng');
    render(<App />);

    expect(screen.getByText('Anh Hùng')).toBeInTheDocument();
    expect(screen.getAllByText(/Trân trọng kính mời/i).length).toBeGreaterThanOrEqual(1);
  });

  it('respects feature flags to hide optional luxury modules cleanly', () => {
    const minimalConfig = {
      ...weddingConfig,
      features: {
        ...weddingConfig.features,
        showEnvelopeIntro: false,
        showInvitationCard: false,
        showSchedule: false,
        showGift: false,
        showRsvp: false,
        showCalendar: false,
        showMobileDock: false,
      },
    };

    render(<App config={minimalConfig} />);

    expect(screen.queryByText(/Ông Nguyễn Minh Đức/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Lịch Trình & Trang Phục/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Hộp Mừng Cưới/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Xác Nhận Tham Dự/i }),
    ).not.toBeInTheDocument();
  });

  it('validates RSVP and prepends submitted wish live onto the guestbook wall', async () => {
    sessionStorage.setItem('wedding-envelope-opened', '1');
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Gửi xác nhận & lời chúc/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Vui lòng nhập họ và tên/i);

    await user.type(screen.getByLabelText(/Họ và tên/i), 'Trần Văn Nam');
    await user.type(
      screen.getByLabelText(/Lời chúc gửi tới cô dâu & chú rể/i),
      'Chúc hai bạn mãi hạnh phúc viên mãn!',
    );
    await user.click(screen.getByRole('button', { name: /Gửi xác nhận & lời chúc/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/Chế độ xem trước/i);
    expect(screen.getByText('Trần Văn Nam')).toBeInTheDocument();
    expect(screen.getByText('Chúc hai bạn mãi hạnh phúc viên mãn!')).toBeInTheDocument();
  });

  it('filters gallery photos and opens/closes keyboard-accessible lightbox', async () => {
    sessionStorage.setItem('wedding-envelope-opened', '1');
    const user = userEvent.setup();
    render(<App />);

    const partyBtn = screen.getByRole('button', { name: 'Tiệc Chung Vui' });
    await user.click(partyBtn);
    expect(partyBtn).toHaveAttribute('aria-pressed', 'true');

    const photoButtons = screen.getAllByRole('button', { name: /Xem ảnh lớn/i });
    expect(photoButtons).toHaveLength(3);

    await user.click(photoButtons[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens hidden couple invite link generator when ?invite-tool=1 is set', async () => {
    window.history.replaceState({}, '', '/?invite-tool=1');
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Tạo Link Mời Cá Nhân Hóa/i }),
    ).toBeInTheDocument();

    const textarea = screen.getByLabelText(/Danh sách khách mời/i);
    await user.clear(textarea);
    await user.type(textarea, 'Cô Hương\nChú Minh');

    expect(screen.getByText('Cô Hương')).toBeInTheDocument();
    expect(screen.getByText('Chú Minh')).toBeInTheDocument();
  });

  it('adds rel="noopener noreferrer" to every external target="_blank" link', () => {
    sessionStorage.setItem('wedding-envelope-opened', '1');
    render(<App />);

    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    expect(externalLinks.length).toBeGreaterThan(0);

    externalLinks.forEach((link) => {
      const rel = link.getAttribute('rel') ?? '';
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    });
  });
});
