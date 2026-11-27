import type { GiftAccount } from '../config/schema';

/**
 * Returns either a VietQR dynamic image URL (if account.useVietQr is true)
 * or a local QR image resolved via resolveAsset.
 */
export function resolveGiftQrUrl(
  account: GiftAccount,
  resolveAsset: (path: string) => string,
): string | null {
  if (account.useVietQr && account.bankCode && account.accountNumber) {
    const bank = encodeURIComponent(account.bankCode.trim());
    const acc = encodeURIComponent(account.accountNumber.replace(/\s+/g, ''));
    const params = new URLSearchParams({
      accountName: account.accountHolder.trim(),
    });
    return `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?${params.toString()}`;
  }

  if (account.qrImage) {
    return resolveAsset(account.qrImage);
  }

  return null;
}
