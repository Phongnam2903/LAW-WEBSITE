# Kế Hoạch Triển Khai: AI Trợ Lý Pháp Lý Cho Khách Hàng (Customer AI Agent)

> **Dự án:** Website & Hệ thống Quản trị — Công ty Luật Hợp danh Nghiệp Hưng  
> **Nhánh phát triển:** `feature/ai_agent_customer`  
> **Phiên bản:** v1.0  
> **Cập nhật lần cuối:** 2026-10-14  

---

## 1. Tổng Quan & Mục Tiêu

Hệ thống AI Trợ lý Pháp lý phục vụ trực tiếp cho **khách hàng (cá nhân và doanh nghiệp)** khi truy cập vào website của Công ty Luật Hợp danh Nghiệp Hưng. 

### Các mục tiêu chính:
1. **Tư vấn sơ bộ 24/7:** Giải đáp quy định pháp luật nhanh chóng, chính xác, có dẫn chiếu Điều/Khoản luật Việt Nam cụ thể, tuyệt đối không bịa đặt hoặc suy đoán.
2. **Sàng lọc & Định hướng vụ việc (Intake & Triage):** Giúp khách hàng nắm rõ quy định, thủ tục cần làm, hồ sơ giấy tờ cần chuẩn bị và nhận diện rủi ro pháp lý.
3. **Chuyển đổi thành Lịch hẹn Luật sư (Lead Conversion):** Đóng vai trò là cầu nối thông minh, tự động tóm tắt vụ việc và hỗ trợ khách hàng đặt lịch tư vấn trực tiếp với luật sư của Công ty Luật Hợp danh Nghiệp Hưng.
4. **Bảo mật & Trách nhiệm nghề nghiệp:** Đảm bảo đặc quyền bảo mật thông tin thân chủ và tuyên bố miễn trừ trách nhiệm (Disclaimer) minh bạch theo quy định của Luật Luật sư.

---

## 2. Danh Sách Công Việc & Tiến Độ (Checklist)

### 📌 Giai Đoạn 0: Khởi Tạo & Chuẩn Hóa Nhận Diện Thương Hiệu
- [x] **0.1.** Tạo và kích hoạt nhánh git `feature/ai_agent_customer` đồng bộ lên GitHub repository.
- [x] **0.2.** Chuẩn hóa tên thương hiệu trên toàn bộ mã nguồn: **"Công ty Luật Hợp danh Nghiệp Hưng"** (thương hiệu hiển thị: **"Luật Nghiệp Hưng"** / **"Trợ lý Pháp lý AI Nghiệp Hưng"**).
- [x] **0.3.** Cập nhật toàn bộ metadata SEO (`layout.tsx`, `register`, `login`, `consultation`, `chat`, `forgot-password`).
- [x] **0.4.** Tích hợp thành công mô hình `gemini-3.5-flash-lite` siêu tốc kết hợp cơ chế Hybrid Fallback về Ollama cục bộ.

---

### 📌 Giai Đoạn 1: Mở Rộng Dữ Liệu Pháp Luật & Hoàn Thiện "Bộ Não" RAG
- [ ] **1.1. Bổ sung dữ liệu văn bản pháp luật thiết yếu cho khách hàng:**
  - [x] *Đã có:* Luật Doanh nghiệp 2020 (Số 59/2020/QH14)
  - [x] *Đã có:* Bộ luật Lao động 2019 (Số 45/2019/QH14)
  - [ ] *Bổ sung:* **Luật Đất đai 2024 (Số 31/2024/QH15)** — cấp sổ đỏ, tranh chấp đất đai, bồi thường, chuyển nhượng.
  - [ ] *Bổ sung:* **Bộ luật Dân sự 2015 (Số 91/2015/QH14)** — giao dịch dân sự, hợp đồng, thừa kế, bồi thường thiệt hại.
  - [ ] *Bổ sung:* **Luật Hôn nhân và Gia đình 2014 (Số 52/2014/QH13)** — ly hôn thuận tình/đơn phương, quyền nuôi con, phân chia tài sản chung.
- [ ] **1.2. Xử lý dữ liệu & Index Vector Embeddings:**
  - [ ] Chuẩn hóa văn bản thành cấu trúc JSON chunking theo Điều/Khoản (`legal_document.py`).
  - [ ] Tạo vector embeddings (`nomic-embed-text`) và cập nhật bộ nhớ cache `vector_index_cache.json`.
- [ ] **1.3. Nâng cấp nhận diện Ý định (Intent Classification):**
  - [ ] Mở rộng `intent.py` nhận diện chính xác các nhóm câu hỏi: Doanh nghiệp, Lao động, Đất đai, Dân sự, Hôn nhân gia đình, Chi phí & Thủ tục luật sư.
  - [ ] Bổ sung ý định "cần gặp luật sư / đặt lịch tư vấn" để chủ động kích hoạt Call-To-Action.
- [ ] **1.4. Tối ưu hóa Persona & System Prompt:**
  - [ ] Chuẩn hóa giọng văn: Thân thiện, chuẩn mực, dễ hiểu đối với người dân và chủ doanh nghiệp.
  - [ ] Cấu trúc câu trả lời 4 phần:
    1. *Kết luận & Hướng dẫn trực diện*
    2. *Căn cứ điều luật áp dụng*
    3. *Đoạn trích dẫn nguyên văn*
    4. *Khuyến nghị & Cảnh báo từ Luật Nghiệp Hưng*

---

### 📌 Giai Đoạn 2: Tích Hợp Kết Nối Trực Tiếp Frontend $\leftrightarrow$ Backend AI Agent
- [ ] **2.1. Xây dựng Next.js Route Handler / BFF:**
  - [ ] Tạo endpoint `frontend/src/app/api/agent/chat/route.ts` đóng vai trò proxy bảo mật kết nối với FastAPI `http://localhost:8000/api/v1/chat`.
  - [ ] Bổ sung biến môi trường `AI_AGENT_URL` vào cấu hình Next.js (`env.ts`).
  - [ ] Xử lý timeout, error handling và fallback thông minh nếu dịch vụ AI đang khởi động lại.
- [ ] **2.2. Đấu nối thực tế vào ChatbotWidget (Widget nổi ở góc màn hình):**
  - [ ] Thay thế hàm giả lập `setTimeout` + `chatbot-data.ts` bằng lệnh gọi API `/api/agent/chat`.
  - [ ] Hiển thị trạng thái "Đang tra cứu cơ sở pháp lý..." sinh động.
  - [ ] Hiển thị danh sách căn cứ pháp lý (Citations tags) chính xác trả về từ AI.
- [ ] **2.3. Đấu nối thực tế vào ChatPageSection (Trang /chat chuyên sâu):**
  - [ ] Kết nối toàn diện giao diện `/chat` với API backend AI Agent.
  - [ ] Hiển thị phân tích nội bộ (Analysis metadata) và nguồn luật đã đối chiếu.
  - [ ] Thêm nút thao tác nhanh: Sao chép câu trả lời, Đặt lịch tư vấn từ câu trả lời này.

---

### 📌 Giai Đoạn 3: Tính Năng Trải Nghiệm Khách Hàng (Customer Experience & Conversion)
- [ ] **3.1. Cầu nối Đặt lịch Tư vấn 1-Click (1-Click Consultation Bridge):**
  - [ ] Khi AI giải đáp xong hoặc nhận diện câu hỏi phức tạp, hiển thị nút bấm: *"Đặt lịch Luật sư tư vấn vụ việc này"*.
  - [ ] Tự động chuyển hướng sang trang `/consultation` kèm theo các tham số pre-fill: Lĩnh vực vụ việc, Tóm tắt nội dung câu hỏi và phân tích ban đầu của AI vào ô ghi chú.
- [ ] **3.2. Quản lý Phiên & Lưu trữ Lịch sử Hội thoại:**
  - [ ] Lưu lịch sử cuộc trò chuyện an toàn trên trình duyệt khách hàng (`localStorage`).
  - [ ] Hỗ trợ tạo "Cuộc trò chuyện mới" và xóa lịch sử khi cần.
  - [ ] Đồng bộ ngữ cảnh phiên làm việc để AI có thể hiểu các câu hỏi nối tiếp của khách.
- [ ] **3.3. Tải / Xuất Biên Bản Tư Vấn Sơ Bộ:**
  - [ ] Bổ sung nút "Tải biên bản tóm tắt tư vấn" (định dạng tệp văn bản .txt hoặc file in ấn) để khách lưu trữ hoặc mang đến văn phòng cho luật sư thẩm định.
- [ ] **3.4. Thẻ Gợi Ý Nhu Cầu Thực Tế (Quick Starter Prompts):**
  - [ ] Cập nhật danh sách câu hỏi nhanh theo 4 lĩnh vực trọng tâm:
    - *Đất đai:* Mua bán nhà đất chưa có sổ, thủ tục sang tên, tranh chấp ranh giới.
    - *Doanh nghiệp:* Thành lập công ty, chậm góp vốn điều lệ, thay đổi người đại diện.
    - *Lao động:* Sa thải trái luật, thời hạn báo trước, trợ cấp thôi việc.
    - *Hôn nhân:* Thủ tục ly hôn đơn phương, tranh chấp quyền nuôi con dưới 36 tháng tuổi.

---

### 📌 Giai Đoạn 4: Hàng Rào An Toàn (Guardrails), Tuyên Bố Pháp Lý & Kiểm Thử
- [ ] **4.1. Hàng rào An toàn (Safety Guardrails):**
  - [ ] Chặn các yêu cầu vi phạm pháp luật (hướng dẫn trốn thuế, lừa đảo, làm giả giấy tờ...).
  - [ ] Cảnh báo người dùng khi có dấu hiệu lừa đảo mạo danh cơ quan tư pháp/công an.
- [ ] **4.2. Tuyên bố Miễn trừ Trách nhiệm (Legal Disclaimer):**
  - [ ] Hiển thị thông báo minh bạch: *"Thông tin do Trợ lý AI cung cấp mang tính chất tham khảo, định hướng sơ bộ. Để có văn bản ý kiến pháp lý chính thức có giá trị ràng buộc, Quý khách vui lòng đặt lịch làm việc trực tiếp với Luật sư của Công ty Luật Hợp danh Nghiệp Hưng."*
- [ ] **4.3. Kiểm thử Tự động & Tối ưu Hiệu năng:**
  - [ ] Chạy kiểm tra Frontend: `npm run lint` & `npm run typecheck` đạt 0 lỗi.
  - [ ] Chạy kiểm tra AI Agent: `ruff check src/ tests/` đạt chuẩn PEP 8 & Python 3.11+.
  - [ ] Kiểm thử thời gian phản hồi: Đảm bảo thời gian sinh câu trả lời luôn $\le 2$ giây.
  - [ ] Kiểm thử E2E: Quy trình từ lúc khách hàng hỏi trên Chatbot Widget $\rightarrow$ Sang trang `/chat` $\rightarrow$ Chuyển dữ liệu sang trang Đặt lịch `/consultation`.

---

## 3. Kiến Trúc Kỹ Thuật (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                   TRÌNH DUYỆT KHÁCH HÀNG                   │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ ChatbotWidget (Góc)   │       │ Trang /chat (Toàn màn)│  │
│  └───────────┬───────────┘       └───────────┬───────────┘  │
└──────────────┼───────────────────────────────┼──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (NEXT.JS APP ROUTER)               │
│             Route Handler Proxy: /api/agent/chat            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP POST (port 8000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND AI AGENT (FASTAPI)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Intent Router (Phân loại ý định & Guardrails)       │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 2. Hybrid Legal RAG Engine (Nghiệp Hưng Corpus)       │  │
│  │    - Doanh nghiệp 2020    - Lao động 2019             │  │
│  │    - Đất đai 2024        - Dân sự 2015 & HNGĐ 2014   │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 3. LLM Inference Layer (Google Gemini Flash-lite)     │  │
│  │    Fallback tự động: Ollama Local (nếu mất mạng)      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Nhật Ký Tiến Độ (Progress Log)

| Ngày | Giai đoạn | Nội dung đã hoàn thành | Người thực hiện |
| :--- | :--- | :--- | :--- |
| **2026-10-14** | Giai đoạn 0 | Tạo nhánh `feature/ai_agent_customer`. Đồng bộ tên "Công ty Luật Hợp danh Nghiệp Hưng" toàn hệ thống. Sửa lỗi CI lint. Tích hợp Gemini 3.5 Flash-lite. Khởi tạo tài liệu kế hoạch chi tiết. | Pair Programming |
| *Tiếp theo* | Giai đoạn 2 & 1 | Xây dựng Route Handler Proxy `/api/agent/chat` và đấu nối trực tiếp Widget + Trang `/chat` vào API thật. | Pair Programming |
