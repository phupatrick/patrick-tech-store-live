export const TERM_DICTIONARY = {
  'Tài khoản': 'Account',
  'chính chủ': 'Private Account / Personal Upgrade',
  'gia hạn': 'Renewal',
  'bảo hành trọn đời': 'Lifetime Warranty',
  'bảo hành': 'Warranty',
  'tháng': 'Month(s)',
  'năm': 'Year(s)',
  'vĩnh viễn': 'Lifetime',
  'gói': 'Package / Plan',
  'Mạng xã hội': 'Social Media Services',
  'Sản phẩm Code & Tool': 'Code, Tools & Software',
  'Tài khoản Premium': 'Premium Accounts',
  'API Key & AI': 'API Keys & AI Services',
};

export function cleanEnglishDescription(text) {
  if (!text) return '';
  return Object.entries(TERM_DICTIONARY).reduce(
    (result, [vietnamese, english]) => result.replace(new RegExp(vietnamese, 'gi'), english),
    String(text),
  );
}
