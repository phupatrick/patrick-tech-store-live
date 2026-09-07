import { useEffect, useMemo, useState } from 'react';

import { cleanEnglishDescription } from './utils/translationDictionary';

const ZALO_LINK = 'https://zalo.me/0933684560';
const TELEGRAM_LINK = 'https://t.me/Patrick_Tech_Fullapp';
const TICKET_LINK = import.meta.env.VITE_TICKET_URL || 'https://telegram-ticket-system.vercel.app/';

const fallbackProducts = [
  { id: 1, title: 'Windows 11 Pro - Key bản quyền', category: 'Voucher giảm giá & Tài khoản', price: 890000, priceText: '890.000đ', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85', badge: 'Sản phẩm của Patrick Tech', sourceType: 'web', description: 'Key bản quyền chính hãng, kích hoạt nhanh và có hỗ trợ cài đặt từ xa.' },
  { id: 2, title: 'Canva Pro - Gói 12 tháng', category: 'Voucher giảm giá & Tài khoản', price: 299000, priceText: '299.000đ', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85', badge: 'Sản phẩm của Patrick Tech', sourceType: 'web', description: 'Tài khoản dùng ổn định, phù hợp cho thiết kế, social và dựng nội dung.' },
  { id: 3, title: 'Voucher giảm giá AI Premium', category: 'Voucher giảm giá & Tài khoản', price: 1490000, priceText: '1.490.000đ', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85', badge: 'Sản phẩm của Patrick Tech', sourceType: 'web', description: 'Voucher hỗ trợ giảm chi phí khi mua các gói công cụ AI và phần mềm số.' },
  { id: 4, title: 'Landing Page React + Tailwind', category: 'Voucher giảm giá & Tài khoản', price: 2200000, priceText: '2.200.000đ', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85', badge: 'Sản phẩm của Patrick Tech', sourceType: 'web', description: 'Mẫu code tối ưu mobile, sạch và dễ chỉnh sửa để dùng ngay cho bán hàng.' },
];

const initialRequests = [
  { initials: 'AN', title: 'Tìm tài khoản Adobe Creative Cloud', detail: 'Ưu tiên gói 1 năm, có hướng dẫn kích hoạt.', budget: 'Dưới 900.000đ', time: '12 phút trước' },
  { initials: 'MT', title: 'Cần source code shop React', detail: 'Có quản lý đơn hàng, giao diện mobile tốt.', budget: '1 - 3 triệu', time: '1 giờ trước' },
  { initials: 'DN', title: 'Tìm tool quản lý social media', detail: 'Cần dùng được nhiều tài khoản, hỗ trợ Windows.', budget: 'Trao đổi', time: '2 giờ trước' },
];

const hashtags = ['#chatgpt', '#youtubepremium', '#canva', '#duolingo', '#adobe', '#capcut', '#notion', '#grok', '#office365', '#spotify', '#netflix', '#figma'];
const categories = {
  vi: ['Tài khoản Premium', 'API Key & AI', 'Mạng xã hội', 'Code, Tool & Phần mềm'],
  en: ['Premium Accounts', 'API Keys & AI', 'Social Growth', 'Code, Tools & Software'],
};

const courses = [
  { category: 'IELTS', vi: 'IELTS Writing Band 7-8', en: 'IELTS Writing Band 7-8', viText: 'Phát triển ý, lập luận và diễn đạt cho Task 1 và Task 2.', enText: 'Build ideas, arguments, and language for Task 1 and Task 2.', viLessons: ['Phân tích đề và lập dàn ý', 'Cấu trúc đoạn văn', 'Tự kiểm tra theo tiêu chí chấm'], enLessons: ['Analyze prompts and plan', 'Build strong paragraphs', 'Self-check with scoring criteria'] },
  { category: 'TOEIC', vi: 'TOEIC Prep 300-600', en: 'TOEIC Prep 300-600', viText: 'Từ vựng, ngữ pháp và chiến thuật theo từng Part.', enText: 'Vocabulary, grammar, and strategy organized by Part.', viLessons: ['Từ vựng công việc', 'Nghe bắt từ khóa', 'Đọc nhanh và loại đáp án nhiễu'], enLessons: ['Workplace vocabulary', 'Listen for keywords', 'Read faster and remove distractors'] },
  { category: 'English', vi: 'Collocations A1-C2', en: 'Collocations A1-C2', viText: 'Học cụm từ theo cấp độ để nói và viết tự nhiên hơn.', enText: 'Level-based collocations for natural speaking and writing.', viLessons: ['Nền tảng A1-A2', 'Mở rộng B1-B2', 'Tinh chỉnh C1-C2'], enLessons: ['A1-A2 foundations', 'B1-B2 expansion', 'C1-C2 precision'] },
  { category: 'VSTEP', vi: 'VSTEP theo 4 kỹ năng', en: 'VSTEP Across Four Skills', viText: 'Luyện nghe, nói, đọc, viết theo mục tiêu B1-C1.', enText: 'Practice four skills for B1-C1 goals.', viLessons: ['Xác định mục tiêu điểm', 'Luyện theo dạng bài', 'Mô phỏng ngày thi'], enLessons: ['Set a score target', 'Practice by task type', 'Simulate test day'] },
  { category: 'Chinese', vi: 'HSK 1-6 theo lộ trình', en: 'HSK 1-6 Learning Path', viText: 'Phát âm, từ vựng, đọc hiểu và viết theo từng cấp HSK.', enText: 'Pronunciation, vocabulary, reading, and writing by HSK level.', viLessons: ['Thanh điệu và phát âm', 'Từ vựng theo chủ đề', 'Đọc hiểu và viết câu'], enLessons: ['Tones and pronunciation', 'Topic vocabulary', 'Reading and sentence writing'] },
  { category: 'Chinese writing', vi: 'Luyện viết HSK', en: 'HSK Handwriting Practice', viText: 'Rèn nét chữ, thứ tự nét và ghi nhớ từ vựng theo từng cấp độ.', enText: 'Build character form, stroke order, and vocabulary retention by level.', viLessons: ['Nét cơ bản và thứ tự nét', 'Chép từ theo chủ đề', 'Tự kiểm tra độ chính xác'], enLessons: ['Core strokes and stroke order', 'Copy topic vocabulary', 'Self-check for accuracy'] },
  { category: 'Korean', vi: 'TOPIK và tiếng Hàn tổng hợp', en: 'TOPIK and Practical Korean', viText: 'Ngữ âm, ngữ pháp và từ vựng cho học tập, công việc.', enText: 'Pronunciation, grammar, and vocabulary for study and work.', viLessons: ['Đọc Hangul', 'Mẫu câu giao tiếp', 'Chiến thuật TOPIK'], enLessons: ['Read Hangul', 'Conversation patterns', 'TOPIK strategy'] },
  { category: 'Work skills', vi: 'Excel cơ bản và MOS', en: 'Excel Foundations and MOS', viText: 'Bảng tính, hàm và quy trình công việc văn phòng.', enText: 'Spreadsheets, functions, and office workflows.', viLessons: ['Cấu trúc bảng tính', 'Hàm và dữ liệu', 'Bài tập mô phỏng công việc'], enLessons: ['Spreadsheet structure', 'Functions and data', 'Work-simulation exercises'] },
  { category: 'Career', vi: 'Logistics, SAP và xuất nhập khẩu', en: 'Logistics, SAP, and Import-Export', viText: 'Từ vựng nghiệp vụ, chứng từ và quy trình vận hành.', enText: 'Professional vocabulary, documentation, and operations.', viLessons: ['Chuỗi cung ứng', 'Bộ chứng từ', 'Luồng xử lý SAP'], enLessons: ['Supply chains', 'Documentation', 'SAP process flows'] },
  { category: 'E-commerce', vi: 'Thương mại điện tử toàn cầu', en: 'Global E-commerce Foundations', viText: 'Xây nền tảng vận hành cửa hàng xuyên biên giới từ sản phẩm đến chăm sóc khách hàng.', enText: 'Build a cross-border store workflow from product selection to customer care.', viLessons: ['Chọn thị trường và sản phẩm', 'Thiết lập quy trình đơn hàng', 'Đo lường và cải thiện'], enLessons: ['Choose markets and products', 'Set up order operations', 'Measure and improve'] },
];

const courseStudy = {
  IELTS: { vi: ['Lập kế hoạch trước khi viết', 'Đọc đề, xác định yêu cầu và chia ý thành mở bài, hai đoạn thân bài, kết luận.', 'Bài tập: lập dàn ý 10 phút cho một chủ đề giáo dục quen thuộc.'], en: ['Plan before writing', 'Read the prompt, identify its requirement, and group ideas into an introduction, two body paragraphs, and a conclusion.', 'Practice: make a ten-minute plan for a familiar education topic.'] },
  TOEIC: { vi: ['Dự đoán loại thông tin cần nghe', 'Trước khi nghe, nhận diện câu hỏi đang hỏi người, nơi chốn, thời gian, lý do hay hành động.', 'Bài tập: viết năm câu hỏi công việc và ghi loại câu trả lời cần tìm.'], en: ['Predict the answer type', 'Before listening, identify whether the question asks about a person, place, time, reason, or action.', 'Practice: write five workplace questions and label the needed answer type.'] },
  English: { vi: ['Học theo cụm từ có ngữ cảnh', 'Ghi nhớ make a decision như một cụm hoàn chỉnh thay vì tách từng từ đơn lẻ.', 'Bài tập: viết ba câu và đổi thì một lần với mỗi cụm từ mới.'], en: ['Learn phrases in context', 'Record make a decision as one complete phrase instead of learning its words separately.', 'Practice: write three sentences and change the tense once for each new phrase.'] },
  VSTEP: { vi: ['Luyện đúng dạng bài', 'Xác định mục tiêu điểm trước, sau đó dành thời gian cố định cho từng kỹ năng.', 'Bài tập: chọn một dạng nghe hoặc đọc, làm trong thời gian quy định và ghi lỗi.'], en: ['Practice the right task type', 'Set a score target first, then assign fixed time to each skill.', 'Practice: choose one listening or reading task, work under time, and record errors.'] },
  Chinese: { vi: ['Xây nền phát âm', 'Tách thanh mẫu, vận mẫu và thanh điệu khi học từ mới; sau đó đặt vào câu ngắn.', 'Bài tập: đánh dấu thanh điệu của mười từ theo chủ đề và đọc thành tiếng.'], en: ['Build a pronunciation base', 'Separate initials, finals, and tones for each new word, then place it in a short sentence.', 'Practice: mark tones for ten topic words and read them aloud.'] },
  'Chinese writing': { vi: ['Viết để nhớ từ', 'Luyện từng ký tự với thứ tự nét ổn định, đọc nghĩa rồi đặt từ vào một câu ngắn trước khi chuyển sang từ tiếp theo.', 'Bài tập: chọn năm từ mới, viết mỗi từ ba lần, sau đó viết một câu cho từng từ.'], en: ['Write to retain vocabulary', 'Practise each character with a consistent stroke order, say its meaning, then use the word in a short sentence before moving on.', 'Practice: choose five new words, write each three times, then write one sentence for each word.'] },
  Korean: { vi: ['Đọc Hangul theo cụm âm', 'Ghép phụ âm và nguyên âm thành âm tiết trước khi cố đọc cả từ.', 'Bài tập: đọc năm mẫu câu ngắn và gạch chân đuôi câu.'], en: ['Read Hangul by syllable blocks', 'Combine consonants and vowels into syllables before attempting a whole word.', 'Practice: read five short sentence patterns and underline their endings.'] },
  'Work skills': { vi: ['Làm sạch dữ liệu trước khi tính', 'Đặt tiêu đề cột rõ ràng, kiểm tra định dạng số và dùng một công thức cho một mục đích.', 'Bài tập: tạo bảng chi tiêu, dùng SUM và kiểm tra kết quả bằng phép tính tay.'], en: ['Clean data before calculating', 'Use clear column headers, check number formats, and give each formula one purpose.', 'Practice: create an expense sheet, use SUM, and verify the result by hand.'] },
  Career: { vi: ['Theo dõi chứng từ theo luồng', 'Gắn mỗi chứng từ với một bước trong chuỗi cung ứng để tránh xử lý thiếu hoặc trùng.', 'Bài tập: vẽ luồng từ báo giá đến giao hàng và ghi chứng từ tại từng bước.'], en: ['Track documents through the flow', 'Connect each document to one supply-chain step to prevent missing or duplicate work.', 'Practice: map the flow from quotation to delivery and name the document at each step.'] },
  'E-commerce': { vi: ['Bắt đầu từ một quy trình rõ ràng', 'Xác định khách hàng mục tiêu, giá trị sản phẩm, phương thức giao hàng và câu trả lời hỗ trợ trước khi mở bán.', 'Bài tập: lập một trang kế hoạch gồm khách hàng, sản phẩm, giá, giao hàng và ba câu hỏi thường gặp.'], en: ['Start with a clear operating flow', 'Define the target customer, product value, delivery method, and support responses before opening sales.', 'Practice: draft a one-page plan with the customer, product, price, delivery, and three common questions.'] },
};

const copy = {
  vi: {
    language: 'English',
    visitSite: 'Sang patricktechmedia.com',
    login: 'Đăng nhập',
    heroTitle: 'Mua công cụ đúng.',
    heroAccent: 'Làm việc nhanh hơn.',
    heroText: 'Kho sản phẩm số đã xác thực, có sẵn link hỗ trợ qua Zalo và Telegram khi bạn cần mua nhanh.',
    sell: 'Trang người bán',
    wanted: 'Trang người mua',
    sampleProducts: 'Sản phẩm mẫu của Patrick Tech',
    games: 'Game',
    search: 'Tìm voucher giảm giá, tài khoản hoặc phần mềm số...',
    find: 'Tìm kiếm',
    categories: 'Danh mục',
    featured: 'Sản phẩm của Patrick Tech',
    patrickProducts: 'Sản phẩm của Patrick Tech',
    viewAll: 'Xem tất cả',
    services: 'Người bán',
    servicesTitle: 'Dành cho người đăng bán sản phẩm số.',
    servicesText: 'Đăng sản phẩm, được kiểm duyệt trước khi hiển thị và áp dụng phí nền tảng rõ ràng.',
    request: 'Người mua',
    requestTitle: 'Đăng nhu cầu như một bài trạng thái.',
    fee: 'Phí nền tảng',
    verified: 'Đã xác thực',
    digital: 'Tài nguyên số',
    delivery: 'Giao online',
    feeText: '1% giá trị đơn hàng, tối thiểu 0.50 USD.',
    close: 'Đóng',
    listing: 'Đăng sản phẩm',
    productName: 'Tên sản phẩm',
    productPlaceholder: 'Ví dụ: Key Windows 11 Pro',
    price: 'Giá bán (VND)',
    submit: 'Gửi bài đăng',
    requested: 'Tìm sản phẩm',
    requestIntro: 'Cho cộng đồng biết chính xác bạn đang cần gì.',
    requestName: 'Sản phẩm bạn muốn tìm',
    detail: 'Mô tả chi tiết',
    budget: 'Ngân sách',
    postRequest: 'Đăng nhu cầu',
    created: 'Bài đăng đã được gửi và đang chờ duyệt.',
    requestCreated: 'Nhu cầu tìm mua đã được đăng.',
    noResult: 'Chưa tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác.',
    loadingProducts: 'Đang tải kho sản phẩm...',
    catalogError: 'Chưa tải được dữ liệu mới nhất, đang hiển thị dữ liệu dự phòng.',
    footer: 'Nơi giao dịch tài nguyên số gọn gàng, minh bạch.',
    saved: 'sản phẩm đã lưu',
    requestNow: 'Vừa xong',
    buyNow: 'Mua ngay',
    viewDescription: '\u004d\u00f4 t\u1ea3',
    priceLabel: 'Gi\u00e1',
    sellerLabel: 'Ng\u01b0\u1eddi b\u00e1n',
    catalogLink: 'Xem tr\u00ean catalog',
    noDescription: 'Catalog ch\u01b0a c\u00f3 m\u00f4 t\u1ea3 chi ti\u1ebft cho s\u1ea3n ph\u1ea9m n\u00e0y.',
    contactTitle: 'Chọn cách liên hệ để mua sản phẩm',
    zalo: 'Zalo 0933684560',
    telegram: 'Telegram @Patrick_Tech_Fullapp',
    ticket: 'Gửi Ticket Hỗ Trợ / Đặt Hàng',
    ticketEn: 'Submit Ticket / Support',
    ticketTitle: 'Gửi yêu cầu trực tiếp',
    ticketIntro: 'Để lại thông tin, Patrick Tech sẽ tiếp nhận và phản hồi qua kênh bạn chọn.',
    ticketName: 'Họ và tên',
    ticketContactType: 'Kênh liên hệ',
    ticketContactInfo: 'Thông tin liên hệ',
    ticketContactPlaceholder: 'Số điện thoại, username hoặc email',
    ticketRequestType: 'Loại yêu cầu',
    ticketWarranty: 'Bảo hành / hỗ trợ đơn hàng',
    ticketNewTask: 'Đặt hàng / yêu cầu mới',
    ticketDetails: 'Nội dung yêu cầu',
    ticketDetailsPlaceholder: 'Mô tả sản phẩm, vấn đề hoặc điều bạn cần hỗ trợ...',
    ticketSend: 'Gửi ticket',
    ticketSending: 'Đang gửi...',
    ticketSuccess: 'Đã tạo ticket',
    ticketSuccessText: 'Mã ticket của bạn là',
    ticketError: 'Chưa gửi được ticket. Vui lòng thử lại hoặc liên hệ qua Telegram.',
    storeNoteTitle: 'Sản phẩm của Patrick Tech',
    storeNoteText: 'Kho sản phẩm, phần mềm và web mẫu do Patrick Tech phát triển hoặc tuyển chọn, có hỗ trợ sau mua.',
    sellerNoteTitle: 'Trang người bán',
    sellerNoteText: 'Đây là khu đăng bán sản phẩm số, có kiểm duyệt và tính phí nền tảng tự động.',
    buyerNoteTitle: 'Trang người mua',
    buyerNoteText: 'Người mua có thể đăng nhu cầu như một status ngắn để người bán phù hợp vào tư vấn nhanh.',
    contactSeller: 'Liên hệ',
  },
  en: {
    language: 'Tiếng Việt',
    visitSite: 'Go to patricktechmedia.com',
    login: 'Login',
    heroTitle: 'Buy better tools.',
    heroAccent: 'Work faster.',
    heroText: 'A verified catalog of digital products with quick Zalo and Telegram contact when you want to buy fast.',
    sell: 'Seller page',
    wanted: 'Buyer page',
    sampleProducts: 'Patrick Tech sample products',
    games: 'Games',
    search: 'Search discounts, accounts, or digital software...',
    find: 'Search',
    categories: 'Categories',
    featured: 'Patrick Tech Products',
    patrickProducts: 'Patrick Tech Products',
    viewAll: 'View all',
    services: 'Sellers',
    servicesTitle: 'For people listing digital products.',
    servicesText: 'List a product, pass review before going live, and keep fees clear.',
    request: 'Buyers',
    requestTitle: 'Post what you want to buy like a status update.',
    fee: 'Platform fee',
    verified: 'Verified',
    digital: 'Digital goods',
    delivery: 'Online delivery',
    feeText: '1% of the order value, with a $0.50 minimum.',
    close: 'Close',
    listing: 'List a product',
    productName: 'Product name',
    productPlaceholder: 'Example: Windows 11 Pro key',
    price: 'Price (USD)',
    submit: 'Submit listing',
    requested: 'Find a product',
    requestIntro: 'Tell the community exactly what you are looking for.',
    requestName: 'Product you need',
    detail: 'Details',
    budget: 'Budget',
    postRequest: 'Post request',
    created: 'Your listing has been submitted for review.',
    requestCreated: 'Your wanted request is now live.',
    noResult: 'No matching products yet. Try a different keyword.',
    loadingProducts: 'Loading products...',
    catalogError: 'Latest data is unavailable, showing backup products.',
    footer: 'A clear marketplace for digital resources.',
    saved: 'saved products',
    requestNow: 'Just now',
    buyNow: 'Buy now',
    viewDescription: 'Description',
    priceLabel: 'Price',
    sellerLabel: 'Seller',
    catalogLink: 'View on catalog',
    noDescription: 'This product does not have a detailed catalog description yet.',
    contactTitle: 'Choose a contact method to buy this product',
    zalo: 'Zalo 0933684560',
    telegram: 'Telegram @Patrick_Tech_Fullapp',
    ticket: 'Submit Ticket / Support',
    ticketEn: 'Submit Ticket / Support',
    ticketTitle: 'Send a request directly',
    ticketIntro: 'Leave your details and Patrick Tech will follow up through your chosen channel.',
    ticketName: 'Full name',
    ticketContactType: 'Contact channel',
    ticketContactInfo: 'Contact details',
    ticketContactPlaceholder: 'Phone number, username, or email',
    ticketRequestType: 'Request type',
    ticketWarranty: 'Warranty / order support',
    ticketNewTask: 'New order / request',
    ticketDetails: 'Request details',
    ticketDetailsPlaceholder: 'Describe the product, issue, or support you need...',
    ticketSend: 'Send ticket',
    ticketSending: 'Sending...',
    ticketSuccess: 'Ticket created',
    ticketSuccessText: 'Your ticket code is',
    ticketError: 'The ticket could not be sent. Please try again or contact us on Telegram.',
    storeNoteTitle: 'Patrick Tech Products',
    storeNoteText: 'Products, software, and web samples developed or curated by Patrick Tech with post-purchase support.',
    sellerNoteTitle: 'Seller page',
    sellerNoteText: 'This area is for listing digital products with review and automatic platform fees.',
    buyerNoteTitle: 'Buyer page',
    buyerNoteText: 'Buyers can post short status-style requests so the right seller can contact them faster.',
    contactSeller: 'Contact',
  }
};

const VND_PER_USD = Number(import.meta.env.VITE_USD_EXCHANGE_RATE) || 26000;

// Catalog descriptions are authored in Vietnamese. Translate complete support
// sentences before individual terms so English product details remain readable.
const englishCatalogPhrases = [
  [/📦\s*Định dạng:\s*Link Ưu Đãi/gi, '📦 Format: Discount link'],
  [/⚠️\s*Lưu ý:/gi, '⚠️ Notes:'],
  [/Sản phẩm này không bảo hành\s*,?\s*dán link lên là nhận được Plan\.?/gi, 'This product has no warranty. Paste the link to receive the plan.'],
  [/Link nhận Plan Gemini AI Pro hạn\s*(\d+)\s*months?\.?/gi, 'Gemini AI Pro plan link valid for $1 months.'],
  [/Không cần thêm thẻ\s*,?\s*không cần sử dụng vpn\.?/gi, 'No card needs to be added and no VPN is required.'],
  [/Mua về chỉ cần login gmail\s*→\s*dán link\s*→\s*activation Plan\.?/gi, 'After purchase, sign in to Gmail, paste the link, and activate the plan.'],
  [/Bảo hành 24 giờ mua về sử dụng liền không bảo hành những trường hợp ngâm link quá 24h kể từ lúc mua\.?/gi, 'The link is covered for 24 hours after purchase. Links left unused for more than 24 hours are not covered.'],
  [/SẢN PHẨM NÀY KHÔNG BẢO HÀNH NẾU BỊ MẤT PLAN HOẶC BAN ACC, VÌ KHÔNG PHẢI ADD FAM MÀ LÀ NÂNG CẤP TRỰC TIẾP TRÊN ACC NÊN CÓ NGUY CƠ BỊ BAN ACC/gi, 'THIS PRODUCT IS NOT COVERED IF THE PLAN IS LOST OR THE ACCOUNT IS BANNED. IT IS A DIRECT ACCOUNT UPGRADE, NOT A FAMILY-PLAN ADDITION, SO ACCOUNT-BAN RISK MAY APPLY.'],
];

const englishTerms = [
  [/không bảo hành/gi, 'no warranty'],
  [/bảo hành/gi, 'warranty'],
  [/link ưu đãi/gi, 'discount link'],
  [/định dạng/gi, 'Format'],
  [/lưu ý/gi, 'Notes'],
  [/người dùng/gi, 'user'],
  [/người mua/gi, 'buyer'],
  [/sử dụng/gi, 'use'],
  [/không cần/gi, 'not required'],
  [/mua về/gi, 'after purchase'],
  [/mất plan/gi, 'lose the plan'],
  [/ban acc/gi, 'account ban'],
  [/nâng gói/gi, 'Upgrade'],
  [/tài khoản/gi, 'Account'],
  [/bản quyền/gi, 'License'],
  [/gói/gi, 'Plan'],
  [/giảm giá/gi, 'Discount'],
  [/phần mềm/gi, 'Software'],
  [/tháng/gi, 'months'],
  [/năm/gi, 'year'],
  [/liên hệ/gi, 'Contact us'],
  [/kích hoạt/gi, 'activation'],
  [/hỗ trợ/gi, 'support'],
  [/trọn đời/gi, 'lifetime'],
  [/chính hãng/gi, 'official'],
];

function translateCatalogText(text, language) {
  if (!text || language === 'vi') return text;
  const translatedPhrases = englishCatalogPhrases.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
  const translatedTerms = englishTerms.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), translatedPhrases);
  return cleanEnglishDescription(translatedTerms);
}

const catalogCategoryLabels = {
  premium: { vi: 'Tài khoản Premium', en: 'Premium Accounts' },
  ai: { vi: 'API Key & AI', en: 'API Keys & AI' },
  social: { vi: 'Mạng xã hội', en: 'Social Growth' },
  software: { vi: 'Code, Tool & Phần mềm', en: 'Code, Tools & Software' },
};

const catalogCategoryOptions = {
  vi: [
    { id: 'all', label: 'Tất cả' },
    { id: 'premium', label: 'Tài khoản Premium' },
    { id: 'ai', label: 'API Key' },
    { id: 'social', label: 'Mạng xã hội' },
    { id: 'software', label: 'Sản phẩm Code & Tool' },
  ],
  en: [
    { id: 'all', label: 'All' },
    { id: 'premium', label: 'Premium Accounts' },
    { id: 'ai', label: 'API Keys' },
    { id: 'social', label: 'Social Growth' },
    { id: 'software', label: 'Code & Tools' },
  ],
};

function localizedCategory(product, language) {
  const category = product?.catalogCategory;
  return catalogCategoryLabels[category]?.[language] || (language === 'en' ? 'Digital products' : 'Sản phẩm số');
}

const formatPrice = (value, fallbackText, language) => {
  if (typeof value === 'number' && value > 0) {
    if (language === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value / VND_PER_USD);
    }
    return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
  }
  if (language === 'en') return 'Contact us';
  return fallbackText || 'Liên hệ';
};

const feeFor = (value) => Math.max((value / 25000) * 0.01, 0.5);

function normalizeDescription(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[\t ]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isDescriptionNoise(text, priceText = '') {
  if (!text) return true;
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const normalizedPrice = (priceText || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalized) return true;
  if (normalized === 'liên hệ' || normalized === 'lien he') return true;
  if (normalizedPrice && normalized === normalizedPrice) return true;
  return false;
}

function normalizeProduct(product) {
  const cleanedDescription = normalizeDescription(product.description);
  return {
    ...product,
    category: product.catalogCategory || 'software',
    image: product.image || product.images?.[0] || 'https://stc-zh5.zdn.vn/catalog/thumb-fail.png',
    badge: 'Sản phẩm của Patrick Tech',
    description: isDescriptionNoise(cleanedDescription, product.priceText) ? '' : cleanedDescription,
    sourceType: product.source === 'zalo-catalog' ? 'catalog' : 'web'
  };
}

function renderCatalogInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function CatalogDescription({ text }) {
  return (
    <div className="catalog-description">
      {text.split(/\r?\n/).map((line, index) => {
        const value = line.trim();

        if (!value) return <div className="catalog-description-spacer" key={index} />;
        if (/^-{3,}$/.test(value)) return <hr key={index} />;
        if (/^#{1,3}\s+/.test(value)) {
          return <h3 key={index}>{renderCatalogInline(value.replace(/^#{1,3}\s+/, ''))}</h3>;
        }
        if (/^\*\s+/.test(value)) {
          return <p className="catalog-description-bullet" key={index}>{renderCatalogInline(value.replace(/^\*\s+/, ''))}</p>;
        }

        return <p key={index}>{renderCatalogInline(value)}</p>;
      })}
    </div>
  );
}
function Logo() {
  return (
    <a className="logo" href="https://patricktechmedia.com" target="_blank" rel="noreferrer" aria-label="patricktechmedia.com">
      <img src="https://patricktechmedia.com/patrick-tech-media-icon.svg?v=39177d1409a5053bff72af89" alt="Patrick Tech Media" />
      <span>Patrick Tech Store</span>
    </a>
  );
}

function ProductCard({ product, language, onSave, onBuy, onViewDescription, onTicket, buyLabel, descriptionLabel, ticketLabel }) {
  const [saved, setSaved] = useState(false);

  const toggleSave = () => {
    setSaved((current) => !current);
    onSave(!saved);
  };

  return (
    <article className="product-card">
      <div className="product-visual">
        <img src={product.image} alt={translateCatalogText(product.title, language)} loading="lazy" />
        <span className="badge verified-badge"><span className="badge-check">✓</span>{language === 'en' ? 'Patrick Tech product' : 'Sản phẩm của Patrick Tech'}</span>
        <button className={saved ? 'save-button is-saved' : 'save-button'} aria-label={language === 'en' ? 'Save product' : 'Lưu sản phẩm'} onClick={toggleSave}>♡</button>
      </div>
      <div className="product-info">
        <p>{localizedCategory(product, language)}</p>
        <h3>{translateCatalogText(product.title, language)}</h3>
        <strong>{formatPrice(product.price, product.priceText, language)}</strong>
        <div className="product-actions-row">
          <button className="description-button" aria-label={descriptionLabel} title={descriptionLabel} onClick={() => onViewDescription(product)}>{descriptionLabel}</button>
          <button className="buy-button" onClick={() => onBuy(product)}>{buyLabel}</button>
          <button className="ticket-button" onClick={() => onTicket(product)}>{ticketLabel}</button>
        </div>
      </div>
    </article>
  );
}

function CourseLibrary({ language }) {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(courses.map((course) => course.category))];
  const filtered = category === 'All' ? courses : courses.filter((course) => course.category === category);
  const vi = language === 'vi';
  return <section className="content-section courses-section" id="courses">
    <div className="section-heading"><div><p className="section-kicker">Patrick Tech Co.</p><h2>{vi ? 'Thư viện khóa học' : 'Course library'}</h2></div></div>
    <p className="courses-lead">{vi ? 'Bài học được chuẩn hóa để học trực tiếp bằng văn bản và học liệu Patrick Tech. Không có nguồn ngoài trong khu vực khóa học.' : 'Lessons are standardized for direct study with Patrick Tech text and learning media. No external sources appear in the course area.'}</p>
    <div className="course-filter-row">{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item === 'All' ? (vi ? 'Tất cả' : 'All') : item}</button>)}</div>
    <div className="course-grid">{filtered.map((course) => <article className="course-card" key={course.category}>
      <div className="course-card-header"><span>{course.category}</span><b>PT</b></div><div className="course-card-body"><h3>{course[language]}</h3><p>{course[`${language}Text`]}</p><details><summary>{vi ? 'Mở bài học' : 'Open lesson'}</summary><div className="course-lesson"><p className="course-lesson-title">{courseStudy[course.category][language][0]}</p><p>{courseStudy[course.category][language][1]}</p><p><strong>{vi ? 'Thực hành:' : 'Practice:'}</strong> {courseStudy[course.category][language][2].replace(/^(Bài tập:|Practice:)\s*/, '')}</p></div><ol>{course[`${language}Lessons`].map((lesson) => <li key={lesson}>{lesson}</li>)}</ol><div className="course-status"><strong>{vi ? 'Học liệu Patrick Tech' : 'Patrick Tech learning media'}</strong><span>{vi ? 'Bài học văn bản do Patrick Tech biên soạn. Hình ảnh và âm thanh gốc sẽ được nhập sau khi có quyền sao chép hợp lệ.' : 'Text lesson authored by Patrick Tech. Original images and audio will be imported after lawful copy access is available.'}</span></div></details></div>
    </article>)}</div>
  </section>;
}

export default function App() {
  const [language, setLanguage] = useState('vi');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');
  const [sellPrice, setSellPrice] = useState('5000000');
  const [requests, setRequests] = useState(initialRequests);
  const [saved, setSaved] = useState(0);
    const [products, setProducts] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activePage, setActivePage] = useState(() => window.location.pathname === '/courses' ? 'courses' : 'store');
  const [activeCategory, setActiveCategory] = useState('all');
  const [translatedCatalog, setTranslatedCatalog] = useState({});
  const [translatedTitles, setTranslatedTitles] = useState({});
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  const t = copy[language];
  const localizedProducts = useMemo(() => products.map((product) => ({
    ...product,
    title: language === 'en'
      ? (translatedTitles[String(product.id || product.path || product.title)] || translateCatalogText(product.title, language))
      : product.title,
    category: localizedCategory(product, language),
  })), [products, language, translatedTitles]);
  const priceInput = Number(sellPrice.replace(/\D/g, '')) || 0;
  const pageNote = activePage === 'seller'
    ? { title: t.sellerNoteTitle, text: t.sellerNoteText }
    : activePage === 'buyer'
      ? { title: t.buyerNoteTitle, text: t.buyerNoteText }
      : activePage === 'courses'
        ? { title: language === 'vi' ? 'Khóa học Patrick Tech' : 'Patrick Tech courses', text: language === 'vi' ? 'Học trực tiếp trong trang với nội dung đã được Patrick Tech chuẩn hóa.' : 'Study directly on the page with Patrick Tech-standardized content.' }
      : { title: t.storeNoteTitle, text: t.storeNoteText };

  const filteredProducts = useMemo(
    () => localizedProducts.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.catalogCategory === activeCategory;
      const searchable = `${product.title} ${product.category} ${product.description || ''}`.toLowerCase();
      return matchesCategory && searchable.includes(query.toLowerCase());
    }),
    [localizedProducts, query, activeCategory]
  );

  useEffect(() => {
    if (language !== 'en' || !products.length) return;
    const untranslated = products.filter((product) => !translatedTitles[String(product.id || product.path || product.title)]);
    if (!untranslated.length) return;

    let active = true;
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: untranslated.map((product) => product.title) }),
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('title translation unavailable'))))
      .then((data) => {
        if (!active || !Array.isArray(data.translations)) return;
        setTranslatedTitles((current) => ({
          ...current,
          ...Object.fromEntries(untranslated.map((product, index) => [
            String(product.id || product.path || product.title),
            data.translations[index] || translateCatalogText(product.title, 'en'),
          ])),
        }));
      });

    return () => { active = false; };
  }, [language, products, translatedTitles]);

  useEffect(() => {
    if (language !== 'en' || !selectedProduct?.description) return;
    const productKey = String(selectedProduct.id || selectedProduct.path || selectedProduct.title);
    if (translatedCatalog[productKey]) return;

    let active = true;
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedProduct.description }),
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('translation unavailable'))))
      .then((data) => {
        if (active && data.translated) {
          setTranslatedCatalog((current) => ({ ...current, [productKey]: data.translated }));
        }
      })
      .catch(() => {
        if (active) setTranslatedCatalog((current) => ({ ...current, [productKey]: translateCatalogText(selectedProduct.description, 'en') }));
      });

    return () => { active = false; };
  }, [language, selectedProduct, translatedCatalog]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const submitListing = (event) => {
    event.preventDefault();
    setModal(null);
    showNotice(t.created);
  };

  const submitRequest = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRequests((current) => [
      { initials: 'PT', title: form.get('title'), detail: form.get('detail'), budget: form.get('budget'), time: t.requestNow },
      ...current,
    ]);
    setModal(null);
    showNotice(t.requestCreated);
  };

  const openBuyModal = (product) => {
    setSelectedProduct(product);
    setModal('contact');
  };

  const openDescriptionModal = (product) => {
    setSelectedProduct(product);
    setModal('description');
  };

  const selectPage = (page) => {
    setActivePage(page);
    window.history.replaceState({}, '', page === 'courses' ? '/courses' : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTicketModal = (product = null) => {
    setSelectedProduct(product);
    setTicketCode('');
    setModal('ticket');
  };

  const submitTicket = async (event) => {
    event.preventDefault();
    setTicketSubmitting(true);
    const form = new FormData(event.currentTarget);
    const productTitle = selectedProduct
      ? (language === 'en' ? (translatedTitles[String(selectedProduct.id || selectedProduct.path || selectedProduct.title)] || translateCatalogText(selectedProduct.title, 'en')) : selectedProduct.title)
      : '';
    try {
      const response = await fetch(`${TICKET_LINK.replace(/\/$/, '')}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.get('client_name'),
          contact_type: form.get('contact_type'),
          contact_info: form.get('contact_info'),
          request_type: form.get('request_type'),
          product: productTitle,
          details: form.get('details'),
          source: 'patricktechmedia.store',
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'ticket failed');
      setTicketCode(data.ticket_code || '');
    } catch (error) {
      console.error('Ticket submission failed:', error);
      showNotice(t.ticketError);
    } finally {
      setTicketSubmitting(false);
    }
  };

  const selectHeroCollection = (search = '') => {
    setActivePage('store');
    setActiveCategory('all');
    setQuery(search);
    window.setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('catalog api failed');
        const data = await response.json();
        if (active && Array.isArray(data.products) && data.products.length) {
          setProducts(data.products.map((item) => normalizeProduct(item)));
          setCatalogStatus('ready');
        } else if (active) {
          setCatalogStatus('error');
        }
      } catch {
        if (active) {
          setProducts(fallbackProducts.map((item) => normalizeProduct(item)));
          setCatalogStatus('error');
        }
      }
    }

    loadProducts();
    const refreshTimer = window.setInterval(loadProducts, 5 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  return (
    <div id="top">
      <header className="site-header">
        <div className="nav-wrap">
          <Logo />
          <div className="nav-actions">
            <a className="domain-button" href="https://patricktechmedia.com" target="_blank" rel="noreferrer">{t.visitSite}</a>
            <button className="course-header-button" onClick={() => selectPage('courses')}>{language === 'vi' ? 'Khóa học' : 'Courses'}</button>
            <a className="login-button" href={language === 'vi' ? 'https://patricktechmedia.com/vi/login' : 'https://patricktechmedia.com/en/login'} target="_blank" rel="noreferrer">{t.login}</a>
            <button className="ticket-header-button" onClick={() => openTicketModal()}>{t.ticket}</button>
            <button className="language-button" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>{t.language}</button>
            
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="section-kicker">patricktechmedia.com</p>
              <h1>{t.heroTitle}<br /><em>{t.heroAccent}</em></h1>
              <p className="hero-description">{t.heroText}</p>
              <div className="hero-actions">
                <button className="button button-secondary-alt" onClick={() => selectPage('seller')}>{t.sell}</button>
                <button className="button button-text" onClick={() => selectPage('buyer')}>{t.wanted}<b>↗</b></button>
                <button className="button button-text" onClick={() => selectHeroCollection()}>{t.patrickProducts}</button>
                <button className="button button-text" onClick={() => selectHeroCollection()}>{t.sampleProducts}</button>
                <button className="button button-text" onClick={() => selectHeroCollection('game')}>{t.games}</button>
              </div>
              <div className="page-note">
                <p className="section-kicker">{pageNote.title}</p>
                <p>{pageNote.text}</p>
              </div>
            </div>
            <div className="hero-media">
              <div className="media-grid"></div>
              <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=90" alt="Lập trình trên màn hình máy tính" />
              <div className="hero-status"><span></span><div><b>{t.verified}</b><small>{t.digital}</small></div></div>
              <div className="fee-orb"><span>{t.fee}</span><b>0.50 USD</b></div>
            </div>
          </div>
        </section>

        <section className="search-region" id="explore">
          <div className="search-bar">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />
            <button onClick={() => document.getElementById(activePage === 'store' ? 'products' : activePage === 'seller' ? 'services' : activePage === 'buyer' ? 'wanted' : 'courses')?.scrollIntoView({ behavior: 'smooth' })}>{t.find}</button>
          </div>
          <div className="category-row">
            <span>{t.categories}</span>
            {categories[language].map((category) => <button key={category} onClick={() => setQuery(category)}>{category}</button>)}
            {hashtags.map((tag) => <button key={tag} className="tag-chip" onClick={() => setQuery(tag.replace('#', ''))}>{tag}</button>)}
          </div>
        </section>

        {activePage === 'store' ? (
          <section className="content-section products-section" id="products">
            <div className="section-heading">
              <div><p className="section-kicker">{t.delivery}</p><h2>{t.featured}</h2></div>
              <a href="#products">{t.viewAll} <b>↗</b></a>
            </div>
            <div className="product-category-picker" role="tablist" aria-label={t.categories}>
              {catalogCategoryOptions[language].map((category) => (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  className={activeCategory === category.id ? 'is-active' : ''}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {catalogStatus === 'loading' && <p className="catalog-note">{t.loadingProducts}</p>}
            {catalogStatus === 'error' && <p className="catalog-note is-warning">{t.catalogError}</p>}
            <div className="product-grid">
              {filteredProducts.length ? filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.title}
                  product={product}
                  language={language}
                  onSave={(wasSaved) => setSaved((count) => count + (wasSaved ? 1 : -1))}
                  onBuy={openBuyModal}
                  onTicket={openTicketModal}
                  onViewDescription={openDescriptionModal}
                  buyLabel={t.buyNow}
                  descriptionLabel={t.viewDescription}
                  ticketLabel={t.ticket}
                />
              )) : <p className="empty-state">{t.noResult}</p>}
            </div>
          </section>
        ) : null}

        {activePage === 'courses' ? <CourseLibrary language={language} /> : null}

        {activePage === 'seller' ? (
          <section className="seller-section" id="services">
            <div className="seller-intro">
              <p className="section-kicker">{t.services}</p>
              <h2>{t.servicesTitle}</h2>
              <p>{t.servicesText}</p>
              <button className="button button-secondary" onClick={() => setModal('listing')}>{t.sell}<b>↗</b></button>
            </div>
            <div className="seller-points">
              <article><span>01</span><h3>{t.fee}</h3><p>{t.feeText}</p></article>
              <article><span>02</span><h3>{t.verified}</h3><p>{language === 'en' ? 'New listings are checked before they appear on the site.' : 'Những bài đăng mới được kiểm tra trước khi xuất hiện trên trang.'}</p></article>
              <article><span>03</span><h3>{t.delivery}</h3><p>{language === 'en' ? 'Buyers and sellers connect directly and quickly.' : 'Người mua và người bán kết nối trực tiếp, nhanh chóng.'}</p></article>
            </div>
          </section>
        ) : null}

        {activePage === 'buyer' ? (
          <section className="content-section wanted-section" id="wanted">
            <div className="section-heading">
              <div><p className="section-kicker">{t.request}</p><h2>{t.requestTitle}</h2></div>
              <button className="button button-outline" onClick={() => setModal('request')}>+ {t.postRequest}</button>
            </div>
            <div className="request-feed">
              {requests.map((request, index) => (
                <article className="request-card" key={`${request.title}-${index}`}>
                  <div className="request-card-top">
                    <span className="request-avatar">{request.initials}</span>
                    <div className="request-author">
                      <strong>{request.title}</strong>
                      <time>{request.time}</time>
                    </div>
                  </div>
                  <p className="request-detail">{request.detail}</p>
                  <div className="request-meta">
                    <span className="request-budget">{request.budget}</span>
                    <button className="request-contact" aria-label={t.contactSeller}>{t.contactSeller} ↗</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer>
        <Logo />
        <p>{t.footer}</p>
        <span>{saved ? `${saved} ${t.saved}` : '© 2020 patricktechmedia.com'}</span>
      </footer>

      {notice && <div className="toast">{notice}</div>}

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label={t.close} onClick={() => setModal(null)}>×</button>
            {modal === 'ticket' ? (
              ticketCode ? (
                <div className="contact-sheet ticket-success">
                  <p className="section-kicker">{t.ticketSuccess}</p>
                  <h2>{t.ticketSuccess}</h2>
                  <p>{t.ticketSuccessText} <strong>{ticketCode}</strong></p>
                  <button className="button button-primary button-full" onClick={() => setModal(null)}>{t.close}</button>
                </div>
              ) : (
                <form onSubmit={submitTicket}>
                  <p className="section-kicker">{t.ticket}</p>
                  <h2>{t.ticketTitle}</h2>
                  <p className="ticket-intro">{t.ticketIntro}</p>
                  {selectedProduct ? <p className="contact-product ticket-selected-product">{language === 'en' ? (translatedTitles[String(selectedProduct.id || selectedProduct.path || selectedProduct.title)] || translateCatalogText(selectedProduct.title, 'en')) : selectedProduct.title}</p> : null}
                  <label>{t.ticketName}<input name="client_name" required autoComplete="name" /></label>
                  <label>{t.ticketContactType}<select name="contact_type" defaultValue="Telegram" required><option value="Telegram">Telegram</option><option value="Zalo">Zalo</option><option value="WhatsApp">WhatsApp</option><option value="Facebook">Facebook</option><option value="Gmail">Gmail</option><option value="Điện thoại">{language === 'en' ? 'Phone' : 'Điện thoại'}</option><option value="Khác">{language === 'en' ? 'Other' : 'Khác'}</option></select></label>
                  <label>{t.ticketContactInfo}<input name="contact_info" required placeholder={t.ticketContactPlaceholder} /></label>
                  <label>{t.ticketRequestType}<select name="request_type" defaultValue="new_task" required><option value="new_task">{t.ticketNewTask}</option><option value="warranty">{t.ticketWarranty}</option></select></label>
                  <label>{t.ticketDetails}<textarea name="details" required placeholder={t.ticketDetailsPlaceholder} defaultValue={selectedProduct ? `Product: ${selectedProduct.title}` : ''} /></label>
                  <button className="button button-primary button-full" type="submit" disabled={ticketSubmitting}>{ticketSubmitting ? t.ticketSending : t.ticketSend} <b>↗</b></button>
                </form>
              )
            ) : modal === 'listing' ? (
              <form onSubmit={submitListing}>
                <p className="section-kicker">{t.listing}</p>
                <h2>{t.servicesTitle}</h2>
                <label>{t.productName}<input required placeholder={t.productPlaceholder} /></label>
                <label>{t.price}<input required inputMode="numeric" value={sellPrice} onChange={(event) => setSellPrice(event.target.value)} /></label>
                <div className="fee-box"><span>{t.fee}</span><strong>{feeFor(priceInput).toFixed(2)} USD</strong><small>{t.feeText}</small></div>
                <button className="button button-primary button-full" type="submit">{t.submit} <b>↗</b></button>
              </form>
            ) : modal === 'request' ? (
              <form onSubmit={submitRequest}>
                <p className="section-kicker">{t.requested}</p>
                <h2>{t.requestIntro}</h2>
                <label>{t.requestName}<input name="title" required placeholder="Ví dụ: Source code bán hàng React" /></label>
                <label>{t.detail}<input name="detail" required placeholder="Tình trạng, yêu cầu, khu vực..." /></label>
                <label>{t.budget}<input name="budget" required placeholder="Ví dụ: 1 - 2 triệu" /></label>
                <button className="button button-primary button-full" type="submit">{t.postRequest} <b>↗</b></button>
              </form>
            ) : modal === 'description' ? (
              <div className="contact-sheet">
                <p className="section-kicker">{localizedCategory(selectedProduct, language)}</p>
                <h2>{t.viewDescription}</h2>
                <div className="product-detail-summary">
                  <img src={selectedProduct?.image} alt="" />
                  <div>
                    <p className="contact-product">{language === 'en' ? (translatedTitles[String(selectedProduct?.id || selectedProduct?.path || selectedProduct?.title)] || translateCatalogText(selectedProduct?.title, 'en')) : selectedProduct?.title}</p>
                    <dl className="detail-list">
                      <div><dt>{t.priceLabel}</dt><dd>{formatPrice(selectedProduct?.price, selectedProduct?.priceText, language)}</dd></div>
                      <div><dt>{t.sellerLabel}</dt><dd>{selectedProduct?.sellerName || 'Patrick Tech Media'}</dd></div>
                    </dl>
                  </div>
                </div>
                <div className="description-sheet">
                  {selectedProduct?.description
                    ? <CatalogDescription text={language === 'en'
                      ? (translatedCatalog[String(selectedProduct.id || selectedProduct.path || selectedProduct.title)] || 'Translating product details...')
                      : selectedProduct.description} />
                    : t.noDescription}
                </div>
                {selectedProduct?.path ? <a className="catalog-link" href={selectedProduct.path} target="_blank" rel="noreferrer">{t.catalogLink}</a> : null}
                <button className="button button-primary button-full" onClick={() => setModal('contact')}>{t.buyNow}</button>
              </div>
            ) : (
              <div className="contact-sheet">
                <p className="section-kicker">{localizedCategory(selectedProduct, language)}</p>
                <h2>{t.contactTitle}</h2>
                <p className="contact-product">{language === 'en' ? (translatedTitles[String(selectedProduct?.id || selectedProduct?.path || selectedProduct?.title)] || translateCatalogText(selectedProduct?.title, 'en')) : selectedProduct?.title}</p>
                <div className="contact-links">
                  <a className="button button-primary button-full" href={ZALO_LINK} target="_blank" rel="noreferrer">{t.zalo}</a>
                  <a className="button button-secondary button-full" href={TELEGRAM_LINK} target="_blank" rel="noreferrer">{t.telegram}</a>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}





