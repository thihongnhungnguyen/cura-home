# Nhà mình — mã frontend và backend

Ứng dụng quản gia gia đình và side project full stack. `frontend/` là React/Vite; `functions/api/[[path]].js` là Cloudflare Pages Function; `backend/src/` xử lý đăng nhập Google, dữ liệu D1, ảnh R2, Google Calendar, hồ sơ gia đình, cấu hình tài chính, ưu đãi và góp ý. Repository có thể đặt trên GitHub; Cloudflare Pages tự build/deploy mỗi lần push. **Không đưa khóa Google hoặc thông tin sức khỏe vào GitHub.**

**Mô tả GitHub đề xuất:** `Multilingual family hub: budgets, shared to-dos, wishlists, inventory, price watch and Google Calendar. Feedback welcome via the in-app form.`

Phản hồi từ người dùng: mở website, kéo xuống biểu mẫu **Góp ý cho dự án** ở trang đăng nhập. Góp ý được lưu trong D1, giới hạn 3 lần/ngày theo dấu vân tay IP băm; các tài khoản gia đình xem tại mục **Gia đình**. Không công khai email của người góp ý.

### Kỹ thuật và quyết định thiết kế

- **Frontend:** React + Vite; giao diện responsive, chuyển động CSS nhẹ và `prefers-reduced-motion`.
- **Backend:** Cloudflare Pages Functions với xác thực OAuth Google, cookie HttpOnly, kiểm tra email allowlist và Origin cho thao tác ghi.
- **Dữ liệu:** D1 cho bản ghi, hũ, thành viên, giá và góp ý; R2 cho ảnh; refresh token Google được mã hóa AES-GCM.
- **Chất lượng:** kiểm tra build, quyền truy cập, luồng đăng nhập, quy tắc 100% của các hũ, dữ liệu giá và biểu mẫu góp ý.

**Dòng CV gợi ý:** *Built a multilingual family operations app (React, Cloudflare Pages Functions, D1, R2, Google Calendar OAuth) with configurable budgeting, shared tasks, household inventory and price comparison; implemented access controls, encrypted tokens and API tests.*

## Chức năng hiện có

- Thu nhập, chi tiêu theo người/nhóm, 1–12 hũ tự đặt tên/màu/tỷ lệ với tổng 100%, claim, thuế, tiết kiệm, đánh dấu khoản chi lớn.
- Việc cần làm theo bố/mẹ/Shin hoặc các thành viên thêm vào; hồ sơ thành viên có ảnh đại diện, màu yêu thích, sở thích.
- Giao diện chọn Tiếng Việt, English, Français, Nederlands, Dansk. Tên mục và ghi chú do người dùng nhập được giữ nguyên ngôn ngữ ban đầu.
- Wishlist mua sắm (tag makeup, home decor, hobby…), du lịch và điều muốn làm; ghi giá mục tiêu và link.
- Lịch của bố/mẹ/Shin; xem sự kiện sắp tới từ Google Calendar; chủ động gửi lịch trong sổ lên Google Calendar. Sự kiện Google được đọc khi mở/làm mới trang, không tự sao chép vào sổ.
- Nhật ký chỉ số sức khỏe, tăng trưởng của Shin; kho thực phẩm, món quen, danh sách mua; ảnh tủ đồ và đồ trong nhà; tìm kiếm và cập nhật số lượng.
- Trợ lý tìm trong dữ liệu đã nhập, nhập giọng nói nếu trình duyệt hỗ trợ.
- Bảng giá do gia đình kiểm tra, tính giảm giá khi có giá thường và giá trên kg/l nếu biết quy cách; so với những món trong danh sách mua. Liên kết đến tờ rơi chính thức Netto, REMA 1000, føtex, Bilka. Có điểm kết nối feed giá tự động nếu bạn có nhà cung cấp dữ liệu phù hợp.

Chưa có Garmin tự động, OCR hóa đơn, GPT API, feed giá siêu thị mặc định, công thức tuổi sinh học hay thuật toán phối đồ. **Không hiển thị “giá rẻ nhất” khi thiếu dữ liệu cùng sản phẩm/quy cách hoặc giá chưa được kiểm chứng.** Ảnh đính kèm được lưu nguyên bản và chỉ tài khoản gia đình được phép truy cập.

## 1. Tạo repository và Cloudflare Pages

1. Tạo một repository **public** trên GitHub để dùng trong CV; chép toàn bộ nội dung thư mục này vào gốc repository và push. Chỉ mã nguồn và cấu hình mẫu xuất hiện công khai; dữ liệu API được khóa bằng đăng nhập. Không commit `.dev.vars`, khóa hay thông tin gia đình.
2. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → chọn repository. Build command: `npm run build`; output directory: `dist`; root directory: `/`. Chọn Node.js 22 nếu dashboard yêu cầu.
3. Ghi lại địa chỉ thật `https://<ten-du-an>.pages.dev`. Website mở được cho mọi người nhưng không xem được dữ liệu nếu email không có trong `ALLOWED_EMAILS`.

GitHub Pages đơn thuần chỉ lưu frontend tĩnh; không chạy được API an toàn, D1/R2 hoặc khóa OAuth. Vì vậy repository ở GitHub, trang chạy trên Cloudflare Pages.

## 2. Kho dữ liệu và ảnh

- Trong Cloudflare tạo một **D1 database**, ví dụ `family-hub-db`. Mở SQL Console của database và chạy nội dung `backend/migrations/0001_init.sql`, rồi `backend/migrations/0002_family_features.sql`, **mỗi file một lần và theo đúng thứ tự**. Cơ sở dữ liệu cũ chỉ cần chạy file `0002`.
- Tạo một **R2 bucket**, ví dụ `family-hub-images`.
- Trong dự án Pages → **Settings** → **Bindings**, thêm D1 binding tên chính xác `DB` và R2 bucket binding tên chính xác `BUCKET`. Áp dụng cho Production; thêm Preview nếu muốn kiểm tra nhánh preview. Deploy lại sau khi thiết lập bindings.

## 3. Google Calendar

1. Trong Google Cloud Console, tạo project và bật **Google Calendar API**.
2. Cấu hình OAuth consent screen. Trong giai đoạn Testing, thêm email của các thành viên vào Test users. Thêm các scope `openid`, `email`, `https://www.googleapis.com/auth/calendar.events`.
3. Tạo OAuth client loại **Web application**. Thêm **Authorized redirect URI** là chính xác `https://<ten-du-an>.pages.dev/api/auth/callback`. Nếu dùng tên miền riêng, thêm cả redirect URI tương ứng.
4. Trong Cloudflare Pages → **Settings** → **Variables and Secrets** cho Production:

| Tên | Giá trị | Loại |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | secret |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | secret |
| `ALLOWED_EMAILS` | `me@gmail.com,partner@gmail.com` (email thật của người được phép) | secret |
| `TOKEN_ENCRYPTION_KEY` | khóa 32 byte mã hóa base64 (`openssl rand -base64 32`) | secret |
| `FAMILY_CALENDAR_ID` | tùy chọn: ID của lịch Google dùng chung | text |
| `FEEDBACK_SALT` | chuỗi bí mật ngẫu nhiên để băm IP của biểu mẫu góp ý | secret |
| `SALES_FEED_URL` | tùy chọn: URL HTTPS của feed giá có phép sử dụng | secret |
| `SALES_FEED_TOKEN` | tùy chọn: token của nhà cung cấp feed | secret |

5. Deploy lại và mở website → **Đăng nhập bằng Google**. Nếu không đặt `FAMILY_CALENDAR_ID`, mỗi tài khoản xem và ghi trên lịch `primary` của chính họ. Nếu muốn cả nhà cùng thấy một lịch, tạo lịch phụ trong Google Calendar, chia sẻ quyền xem/chỉnh sửa cho những email trên, lấy **Calendar ID** trong Settings và đặt vào `FAMILY_CALENDAR_ID`. Những email này vẫn phải đăng nhập riêng và được Google cấp quyền.

**Lưu ý:** Với consent screen ở trạng thái Testing, refresh token cho scope Calendar thường hết hạn sau 7 ngày; bạn có thể phải đăng nhập lại. Để dùng lâu dài, chuyển ứng dụng sang In production và làm theo các yêu cầu xác minh Google áp dụng cho scope này. Không đưa Client Secret vào frontend hoặc GitHub.

## 4. Nguồn giá tự động (tùy chọn)

Ứng dụng **không tự trích giá từ HTML siêu thị** vì cấu trúc trang và điều kiện sử dụng thay đổi. Khi có API/giấy phép dữ liệu, đặt `SALES_FEED_URL` và `SALES_FEED_TOKEN`. Backend gọi URL đó và mong một JSON object dạng:

```json
{
  "items": [
    {
      "product": "Thịt lợn băm",
      "store": "Netto",
      "price": 25,
      "regular_price": 39.95,
      "size_label": "500 g",
      "url": "https://netto.dk/",
      "expiry_date": "2026-09-30",
      "observed_at": "2026-09-23"
    }
  ]
}
```

Feed là cấu hình của chủ website, tuyệt đối không nhận URL tùy ý từ trình duyệt. Nếu chưa có feed, gia đình có thể nhập giá sau khi kiểm tra tờ rơi. Giá trong các cửa hàng có thể khác nhau; luôn xem nguồn và hạn dùng.

## 5. Chạy và kiểm tra mã

```bash
npm ci
npm run check
npm test
npm run build
```

Để chạy API tại máy, tạo `.dev.vars` dựa trên `.dev.vars.example` và cấu hình D1/R2 local bằng Wrangler Pages; Google OAuth Web client phải có redirect URI local được Google chấp nhận. Lệnh `npm run dev` chỉ chạy frontend và chuyển `/api` tới cổng `8788` nếu bạn đã chạy Pages Functions local ở cổng đó. Đừng nhập dữ liệu thật trên một bản dev chưa cấu hình an toàn.

## Lưu ý vận hành

- Mọi email trong `ALLOWED_EMAILS` cùng chỉnh sửa một kho dữ liệu gia đình. Chỉ thêm người bạn tin cậy.
- Thêm hồ sơ thành viên trong giao diện **không tự cấp quyền đăng nhập**; chỉ `ALLOWED_EMAILS` ở backend cấp quyền.
- Phiên đăng nhập có hiệu lực tối đa 30 ngày; refresh token Google được mã hóa bằng AES-GCM trong D1. Giữ `TOKEN_ENCRYPTION_KEY` ổn định và sao lưu riêng. Thay khóa mà không chuyển đổi token sẽ yêu cầu mọi người kết nối Google lại.
- Một sự kiện tạo trong sổ chỉ được gửi sang Google khi bạn nhấn biểu tượng lịch trên mục đó. Các sửa đổi sau đó trong sổ **không tự cập nhật** sự kiện Google; xóa mục trong sổ **không xóa** sự kiện Google.
- Frontend có chuyển động CSS nhẹ và tôn trọng cài đặt giảm chuyển động của thiết bị. Cloudflare Pages phục vụ tài nguyên tĩnh trên mạng phân phối toàn cầu; hiệu ứng phụ thuộc nhiều vào CSS/thiết bị hơn là gói hosting.
