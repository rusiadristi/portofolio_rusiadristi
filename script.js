/**
 * Portfolio JavaScript
 * Interactive functionalities including language switcher, typewriter effect,
 * mobile drawer menu, dynamic project detail modal with image carousel slider,
 * CV viewer modal, and lightbox image previewer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year for Footer Copyright
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. High-Performance Scroll Controller (Navbar & ScrollSpy)
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    let isScrollTicking = false;

    const handleScrollThrottled = () => {
        const scrollY = window.scrollY;

        // Navbar scrolled state (with null check)
        if (navbar) {
            if (scrollY > 40) {
                if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
            } else {
                if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
            }
        }

        // ScrollSpy (only runs if page has sections)
        if (sections.length > 0) {
            const scrollPos = scrollY + 180;
            let currentId = '';

            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    currentId = sec.getAttribute('id');
                    break;
                }
            }

            if (currentId) {
                navLinks.forEach(link => {
                    const match = link.getAttribute('href') === `#${currentId}`;
                    link.classList.toggle('active', match);
                });

                mobileNavLinks.forEach(link => {
                    const match = link.getAttribute('href') === `#${currentId}`;
                    link.classList.toggle('active', match);
                });
            }
        }

        isScrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(handleScrollThrottled);
            isScrollTicking = true;
        }
    }, { passive: true });
    handleScrollThrottled();

    // 3. Mobile Hamburger Menu Drawer Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMobileMenu = (open) => {
        if (open) {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => toggleMobileMenu(true));
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // 5. Initialize Typewriter Effect
    initTypewriter();

    // 6. Initialize Language Preference
    const savedLang = localStorage.getItem('portfolio_preferred_lang') || 'id';
    setLang(savedLang);

    // 7. Keyboard Navigation (Escape key to close modals, Arrow keys for carousel)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCVModal();
            closeProjectModal();
            closeImageModal();
            toggleMobileMenu(false);
        } else if (e.key === 'ArrowLeft') {
            const projectModal = document.getElementById('projectModal');
            if (projectModal && projectModal.style.display === 'block') {
                moveSlide(-1);
            }
        } else if (e.key === 'ArrowRight') {
            const projectModal = document.getElementById('projectModal');
            if (projectModal && projectModal.style.display === 'block') {
                moveSlide(1);
            }
        }
    });
});

/* ==========================================================================
   BILINGUAL TRANSLATION (ID / EN)
   ========================================================================== */
function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('portfolio_preferred_lang', lang);

    const btnId = document.getElementById('btn-id');
    const btnEn = document.getElementById('btn-en');

    if (lang === 'id') {
        if (btnId) btnId.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
    } else {
        if (btnEn) btnEn.classList.add('active');
        if (btnId) btnId.classList.remove('active');
    }

    // Refresh Project Modal if currently open
    const projectModal = document.getElementById('projectModal');
    if (projectModal && projectModal.style.display === 'block' && window.activeProjectId) {
        openProjectModal(window.activeProjectId);
    }
}

/* ==========================================================================
   TYPEWRITER ANIMATION EFFECT
   ========================================================================== */
function initTypewriter() {
    const typewriterSpan = document.getElementById('typewriter');
    if (!typewriterSpan) return;

    const isBusinessPage = window.location.pathname.toLowerCase().includes('administrasi') || document.title.toLowerCase().includes('administrasi');

    const wordsId = isBusinessPage 
        ? ["Administrasi Perkantoran", "Tata Kelola Kearsipan", "Spreadsheet Specialist", "Pengolahan & Validasi Data", "Laporan Operasional Bisnis"]
        : ["Web Development", "IT Business Analyst", "System Analysis", "UI/UX Design", "Mobile Development"];

    const wordsEn = isBusinessPage
        ? ["Office Administration", "Records Governance", "Spreadsheet Specialist", "Data Validation & Audit", "Business Operations Reporting"]
        : ["Web Development", "IT Business Analyst", "System Analysis", "UI/UX Design", "Mobile Development"];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentLang = document.documentElement.getAttribute('data-lang') || 'id';
        const words = currentLang === 'id' ? wordsId : wordsEn;
        const currentWord = words[wordIndex % words.length];

        if (isDeleting) {
            typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed = 50;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   PROJECTS DATA REPOSITORY (BILINGUAL & CAROUSEL ASSETS)
   ========================================================================== */
const projectsData = {
    sweetandcrust: {
        titleId: "Sistem POS & Bakery Management – Sweet & Crust (UI/UX Design)",
        titleEn: "Bakery POS & Management System – Sweet & Crust (UI/UX Design)",
        tags: [
            "Figma", "UI/UX Design", "Point of Sale (POS)", "Product Planning", 
            "Market Research", "Bakery Management Concept", "Interactive Prototype"
        ],
        images: [
            "gambar/sweet-and-crust.jpg",
            "gambar/sc-login.png",
            "gambar/sc-registrasi.png",
            "gambar/sc-katalog.png",
            "gambar/sc-laporan-omzet.png",
            "gambar/sc-kelola-katalog-mobile.png",
            "gambar/sc-kelola-staf-mobile.png"
        ],
        descId: `
            <p>Sweet & Crust merupakan konsep platform <em>Point of Sale (POS) & Management for Modern Bakeries</em> berbasis mobile yang dirancang di Figma untuk mendukung modernisasi operasional toko roti. Proyek ini mencakup perancangan antarmuka pengguna (UI/UX), riset kebutuhan operasional toko bakery, penyusunan alur kasir terintegrasi (<em>seamless cashier interface</em>), serta perencanaan fitur pelaporan omzet real-time dan manajemen multi-user role. Solusi yang dirancang bertujuan membantu pemilik bakery dan staf dalam efisiensi pencatatan transaksi, katalog varian kue, pengelolaan stok, dan pemantauan performa bisnis secara terintegrasi.</p>
            <br>
            Peran Saya:
            <ul>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Business Analyst</li>
                <li>Market Researcher</li>
                <li>Information Architecture & User Flow Designer</li>
                <li>Interactive Prototyping (Figma)</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Perancangan Desain POS Bakery Modern: Berhasil merancang antarmuka UI/UX aplikasi Point of Sale toko roti modern yang intuitif, mencakup alur kasir cepat, katalog menu dinamis, dan sistem cetak struk digital.</li>
                <li>High-Fidelity Prototype & Design System: Menghasilkan komponen desain yang konsisten, wireframe detail, dan prototipe interaktif lengkap di Figma untuk simulasi transaksi dan pengujian pengguna.</li>
                <li>Solusi Digitalisasi Manajemen Toko Roti: Merancang konsep pelaporan omzet real-time, manajemen tim multi-role, dan pemantauan stok untuk meningkatkan efisiensi operasional bisnis bakery.</li>
            </ul>
        `,
        descEn: `
            <p>Sweet & Crust is a mobile <em>Point of Sale (POS) & Management for Modern Bakeries</em> concept platform designed in Figma to accelerate the digital transformation of bakery store operations. The project encompasses user interface & user experience (UI/UX) design, bakery workflow market research, seamless cashier interface structuring, real-time revenue analytics planning, and multi-user role management. The solution aims to empower bakery owners and staff with streamlined order handling, cake catalog management, live inventory tracking, and integrated business insights.</p>
            <br>
            My Key Roles:
            <ul>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Business Analyst</li>
                <li>Market Researcher</li>
                <li>Information Architecture & User Flow Designer</li>
                <li>Interactive Prototyping (Figma)</li>
            </ul>
            <br>
            Key Achievements & Outcomes:
            <ul>
                <li>Modern Bakery POS Design: Successfully designed an intuitive UI/UX for a modern bakery Point of Sale system featuring fast cashier workflows, dynamic menu catalogs, and digital receipt printing.</li>
                <li>High-Fidelity Prototype & Design System: Created a consistent design system, high-fidelity wireframes, and a comprehensive interactive prototype in Figma for usability testing and user flow simulation.</li>
                <li>Digitalization Solution for Bakery Management: Conceptualized real-time revenue reporting, multi-user role administration, and inventory monitoring to elevate operational efficiency for bakery businesses.</li>
            </ul>
        `,
        featuresId: [
            "Seamless Kasir Interface (Transactions): Antarmuka kasir cepat dan mudah untuk pencatatan transaksi pesanan dine-in & takeaway.",
            "Realtime Sales Reports (Dashboards): Dasbor laporan omzet real-time dan visualisasi grafik tren penjualan 7 hari terakhir.",
            "Online Product Catalog (Cake Management): Katalog produk kue interaktif dengan kontrol varian, harga, dan ketersediaan stok.",
            "Multi-user Roles (Staff & Admin): Pemisahan hak akses kerja yang aman antara Admin (manajemen & laporan) dan Kasir (transaksi).",
            "Easy Bakery Accounting & Print Struk: Rekap histori transaksi otomatis dan detail transaksi dengan fitur cetak struk kasir.",
            "Manajemen Tim & Pengelolaan Stok: Pengawasan operasional staf toko dan monitoring stok ketersediaan kue."
        ],
        featuresEn: [
            "Seamless Cashier Interface (Transactions): Fast and intuitive POS cashier order logging for dine-in and takeaway.",
            "Realtime Sales Reports (Dashboards): Real-time revenue reports and 7-day sales trend visualization graphs.",
            "Online Product Catalog (Cake Management): Interactive cake product catalog with variant, pricing, and stock status control.",
            "Multi-user Roles (Staff & Admin): Role-based access control strictly separating Admin and Cashier permissions.",
            "Easy Bakery Accounting & Receipt Printing: Automated transaction history recaps and instant receipt printing.",
            "Team Management & Stock Control: Store staff operational oversight and live cake inventory monitoring."
        ]
    },
    waroengngemil: {
        titleId: "Sistem Kasir & Pemesanan F&B – Waroeng Ngemil (Mobile Programming)",
        titleEn: "F&B POS & Ordering System – Waroeng Ngemil (Mobile Programming)",
        tags: [
            "Flutter", "Dart", "Firebase Auth", "Realtime Database", 
            "Cloud Storage", "Point of Sale (POS)", "Mobile Programming", "UI/UX Design"
        ],
        images: [
            "gambar/waroeng-ngemil.png",
            "gambar/wn-welcome.png",
            "gambar/wn-login.png",
            "gambar/wn-registrasi.png",
            "gambar/wn-kasir-home.png",
            "gambar/wn-produk.png",
            "gambar/wn-produk-2.png",
            "gambar/wn-keranjang.png",
            "gambar/wn-pembayaran-metode.png",
            "gambar/wn-pembayaran.png",
            "gambar/wn-struk.png"
        ],
        descId: `
            <p>Sistem Kasir dan Pemesanan F&B Waroeng Ngemil merupakan aplikasi mobile berbasis Flutter dan Firebase untuk mengoptimalkan operasional transaksi kuliner secara digital. Sistem ini mengintegrasikan pemilihan katalog menu dinamis, autentikasi akun kasir terenkripsi, manajemen keranjang pesanan interaktif, kalkulasi otomatis subtotal dan pajak, hingga penerbitan struk transaksi digital (paperless) secara real-time.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Full-Stack Mobile Developer (Flutter, Dart, Firebase)</li>
                <li>Mobile UI/UX Designer & Prototyper (Mobile-First Experience)</li>
                <li>Cloud Database & Authentication Architect (Firebase)</li>
                <li>Mobile State Management & Business Logic Engineer</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Digitalisasi Alur Transaksi Kasir: Mentransformasi pencatatan pesanan manual ke aplikasi mobile POS untuk meminimalkan antrean dan mempercepat checkout pesanan.</li>
                <li>Integrasi Cloud Backend (Firebase): Mengamankan autentikasi kasir serta menyinkronkan data katalog produk dan transaksi secara instan via cloud realtime database.</li>
                <li>Kalkulasi Pesanan Presisi: Mengembangkan keranjang belanja reaktif dengan kalkulasi otomatis subtotal, diskon, pajak, dan kembalian secara akurat tanpa redundansi data.</li>
                <li>Struk Transaksi Digital (Paperless): Menghasilkan bukti pembayaran digital instan berbasis kode transaksi unik guna meningkatkan efisiensi dan transparansi operasional.</li>
            </ul>
        `,
        descEn: `
            <p>The Waroeng Ngemil F&B POS and Ordering System is a mobile application built with Flutter and Firebase designed to optimize digital culinary transactions. The platform integrates dynamic menu catalogs, encrypted cashier authentication, interactive cart management, automated subtotal and tax calculations, and instant paperless digital receipt generation in real-time.</p>
            <br>
            My Key Roles:
            <ul>
                <li>Full-Stack Mobile Developer (Flutter, Dart, Firebase)</li>
                <li>Mobile UI/UX Designer & Prototyper (Mobile-First Experience)</li>
                <li>Cloud Database & Authentication Architect (Firebase)</li>
                <li>Mobile State Management & Business Logic Engineer</li>
            </ul>
            <br>
            Key Achievements:
            <ul>
                <li>Operational Cashier Digitalization: Streamlined manual order taking into a mobile POS app, reducing queue times and accelerating checkout.</li>
                <li>Serverless Cloud Integration (Firebase): Secured cashier authentication and synchronized menu catalogs and transaction data in real-time.</li>
                <li>Accurate Order Calculation: Engineered a reactive cart computing subtotals, discounts, taxes, and change accurately without data redundancy.</li>
                <li>Paperless Digital Receipts: Generated instant digitized payment receipts with unique transaction IDs for operational efficiency.</li>
            </ul>
        `,
        featuresId: [
            "Katalog Menu & Produk Dinamis: Pengelolaan dan penataan daftar menu kuliner secara fleksibel.",
            "Autentikasi Kasir (Firebase Auth): Sistem verifikasi login akun kasir yang terenkripsi dan aman.",
            "Keranjang Pesanan Interaktif: Penambahan, pengurangan, dan penyesuaian item menu secara responsif.",
            "Kalkulasi Total Otomatis: Perhitungan tagihan pesanan, pajak, diskon, hingga uang kembalian secara presisi.",
            "Struk Digital Real-Time: Pembuatan tanda bukti transaksi digital tanpa kertas (paperless) sesaat setelah pembayaran selesai."
        ],
        featuresEn: [
            "Dynamic Menu Catalog: Flexible organization and presentation of food & beverage listings.",
            "Cashier Authentication (Firebase Auth): Secure, encrypted cashier account authorization.",
            "Interactive Order Cart: Responsive real-time increment, decrement, and item adjustments.",
            "Automated Bill Calculation: Accurate calculation of subtotal, discounts, taxes, and change.",
            "Real-Time Digital Receipt: Instant paperless digital proof of payment generated upon checkout."
        ]
    },
    goswift: {
        titleId: "Platform E-Tiket Bus GoSwift (GEMASTIK XVIII & EA IX)",
        titleEn: "Platform E-Tiket Bus GoSwift (GEMASTIK XVIII & EA IX)",
        tags: [
            "Figma", "Business Model Canvas (BMC)", "UI/UX Design", 
            "Market Research", "Fintech Integration Concept", 
            "Digital Payment System", "Product Planning"
        ],
        images: [
            "gambar/goswift.png"
        ],
        descId: `
            <p>GoSwift merupakan konsep platform penjualan tiket bus AKDP berbasis digital yang dirancang untuk mendukung transformasi digital transportasi darat di Sumatera Barat. Proyek ini mencakup penyusunan Business Model Canvas (BMC), market research, business plan, strategi monetisasi, serta perancangan UI/UX aplikasi. Solusi yang dirancang bertujuan membantu perusahaan otobus dalam digitalisasi penjualan tiket, manajemen kursi, pembayaran digital, serta pelaporan operasional secara terintegrasi untuk meningkatkan efisiensi layanan dan operasional bisnis.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Business Analyst</li>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Market Researcher</li>
                <li>Business Model Canvas (BMC) Development</li>
                <li>Business Plan Development</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Entrepreneurship Award IX (Rencana Bisnis): Berhasil mempresentasikan inovasi ini di hadapan dewan juri nasional dan terpilih sebagai finalis.</li>
                <li>GEMASTIK XVIII (Pengembangan Bisnis TIK): Berhasil menghasilkan Business Model Canvas, analisis pasar, dan strategi monetisasi untuk mendukung pengembangan platform GoSwift.</li>
                <li>Solusi digitalisasi transportasi darat AKDP di wilayah Sumatera Barat.</li>
            </ul>
        `,
        descEn: `
            <p>GoSwift is a digital AKDP bus ticketing platform concept designed to accelerate the digital transformation of land passenger transport in West Sumatra. The project encompasses Business Model Canvas (BMC) formulation, market research, business plan development, monetization strategy, and comprehensive UI/UX application design. The designed solution aims to assist bus operators in digitizing ticket sales, seat management, digital payments, and integrated operational reporting to enhance service efficiency and business operations.</p>
            <br>
            My Roles:
            <ul>
                <li>Business Analyst</li>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Market Researcher</li>
                <li>Business Model Canvas (BMC) Development</li>
                <li>Business Plan Development</li>
            </ul>
            <br>
            Achievements:
            <ul>
                <li>Entrepreneurship Award IX (Business Plan): Successfully pitched the innovation before the national jury panel and selected as a finalist.</li>
                <li>GEMASTIK XVIII (ICT Business Development): Successfully formulated Business Model Canvas, market analysis, and monetization strategy to support GoSwift platform development.</li>
                <li>Digitalization solution for AKDP intercity land transport across West Sumatra.</li>
            </ul>
        `,
        featuresId: [
            "Pemesanan Tiket Online: Pemesanan tiket bus AKDP secara online.",
            "Jadwal & Rute Real-Time: Informasi jadwal, rute, dan ketersediaan kursi secara real-time.",
            "Pemilihan Kursi Interaktif: Pemilihan kursi interaktif.",
            "E-Ticket Berbasis QR Code: E-Ticket berbasis QR Code.",
            "Pembayaran Digital: Pembayaran digital (QRIS, E-Wallet, Virtual Account, Transfer Bank).",
            "Dashboard Laporan Operasional: Dashboard laporan penjualan dan operasional.",
            "Sistem Notifikasi: Sistem notifikasi perjalanan dan status pemesanan.",
            "Manajemen Data Pelanggan: Manajemen data pelanggan dan analisis transaksi."
        ],
        featuresEn: [
            "Online Ticket Booking: Online booking for AKDP bus tickets.",
            "Real-Time Schedule & Route: Real-time schedule, route, and seat availability information.",
            "Interactive Seat Selection: Interactive seat selection layout.",
            "QR Code E-Ticket: QR Code-based digital E-Ticket.",
            "Digital Payments: Digital payment integration (QRIS, E-Wallet, Virtual Account, Bank Transfer).",
            "Operational Dashboard: Sales and operational reporting dashboard.",
            "Trip Notification System: Travel alerts and order status notifications.",
            "Customer Data Management: Customer data management and transaction analytics."
        ]
    },
    grafikajaya: {
        titleId: "Sistem Informasi Manajemen Percetakan & Penjualan – PT. Grafika Jaya Sumbar (Skripsi)",
        titleEn: "Printing & Sales Management System – PT. Grafika Jaya Sumbar (Thesis)",
        tags: [
            "PHP Native (OOP)", "MySQL", "HTML5 & CSS3", "JavaScript & jQuery", 
            "Bootstrap", "Chart.js", "DataTables", "SweetAlert", "Point of Sale (POS)"
        ],
        images: [
            "gambar/grafika-jaya-sumbar.png",
            "gambar/gj-dashboard.png",
            "gambar/gj-produk.png",
            "gambar/gj-pesanan.png",
            "gambar/gj-pos.png",
            "gambar/gj-laporan.png",
            "gambar/gj-pengguna.png",
            "gambar/gj-pengaturan.png"
        ],
        descId: `
            <p>Sistem Informasi Manajemen Percetakan dan Penjualan pada PT. Grafika Jaya Sumbar merupakan solusi digital berbasis web (PHP Native OOP & MySQL) untuk mengatasi kendala pencatatan manual operasional percetakan. Sistem ini mengintegrasikan manajemen inventaris produk, modul kasir Point of Sale (POS) dengan kalkulasi PPN 11%, alur verifikasi bukti pembayaran digital, hingga penyusunan laporan keuangan otomatis dan visualisasi tren penjualan real-time.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Full-Stack Web Developer (PHP Native OOP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Dashboard Analytics Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Digitalisasi Alur Transaksi: Mentransformasi pencatatan konvensional ke sistem POS digital untuk meminimalkan <em>human error</em> serta mengotomatiskan kalkulasi harga dan PPN 11%.</li>
                <li>Otomatisasi Laporan Keuangan: Memangkas waktu penyusunan laporan penjualan harian dan bulanan menjadi instan dengan filter tanggal dan ekspor data siap cetak (CSV/Print).</li>
                <li>Pengendalian Stok Real-Time: Menjaga akurasi persediaan fisik dan sistem melalui sinkronisasi stok otomatis pasca-transaksi.</li>
                <li>Transparansi Verifikasi Pembayaran: Mempercepat validasi transaksi non-tunai melalui peninjauan bukti transfer digital secara terpusat.</li>
            </ul>
        `,
        descEn: `
            <p>The Printing and Sales Management Information System at PT. Grafika Jaya Sumbar is a web-based enterprise solution (PHP Native OOP & MySQL) built to eliminate operational bottlenecks in manual logging. The platform centralizes product inventory management, Point of Sale (POS) checkout with automated 11% VAT calculation, multi-stage order workflows with digital payment slip verification, and automated financial reporting.</p>
            <br>
            My Key Roles:
            <ul>
                <li>Full-Stack Web Developer (PHP Native OOP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Dashboard Analytics Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            Key Achievements:
            <ul>
                <li>Operational Workflow Digitalization: Streamlined conventional receipts into a digital POS, eliminating human errors and automating price and 11% VAT calculations.</li>
                <li>Automated Financial Reporting: Cut report preparation times into instant summaries with date filters, printable formats, and CSV exports.</li>
                <li>Real-Time Stock Synchronization: Maintained inventory accuracy between physical stock and system records automatically upon transaction.</li>
                <li>Payment Verification Transparency: Accelerated non-cash payment validation through centralized digital transfer slip verification.</li>
            </ul>
        `,
        featuresId: [
            "Executive Dashboard & Sales Analytics: Metrik pendapatan bulanan, total produk aktif, dan grafik tren penjualan dinamis (Chart.js).",
            "Master Product & Inventory Control: Pengelolaan terpusat produk cetak & ATK dengan pembaruan stok otomatis.",
            "Point of Sale (POS) Module: Kasir terpadu (tunai & transfer), hitung subtotal & PPN 11%, kalkulasi kembalian, dan catatan transaksi.",
            "Order Processing & Payment Verification: Alur pesanan bertahap (Pending, Proses, Sukses, Tolak) dengan peninjauan bukti transfer digital.",
            "Role-Based Access Control (RBAC): Hak akses berjenjang untuk Direktur Utama/Admin, Kasir, dan Pelanggan.",
            "Financial Reporting & Export Engine: Rekap transaksi berkala dengan filter rentang tanggal, cetak dokumen, dan ekspor CSV.",
            "Store Profile & Receipt Settings: Kustomisasi identitas perusahaan, data kontak, unggah logo resmi, dan catatan struk."
        ],
        featuresEn: [
            "Executive Dashboard & Sales Analytics: Monthly revenue metrics, product counts, and dynamic sales trend graphs (Chart.js).",
            "Master Product & Inventory Control: Centralized printing & stationery product database with automated stock decrement.",
            "Point of Sale (POS) Module: Integrated cashier supporting cash/transfer, 11% VAT computation, and change calculation.",
            "Order Processing & Payment Verification: Multi-step order lifecycle (Pending, Processing, Completed, Rejected) with digital slip review.",
            "Role-Based Access Control (RBAC): Multi-level authorization for Director/Admin, Cashier, and Customers.",
            "Financial Reporting & Export Engine: Date-range filtered sales recapitulation with document printing and CSV exports.",
            "Store Profile & Receipt Settings: Corporate identity management, contact details, official logo, and custom receipt notes."
        ]
    },
    sweetandcrustweb: {
        titleId: "Sistem POS & Bakery Management Sweet & Crust – Web Laravel (Ujian Sertifikasi)",
        titleEn: "Sweet & Crust POS & Bakery Management – Laravel Web App (Certification Project)",
        tags: [
            "Laravel Framework", "PHP & MySQL", "Bootstrap", "Point of Sale (POS)", 
            "MVC Architecture", "Role-Based Auth", "CRUD Engine", "Web Programmer Certification"
        ],
        images: [
            "gambar/sc-laravel-web.png",
            "gambar/sc-form-login.png",
            "gambar/sc-form-registrasi.png",
            "gambar/sc-pos-transaksi.png",
            "gambar/sc-tabel-omzet.png",
            "gambar/sc-kelola-katalog.png",
            "gambar/sc-kelola-staf.png"
        ],
        descId: `
            <p>Sweet & Crust Web App merupakan sistem informasi kasir dan manajemen operasional toko roti berbasis web yang dikembangkan menggunakan Laravel Framework (PHP & MySQL) sebagai proyek tugas akhir dan uji kompetensi program pelatihan Web Programmer. Sistem ini dirancang untuk mendigitalisasi proses transaksi kasir, manajemen stok kue harian, serta pelaporan keuangan operasional toko roti secara terintegrasi.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Database Architect & Relational Schema Designer (MySQL & Eloquent ORM)</li>
                <li>Backend API & Security Engineer (Role-Based Authentication & Session Management)</li>
                <li>Frontend Integration & Responsive UI Developer (Bootstrap & JavaScript)</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Implementasi Arsitektur MVC & CRUD Lengkap: Membangun sistem web terstruktur berbasis framework Laravel dengan modul CRUD inventaris kue, manajemen kategori, dan pengelolaan akun staf.</li>
                <li>Multi-Role Authentication & Keamanan Akses: Menerapkan pemisahan hak akses kerja yang aman antara level Admin (analisis omzet, kontrol stok, kelola staf) dan Kasir (transaksi cepat dan cetak struk).</li>
                <li>Otomatisasi Kalkulasi Transaksi & Omzet: Mengembangkan modul kasir interaktif dengan kalkulasi total otomatis, pencatatan histori pesanan, dan pembaruan stok real-time pasca-transaksi.</li>
                <li>Kelulusan Uji Kompetensi Pelatihan: Berhasil menyelesaikan proyek akhir pelatihan Web Programmer dengan predikat sangat memuaskan dan memenuhi standar sertifikasi teknis.</li>
            </ul>
        `,
        descEn: `
            <p>Sweet & Crust Web App is a digital Point of Sale (POS) and bakery operations management web application built with the Laravel Framework (PHP & MySQL) as the capstone certification project for the Web Programmer training program. The system digitalizes cashier checkout workflows, daily bakery inventory controls, and financial reporting into an integrated web ecosystem.</p>
            <br>
            My Key Roles:
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Database Architect & Relational Schema Designer (MySQL & Eloquent ORM)</li>
                <li>Backend API & Security Engineer (Role-Based Authentication & Session Management)</li>
                <li>Frontend Integration & Responsive UI Developer (Bootstrap & JavaScript)</li>
            </ul>
            <br>
            Key Achievements:
            <ul>
                <li>Full MVC Architecture & CRUD Implementation: Engineered a clean MVC web structure in Laravel covering dynamic catalog CRUD, category administration, and staff management.</li>
                <li>Multi-Role Authentication & Security: Enforced role-based access control segregating Admin (revenue analytics, stock replenishment, staff control) and Cashier duties.</li>
                <li>Automated Billing & Sales Recapitulation: Built an interactive POS cashier module automating order totals, live inventory decrement, and revenue aggregation.</li>
                <li>Certification Project Distinction: Successfully accomplished the Web Programmer final capstone examination with outstanding distinction according to technical standards.</li>
            </ul>
        `,
        featuresId: [
            "Seamless Web POS Interface: Modul kasir berbasis web yang cepat untuk pencatatan pesanan dan kalkulasi total otomatis.",
            "Real-time Sales & Revenue Analytics: Dasbor laporan omzet real-time dengan grafik tren penjualan 7 hari terakhir.",
            "Master Catalog & Inventory Management: Pengelolaan data produk kue, harga, varian, dan sinkronisasi stok otomatis (CRUD).",
            "Role-Based Authentication: Autentikasi berjenjang yang aman memisahkan wewenang antara Admin dan Kasir.",
            "Riwayat Transaksi & Cetak Struk: Rekap histori penjualan komprehensif dan pembuatan bukti transaksi digital.",
            "Manajemen Staf Toko: Pengelolaan data akun dan hak akses operasional kasir toko roti."
        ],
        featuresEn: [
            "Seamless Web POS Interface: High-speed web cashier module for rapid order processing and automated billing calculation.",
            "Real-time Sales & Revenue Analytics: Live revenue dashboards with 7-day sales trend visualization graphs.",
            "Master Catalog & Inventory Management: Dynamic cake product catalog, pricing, variants, and automated stock synchronization (CRUD).",
            "Role-Based Authentication: Secure multi-tier authentication strictly separating Admin and Cashier privileges.",
            "Transaction History & Receipt Printing: Comprehensive sales audit logs and digital receipt generation.",
            "Staff Account Management: Administration of cashier user credentials and store permissions."
        ]
    },
    apotekasyifa: {
        titleId: "Sistem Manajemen Apotek & Inventaris – Apotek Asyifa (Back-Office)",
        titleEn: "Pharmacy & Inventory Management System – Apotek Asyifa (Back-Office)",
        tags: [
            "PHP & MySQL", "Bootstrap", "Chart.js", "DataTables", 
            "Pharmacy Management", "Back-Office System", "Inventory Control", "Expiration Risk Alert"
        ],
        images: [
            "gambar/apotek-asyifa.jpg",
            "gambar/asyifa-dashboard.png",
            "gambar/asyifa-kedaluwarsa.png",
            "gambar/asyifa-kategori.png",
            "gambar/asyifa-pemasok.png",
            "gambar/asyifa-penjualan.png",
            "gambar/asyifa-pembelian.png"
        ],
        descId: `
            <p>Apotek Asyifa merupakan sistem informasi manajemen operasional apotek berbasis web (<em>Pharmacy Back-Office System</em>) yang dikembangkan dengan PHP & MySQL untuk mengoptimalkan tata kelola inventaris obat, pengawasan masa kedaluwarsa, dan pencatatan riwayat transaksi farmasi.</p>
            <p>Berfokus pada administrasi <em>back-office</em>, sistem ini mengintegrasikan master data obat, kategori, unit sediaan, direktori pemasok (<em>supplier</em>), pemantauan stok kritis, deteksi dini obat kedaluwarsa (&lt; 60 hari) beserta lokasi rak penyimpanan, serta pencatatan audit log transaksi pembelian dan penjualan dengan visualisasi analitik omzet berbasis Chart.js.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Full-Stack Web Developer (PHP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Data Visualization Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Digitalisasi Tata Kelola Farmasi: Menyatukan pengelolaan master obat, unit dosis, kategori, dan pemasok ke dalam sistem terpusat untuk mencegah selisih stok.</li>
                <li>Mitigasi Risiko Obat Kedaluwarsa: Menerapkan sistem peringatan dini obat hampir kedaluwarsa (&lt; 60 hari) dan pemetaan rak guna menekan potensi kerugian dan menjaga mutu obat.</li>
                <li>Pencatatan Transaksi & Audit Log: Mengotomatiskan pencatatan riwayat transaksi pembelian distributor dan penjualan dengan nomor referensi unik.</li>
                <li>Visualisasi Data & Laporan Finansial: Mengembangkan grafik tren omzet, diagram komparasi kategori (Antibiotik vs Salep), serta rekapitulasi data siap ekspor.</li>
            </ul>
        `,
        descEn: `
            <p>Apotek Asyifa is a web-based <em>Pharmacy Back-Office Management System</em> developed using PHP & MySQL to streamline pharmaceutical inventory control, expiration risk monitoring, and transaction auditing.</p>
            <p>Tailored for back-office administration, the platform centralizes master drug records, categories, dosage units, supplier profiles, out-of-stock tracking, early expiration detection (&lt; 60 days) with shelf/rack mapping, and structured sales and purchase logging backed by Chart.js revenue analytics.</p>
            <br>
            My Key Roles:
            <ul>
                <li>Full-Stack Web Developer (PHP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Data Visualization Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            Key Achievements:
            <ul>
                <li>Centralized Pharmacy Digitalization: Consolidated drug catalogs, dosage units, categories, and supplier records into an integrated relational database.</li>
                <li>Drug Expiration Risk Mitigation: Implemented automated alerts for near-expiry drugs (&lt; 60 days) and shelf mapping to eliminate waste and uphold quality standards.</li>
                <li>Structured Transaction Auditing: Automated purchase and sales record keeping with unique reference tracking codes.</li>
                <li>Data Visualization & Reporting Engine: Delivered interactive sales trend graphs, category comparisons (Antibiotics vs Ointments), and export-ready financial logs.</li>
            </ul>
        `,
        featuresId: [
            "Dasbor Eksekutif: Metrik real-time total obat, kategori, pemasok, unit, serta ringkasan total pembelian dan penjualan.",
            "Deteksi Dini Obat Kedaluwarsa (< 60 Hari): Monitoring otomatis status obat kedaluwarsa dan peringatan mendekati batas kedaluwarsa beserta nomor rak simpan.",
            "Log Transaksi Penjualan & Pembelian: Pencatatan riwayat transaksi masuk (distributor) dan keluar (penjualan) dengan nomor referensi unik.",
            "Grafik Omzet & Varian Terlaris: Visualisasi tren penjualan berkala dan monitoring varian obat terlaris berbasis Chart.js.",
            "Grafik Komparasi Kategori Farmasi: Analisis perbandingan volume penjualan antar kelompok obat (misal: Antibiotik vs Salep).",
            "Master Data Obat & Pemasok: Pengelolaan basis data katalog obat, kategori, satuan unit sediaan, dan direktori supplier resmi.",
            "Ekspor Laporan Finansial (DataTables): Filter rentang tanggal dan ekspor data pembukuan lengkap (Copy, CSV, Print)."
        ],
        featuresEn: [
            "Executive Dashboard: Real-time overview of total medicines, categories, suppliers, units, and cumulative sales/purchases.",
            "Early Expiration Detection (< 60 Days): Automated alerts for expired and near-expiry drugs with designated shelf/rack storage numbers.",
            "Sales & Purchase Transaction Logs: Structured logging for distributor procurement and sales with unique reference codes.",
            "Revenue Trends & Bestseller Analytics: Interactive revenue trend lines and top-selling pharmaceutical variant tracking (Chart.js).",
            "Category Comparison Bar Chart: Comparative analytics visualizing sales distribution across drug categories.",
            "Master Medicine & Supplier Data: Comprehensive database management for drug items, categories, dosage units, and verified suppliers.",
            "DataTables Export Engine: Flexible date filtering with instant multi-format data export (Copy, CSV, Print)."
        ]
    },
    ranahmalala: {
        titleId: "Website Pariwisata & Budaya Terpadu Sumatera Barat – Ranah Malala (Pelatihan Web Programmer)",
        titleEn: "Integrated Tourism & Cultural Portal of West Sumatra – Ranah Malala (Web Programmer)",
        tags: [
            "Laravel Framework", "PHP & MySQL", "Blade Templating", "MVC Architecture", 
            "Bootstrap", "Responsive Design", "UI/UX Design", "Web Programmer Project"
        ],
        images: [
            "gambar/ranah-malala.png",
            "gambar/rm-home.png",
            "gambar/rm-wisata.png",
            "gambar/rm-budaya.png",
            "gambar/rm-kuliner.png",
            "gambar/rm-tentang.png"
        ],
        descId: `
            <p>Ranah Malala merupakan platform website pariwisata dan kebudayaan terpadu Sumatera Barat yang dikembangkan dengan Laravel Framework (PHP & MySQL) sebagai proyek besar dalam program pelatihan Web Programmer. Website ini dirancang untuk mempromosikan keindahan alam Ranah Minang, warisan seni dan adat budaya Minangkabau (seperti Rumah Gadang, Tari Piring, Songket Pandai Sikek, dan Silek Tradisional), kekayaan kuliner daerah, serta informasi geografi wilayah dengan arsitektur MVC dan antarmuka modern yang responsif di berbagai perangkat.</p>
            <br>
            Peran Saya:
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Frontend UI/UX Designer & Responsive Layout Engineer (Bootstrap & JavaScript)</li>
                <li>Database Architect & Eloquent ORM Schema Designer</li>
                <li>Information Architecture & Interactive Catalog Developer</li>
            </ul>
            <br>
            Pencapaian:
            <ul>
                <li>Pengembangan Web Berbasis Framework Laravel: Mengimplementasikan pola arsitektur MVC (Model-View-Controller) dengan Blade Templating dan Eloquent ORM untuk manajemen data pariwisata yang terstruktur.</li>
                <li>Perancangan Portal Pariwisata Digital Modern: Berhasil membangun platform informasi wisata terintegrasi dengan katalog destinasi, panduan budaya, dan eksplorasi kuliner Minangkabau.</li>
                <li>Antarmuka Responsif & Multi-Device: Mengimplementasikan desain modern yang adaptif optimal di berbagai ukuran layar (desktop, laptop, tablet, dan smartphone).</li>
                <li>Proyek Besar Pelatihan Web Programmer: Menyelesaikan proyek besar pelatihan web dengan standarisasi fungsionalitas Laravel, keamanan autentikasi, dan estetika antarmuka yang optimal.</li>
            </ul>
        `,
        descEn: `
            <p>Ranah Malala is an integrated West Sumatra tourism and cultural web platform developed using the Laravel Framework (PHP & MySQL) as a major capstone project in the Web Programmer training program. The website is designed to promote the natural beauty of Ranah Minang, Minangkabau traditional arts and cultural heritage (such as Rumah Gadang, Tari Piring, Songket Pandai Sikek, and Traditional Silek), authentic local culinary delights, and regional geographic information through clean MVC architecture and a responsive multi-device interface.</p>
            <br>
            My Key Roles:
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Frontend UI/UX Designer & Responsive Layout Engineer (Bootstrap & JavaScript)</li>
                <li>Database Architect & Eloquent ORM Schema Designer</li>
                <li>Information Architecture & Interactive Catalog Developer</li>
            </ul>
            <br>
            Key Achievements:
            <ul>
                <li>Laravel Framework Full-Stack Engineering: Implemented clean MVC (Model-View-Controller) patterns with Blade Templating and Eloquent ORM for structured tourism data management.</li>
                <li>Modern Digital Tourism Portal Development: Successfully engineered an integrated tourism platform featuring destination catalogs, cultural heritage guides, and Minangkabau culinary exploration.</li>
                <li>Responsive Multi-Device Interface: Implemented a fluid adaptive layout ensuring optimal viewing and interaction across desktop, laptop, tablet, and mobile screens.</li>
                <li>Web Programmer Training Capstone: Delivered a comprehensive web capstone project adhering to technical functionality standards in Laravel and intuitive UI/UX design.</li>
            </ul>
        `,
        featuresId: [
            "Halaman Utama Modern & Interaktif: Tampilan beranda dinamis dengan hero section selamat datang di Ranah Minang.",
            "Katalog Wisata Alam & Destinasi: Eksplorasi tempat wisata lengkap seperti Lembah Harau, Danau Maninjau, Jam Gadang, dan Danau Singkarak.",
            "Warisan Adat & Budaya Minangkabau: Informasi mendalam mengenai Rumah Gadang, Tari Piring, Songket Pandai Sikek, dan Silek Tradisional.",
            "Eksplorasi Kuliner Khas Daerah: Direktori ragam kuliner otentik Minangkabau beserta deskripsi dan keunikannya.",
            "Informasi & Geografi Wilayah: Rangkuman profil geografis, demografi, dan wilayah administratif Sumatera Barat.",
            "Autentikasi Akun Pengguna: Sistem login dan registrasi anggota yang aman untuk personalisasi pengguna.",
            "Desain Responsif Multi-Platform: Tampilan optimal dan adaptif untuk perangkat desktop, tablet, maupun smartphone."
        ],
        featuresEn: [
            "Modern & Interactive Home Page: Dynamic landing page featuring a welcoming hero section to Ranah Minang.",
            "Nature & Destination Catalog: Comprehensive travel guide to Lembah Harau, Lake Maninjau, Jam Gadang, and Lake Singkarak.",
            "Minangkabau Cultural Heritage: Detailed showcases of Rumah Gadang, Tari Piring, Songket Pandai Sikek, and Traditional Silek.",
            "Authentic Culinary Exploration: Directory of traditional West Sumatran culinary treasures and specialties.",
            "Regional & Geographic Profiles: Complete geographic, demographic, and administrative overview of West Sumatra.",
            "User Account Authentication: Secure user registration and login system for membership management.",
            "Responsive Multi-Device Layout: Fluid adaptive layout across desktop, laptop, tablet, and mobile screens."
        ]
    },
    pengarsipandokumen: {
        titleId: "Sistem Pengarsipan & Monitoring Dokumen Perusahaan",
        titleEn: "Corporate Document Archiving & Monitoring System",
        tags: [
            "Microsoft Excel", "Google Sheets", "Document Controller", 
            "Executive Dashboard", "SOP Kearsipan", "Monitoring SLA"
        ],
        images: [
            "gambar/arsip-dokumen-dashboard.png",
            "gambar/arsip-dokumen-register.png",
            "gambar/arsip-dokumen-sop.png"
        ],
        descId: `
            <p>Sistem tata kelola kearsipan berbasis spreadsheet analitik untuk memonitor kelengkapan berkas, koordinat simpan, dan batas waktu SLA.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Eksekutif:</strong> Ringkasan kelengkapan berkas (60%), rekapitulasi kategori & divisi, dan alert overdue.</li>
                <li><strong>Register Master Arsip:</strong> Database 30 berkas berindeks unik, koordinat fisik (Bantex/Box), dan link digital PDF.</li>
                <li><strong>Master SOP & PIC:</strong> Kodifikasi arsip, matriks penanggung jawab divisi, dan target SLA 3-14 hari kerja.</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Document Controller & Records Specialist</li>
                <li>Spreadsheet Modeler (VLOOKUP, SUMIFS, COUNTIFS & Conditional Formatting)</li>
                <li>Penyusun Standar Prosedur Operasional (SOP) Kearsipan</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Pencarian berkas fisik dipercepat dari 15 menit ke < 1 menit via kode lokasi.</li>
                <li>Pencegahan keterlambatan dokumen melalui alert otomatis status Overdue.</li>
                <li>Otomasi 100% rekapitulasi master register ke dasbor pimpinan tanpa input manual.</li>
            </ul>
        `,
        descEn: `
            <p>A centralized document archiving system built on spreadsheet analytics to monitor completeness, physical locations, and SLA deadlines.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Executive Dashboard:</strong> Real-time completion rate (60%), category/division breakdowns, and overdue alerts.</li>
                <li><strong>Master Register:</strong> 30 indexed files with unique codes, physical coordinates (Bantex/Box), and digital PDF links.</li>
                <li><strong>SOP & PIC Matrix:</strong> Classification codification, departmental PIC directory, and 3-14 day SLA targets.</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Document Controller & Records Specialist</li>
                <li>Spreadsheet Modeler (VLOOKUP, SUMIFS, COUNTIFS & Conditional Formatting)</li>
                <li>Archival SOP Designer</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>Accelerated file retrieval from 15 mins to < 1 min via indexed location tags.</li>
                <li>Prevented compliance delays through automated Overdue tracking alerts.</li>
                <li>100% automated reporting from register to executive dashboards without manual entry.</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Eksekutif: Scorecard kelengkapan berkas, grafik status, dan komparasi divisi.",
            "Register 30 Berkas: Kodifikasi unik dengan pemetaan lokasi simpan rak/box fisik.",
            "Dual Filing System: Integrasi berkas fisik (Bantex/Box) dengan link cloud PDF.",
            "Alert SLA & Overdue: Penandaan otomatis untuk batas waktu proses dokumen.",
            "Validasi Tiga Lapis: Alur pengesahan Staff Arsip, Supervisor, hingga Manajer."
        ],
        featuresEn: [
            "Executive Dashboard: Document completeness scorecard, status charts, and division bars.",
            "30-File Register: Unique sequential codification mapped to physical storage tags.",
            "Dual Filing System: Unified tracking of physical folders and cloud PDF scans.",
            "SLA & Overdue Alerts: Automated color flags for approaching or missed deadlines.",
            "Three-Tier Approval: Structured verification by Archive Staff, Supervisor, and Manager."
        ]
    },
    rekapitulasikehadiran: {
        titleId: "Sistem Rekapitulasi Kehadiran & Kedisiplinan Karyawan",
        titleEn: "Employee Attendance Recapitulation & Discipline System",
        tags: [
            "Microsoft Excel", "Google Sheets", "HR Analytics", 
            "Executive Dashboard", "Timesheet Harian", "Evaluasi Disiplin"
        ],
        images: [
            "gambar/rekapitulasi-kehadiran-dashboard.png",
            "gambar/rekapitulasi-kehadiran-timesheet.png",
            "gambar/rekapitulasi-kehadiran-policy.png"
        ],
        descId: `
            <p>Sistem analitik presensi dan kedisiplinan karyawan berbasis spreadsheet untuk monitoring kehadiran harian, evaluasi divisi, dan payroll.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Eksekutif:</strong> Ringkasan KPI kehadiran 97.0% (427 hadir, 5 izin, 6 sakit, 2 alpa), grafik divisi, dan log kedisiplinan.</li>
                <li><strong>Timesheet Harian:</strong> Presensi 20 karyawan (EMP-001 s.d. EMP-020) selama 31 hari dengan validasi status (H, I, S, A, OFF).</li>
                <li><strong>Master & SOP HR:</strong> Standarisasi kode presensi, target kehadiran divisi (92%-95%), dan evaluasi kedisiplinan.</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>HR Operations & Attendance Specialist</li>
                <li>Spreadsheet Modeler (SUMIFS, COUNTIFS, Nested IF & Conditional Formatting)</li>
                <li>Penyusun Rekapitulasi & Pelaporan Kedisiplinan</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Otomasi 100% kalkulasi presensi harian & bulanan tanpa eror hitung manual.</li>
                <li>Deteksi dini pelanggaran kedisiplinan (alpa tanpa keterangan & verifikasi SKD).</li>
                <li>Laporan eksekutif siap cetak dengan validasi berjenjang (Staff, Supervisor, Direktur SDM).</li>
            </ul>
        `,
        descEn: `
            <p>Spreadsheet attendance and discipline analytics system to monitor daily presence logs, departmental evaluations, and payroll readiness.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Executive Dashboard:</strong> Attendance KPI 97.0% (427 present, 5 leave, 6 sick, 2 absent), division charts, and discipline logs.</li>
                <li><strong>Daily Timesheet:</strong> 31-day log for 20 employees (EMP-001 to EMP-020) with dropdown codes (H, I, S, A, OFF).</li>
                <li><strong>HR Policy & Standards:</strong> Standardized status codes, division targets (92%-95%), and evaluation metrics.</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>HR Operations & Attendance Specialist</li>
                <li>Spreadsheet Modeler (SUMIFS, COUNTIFS, Nested IF & Conditional Formatting)</li>
                <li>Attendance & Discipline Reporting Designer</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>100% automated daily & monthly tallying, eliminating manual calculation errors.</li>
                <li>Proactive discipline tracking (unauthorized absences and doctor note audits).</li>
                <li>Print-ready executive summary featuring a 3-tier approval workflow (Staff, Supervisor, Director).</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Eksekutif: KPI kehadiran 97.0%, diagram donat status, dan grafik performa 6 divisi.",
            "Timesheet 31 Hari: Matriks presensi 20 karyawan dengan validasi kode status (H, I, S, A, OFF).",
            "Audit Kedisiplinan: Log penindakan untuk karyawan dengan catatan alpa atau izin.",
            "Master Kebijakan HR: Standar target kehadiran (92%-95%) dan rumus evaluasi objektif.",
            "Validasi Tiga Lapis: Pengesahan Staff HR/Payroll, Supervisor, hingga Direktur SDM."
        ],
        featuresEn: [
            "Executive Dashboard: 97.0% attendance scorecard, status donut chart, and 6-division bars.",
            "31-Day Timesheet: 20-employee matrix featuring dropdown input validation (H, I, S, A, OFF).",
            "Discipline Audit: Action log for staff with unexcused absences or frequent leaves.",
            "HR Policy Thresholds: Division compliance targets (92%-95%) and standardized formulas.",
            "Three-Tier Approval: Structured validation by HR Staff, Supervisor, and HR Director."
        ]
    },
    suratmasukkeluar: {
        titleId: "Sistem Pencatatan & Disposisi Surat Masuk dan Keluar",
        titleEn: "Incoming & Outgoing Mail Management System",
        tags: [
            "Microsoft Excel", "Google Sheets", "Agenda Korespondensi", 
            "Disposisi Pimpinan", "Monitoring SLA", "Tata Persuratan"
        ],
        images: [
            "gambar/surat-masuk-keluar-dashboard.png",
            "gambar/surat-masuk-keluar-masuk.png",
            "gambar/surat-masuk-keluar-keluar.png",
            "gambar/surat-masuk-keluar-policy.png"
        ],
        descId: `
            <p>Buku agenda digital berbasis spreadsheet untuk registrasi surat dinas, pelacakan disposisi pimpinan, dan pemantauan SLA respon.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Monitoring:</strong> KPI 40 surat (20 masuk, 20 keluar, penyelesaian 75%), grafik 7 divisi, dan alert surat kritis.</li>
                <li><strong>Agenda Surat Masuk:</strong> Registrasi 20 surat (001-020/SM/2026), instruksi disposisi pimpinan, PIC, target SLA, dan link PDF.</li>
                <li><strong>Agenda Surat Keluar:</strong> Registrasi 20 surat (001-020/SK/2026), divisi pembuat, nomor resi ekspedisi, dan lokasi simpan fisik.</li>
                <li><strong>Master Tata Persuratan:</strong> Format baku penomoran dinas 7 divisi dan matriks SLA respon (24 jam s.d. 7 hari kerja).</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Correspondence & Secretarial Specialist</li>
                <li>Spreadsheet Modeler (INDEX, MATCH, COUNTIFS, Nested IF & Conditional Formatting)</li>
                <li>Pengelola Alur Disposisi & Ekspedisi Surat</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Pencegahan surat tercecer via penomoran agenda terpusat dan pelacakan disposisi.</li>
                <li>Mitigasi risiko kepatuhan melalui deteksi otomatis status Overdue surat penting.</li>
                <li>Laporan eksekutif siap cetak dengan pengesahan Staff Tata Usaha, Koordinator, dan Corporate Secretary.</li>
            </ul>
        `,
        descEn: `
            <p>A digital agenda spreadsheet system for registering official mail, tracking leadership dispositions, and monitoring SLA turnaround.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Monitoring Dashboard:</strong> 40-letter KPI (20 in, 20 out, 75% resolved), 7-division charts, and critical alerts.</li>
                <li><strong>Incoming Mail Register:</strong> 20 letters (001-020/SM/2026), leadership directives, assigned PICs, SLA, and PDF links.</li>
                <li><strong>Outgoing Mail Register:</strong> 20 letters (001-020/SK/2026), issuing division, courier tracking numbers, and physical tags.</li>
                <li><strong>Mail Standards & SOP:</strong> Official numbering syntax across 7 divisions and response SLAs (24 hrs to 7 days).</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Correspondence & Secretarial Specialist</li>
                <li>Spreadsheet Modeler (INDEX, MATCH, COUNTIFS, Nested IF & Conditional Formatting)</li>
                <li>Disposition & Mail Dispatch Controller</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>Prevented misplaced mail through centralized sequential numbering and live tracking.</li>
                <li>Mitigated compliance risks via automated Overdue detection on priority letters.</li>
                <li>Print-ready summary featuring sign-offs by Admin Staff, Coordinator, and Corporate Secretary.</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Eksekutif: Scorecard 40 surat, diagram status tindak lanjut, dan komparasi 7 divisi.",
            "Agenda Surat Masuk: Registrasi 20 surat dengan disposisi pimpinan dan penugasan PIC.",
            "Agenda Surat Keluar: Pencatatan 20 surat keluar dengan tracking resi dan lokasi simpan.",
            "Matriks Batas Waktu (SLA): Standar respon 24 jam (Sangat Segera) hingga 7 hari kerja (Biasa).",
            "Validasi Tiga Lapis: Pengesahan Staff Tata Usaha, Koordinator, dan Corporate Secretary."
        ],
        featuresEn: [
            "Executive Dashboard: 40-letter scorecard, disposition status donut chart, and 7-division bars.",
            "Incoming Mail Register: 20-file registry with executive disposition directives and PIC tags.",
            "Outgoing Mail Register: 20-file registry with courier tracking numbers and folder coordinates.",
            "Response SLA Matrix: Turnaround benchmarks ranging from 24 hours (Urgent) to 7 days (Routine).",
            "Three-Tier Approval: Validation sign-offs by Admin Staff, Coordinator, and Corporate Secretary."
        ]
    },
    dashboardadministrasi: {
        titleId: "Dashboard Eksekutif Laporan Administrasi Bulanan",
        titleEn: "Monthly Administration Executive Dashboard",
        tags: [
            "Microsoft Excel", "Google Sheets", "Konsolidasi 3 Pilar", 
            "Executive Dashboard", "Analisis Anggaran", "Monitoring Risiko", 
            "Formula SUMIFS & COUNTIFS", "Pelaporan Eksekutif"
        ],
        images: [
            "gambar/dashboard-administrasi-executive.png",
            "gambar/dashboard-administrasi-rekapitulasi.png",
            "gambar/dashboard-administrasi-arsip.png",
            "gambar/dashboard-administrasi-persuratan.png",
            "gambar/dashboard-administrasi-kegiatan.png",
            "gambar/dashboard-administrasi-master.png"
        ],
        descId: `
            <p>Dasbor analitik eksekutif untuk mengonsolidasi seluruh beban kerja tata usaha dan operasional kantor meliputi pengelolaan arsip, korespondensi, dan kegiatan korporat.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Eksekutif:</strong> Scorecard KPI 77 entitas (50 selesai, tingkat tuntas 64.9%), grafik komparasi 7 divisi, dan tabel eskalasi risiko.</li>
                <li><strong>Rekapitulasi 3 Pilar & Anggaran:</strong> Evaluasi kinerja pilar serta efisiensi anggaran kegiatan Rp 179,1 Juta (realisasi biaya 68.4%).</li>
                <li><strong>Database & Master Referensi:</strong> Database 25 dokumen, 30 surat, 22 kegiatan, serta master kodifikasi dan bobot status 7 departemen.</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Executive Administration & Operations Analyst</li>
                <li>Spreadsheet Consolidation Modeler (Formula SUMIFS, COUNTIFS, Nested IF & Variance Analysis)</li>
                <li>Penyusun Laporan Kinerja Bulanan & Rekomendasi Tata Kelola</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Integrasi 77 entitas kerja lintas 7 divisi ke dalam 1 dasbor analitik terpadu.</li>
                <li>Efisiensi anggaran sebesar Rp 179,1 Juta melalui monitoring realisasi biaya berkala.</li>
                <li>Laporan eksekutif siap cetak dengan pengesahan berjenjang (Staff TU, Koordinator, General Manager).</li>
            </ul>
        `,
        descEn: `
            <p>An executive analytics dashboard consolidating operational administration workloads across archival governance, correspondence, and corporate agendas.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Executive Dashboard:</strong> Scorecard of 77 workload entities (50 completed, 64.9% rate), 7-division comparison bars, and risk escalation logs.</li>
                <li><strong>3-Pillar Recapitulation & Budget:</strong> Pillar performance evaluation and corporate event budget savings of Rp 179.1 Million (68.4% realization).</li>
                <li><strong>Operational Database & Master Codes:</strong> 25 documents, 30 letters, 22 corporate events, and division coding architecture.</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Executive Administration & Operations Analyst</li>
                <li>Spreadsheet Consolidation Modeler (SUMIFS, COUNTIFS, Nested IF & Variance Analysis)</li>
                <li>Monthly KPI Reporting & Governance Consultant</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>Consolidated 77 cross-departmental administrative tasks into a single real-time dashboard.</li>
                <li>Achieved budget savings of Rp 179.1 Million through systematic expense tracking.</li>
                <li>Print-ready executive summary with a 3-tier approval hierarchy (Admin Staff, Coordinator, General Manager).</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Eksekutif: Scorecard 77 entitas kerja, grafik 7 divisi, dan action alert risiko.",
            "Konsolidasi 3 Pilar: Pelacakan terpadu 25 dokumen, 30 surat, dan 22 agenda kegiatan.",
            "Analisis Anggaran: Monitoring efisiensi biaya dengan realisasi 68.4% (hemat Rp 179 Juta).",
            "Master Referensi & Kode: Kodifikasi divisi, pembobotan status terpadu, dan matriks pimpinan.",
            "Validasi Tiga Lapis: Pengesahan Staff TU, Koordinator Tata Usaha, dan GM Operasional."
        ],
        featuresEn: [
            "Executive Dashboard: 77-entity workload scorecard, 7-division charts, and risk action alerts.",
            "3-Pillar Consolidation: Integrated tracking of 25 documents, 30 letters, and 22 corporate events.",
            "Budget Variance Analysis: Expenditure monitoring with 68.4% utilization (Rp 179M savings).",
            "Master Reference Architecture: Division codification syntax, status weighting, and leadership matrix.",
            "Three-Tier Approval: Multi-level sign-offs by Admin Staff, Coordinator, and Operations GM."
        ]
    },
    rekonsiliasidata: {
        titleId: "Sistem Uji Kualitas & Rekonsiliasi Data Transaksi",
        titleEn: "Data Quality Audit & Transaction Reconciliation System",
        tags: [
            "Microsoft Excel", "Google Sheets", "Rekonsiliasi Bank", 
            "Audit Kualitas Data", "Deteksi Anomali", "Kertas Kerja Audit", 
            "Formula XLOOKUP", "Analisis Deviasi"
        ],
        images: [
            "gambar/rekonsiliasi-data-dashboard.png",
            "gambar/rekonsiliasi-data-engine.png",
            "gambar/rekonsiliasi-data-temuan.png",
            "gambar/rekonsiliasi-data-sumber-a.png",
            "gambar/rekonsiliasi-data-sumber-b.png",
            "gambar/rekonsiliasi-data-master.png"
        ],
        descId: `
            <p>Sistem audit dan rekonsiliasi data transaksi berbasis spreadsheet untuk mencocokkan catatan internal (GL/ERP) dengan mutasi rekening koran bank secara presisi.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Audit Internal:</strong> Scorecard 35 transaksi (tingkat cocok 80%, selisih 3 rekor, transaksi ganda 2 kasus) dan mitigasi risiko Rp 97,08 Juta.</li>
                <li><strong>Engine Rekonsiliasi Otomatis:</strong> Pencocokan otomatis mutasi GL internal (Rp 1,018 M) vs Bank (Rp 944,5 Juta) dengan deteksi deviasi instan.</li>
                <li><strong>Kertas Kerja & Master Metodologi:</strong> Log 10 temuan pengecualian (root cause & action plan) serta master kodifikasi audit terstandar.</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Internal Audit & Financial Data Specialist</li>
                <li>Spreadsheet Logic Engineer (Formula XLOOKUP, INDEX/MATCH, COUNTIFS & Conditional Formatting)</li>
                <li>Investigator Deviasi Transaksi & Kertas Kerja Rekonsiliasi</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Otomasi 100% proses rekonsiliasi menggantikan pengecekan manual baris per baris.</li>
                <li>Identifikasi dan mitigasi dini deviasi finansial sebesar Rp 97,08 Juta (posting ganda & selisih nominal).</li>
                <li>Kertas kerja audit terstruktur siap saji untuk audit internal maupun eksternal.</li>
            </ul>
        `,
        descEn: `
            <p>A spreadsheet-based transaction audit and reconciliation system matching internal ERP general ledger records against bank statement logs with high precision.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Internal Audit Dashboard:</strong> Scorecard of 35 transactions (80% match rate, 3 variances, 2 duplicates) with Rp 97.08M exception value oversight.</li>
                <li><strong>Automated Matching Engine:</strong> Automated matching between internal GL (Rp 1.018B) and bank records (Rp 944.5M) with instant anomaly flags.</li>
                <li><strong>Audit Workpapers & Master Methodology:</strong> 10 documented exceptions with root-cause analysis and standardized audit codification.</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Internal Audit & Financial Data Specialist</li>
                <li>Spreadsheet Logic Engineer (XLOOKUP, INDEX/MATCH, COUNTIFS & Conditional Formatting)</li>
                <li>Transaction Variance Investigator & Audit Workpaper Author</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>100% automated reconciliation replacing tedious line-by-line manual inspections.</li>
                <li>Early detection and mitigation of Rp 97.08 Million in financial variances and duplicate billings.</li>
                <li>Comprehensive audit trail and workpapers fully compliant with internal and external audit standards.</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Audit: Scorecard 35 transaksi, diagram hasil uji, dan evaluasi 5 dimensi kualitas data.",
            "Automated Matching Engine: Pencocokan otomatis jurnal internal vs rekening koran bank via XLOOKUP.",
            "Deteksi Anomali Cepat: Identifikasi instan posting ganda, selisih nominal, dan outstanding bank.",
            "Kertas Kerja Audit: Registrasi 10 temuan pengecualian lengkap dengan root cause dan target SLA.",
            "Master Metodologi: Standarisasi status uji (MATCH, VAR_AMT, DUPLICATE) dan matriks mitigasi risiko."
        ],
        featuresEn: [
            "Audit Dashboard: 35-transaction scorecard, reconciliation donut chart, and 5 data quality dimensions.",
            "Automated Matching Engine: High-speed record matching between internal GL and bank records via XLOOKUP.",
            "Fast Anomaly Detection: Instant flags for duplicate postings, amount variances, and outstanding clearing.",
            "Audit Workpapers: Structured register of 10 audit exceptions with root cause analysis and action plans.",
            "Standardized Methodology: Uniform test status codes (MATCH, VAR_AMT, DUPLICATE) and risk matrices."
        ]
    },
    laporanpenjualan: {
        titleId: "Laporan Penjualan Elektronik & Komputer",
        titleEn: "Electronics & Computer Sales Performance Report",
        tags: [
            "Microsoft Excel", "Google Sheets", "Laporan Penjualan", 
            "Analisis Omzet", "Grafik Komparasi", "Formula SUM & AVERAGE", 
            "Administrasi Kasir", "Rekapitulasi Transaksi"
        ],
        images: [
            "gambar/laporan-penjualan-elektronik.png"
        ],
        descId: `
            <p>Laporan penjualan komersial berbasis spreadsheet untuk merekapitulasi volume transaksi, perolehan omzet 15 lini produk, dan performa rata-rata transaksi.</p>
            <br>
            <strong>Modul Utama:</strong>
            <ul>
                <li><strong>Dashboard Ringkasan Penjualan:</strong> Scorecard total pendapatan Rp 219.000.000, 123 unit terjual, rata-rata transaksi Rp 14.600.000, dan transaksi puncak Rp 34.000.000.</li>
                <li><strong>Tabel Rekapitulasi 15 Produk:</strong> Rincian penjualan hardware, gadget, dan aksesori dengan kalkulasi otomatis jumlah unit, harga satuan, dan total omzet.</li>
                <li><strong>Grafik Komparasi Penjualan:</strong> Diagram batang horizontal untuk membandingkan kontribusi pendapatan masing-masing produk secara visual.</li>
            </ul>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Sales Administration & Financial Reporting Specialist</li>
                <li>Spreadsheet Modeler (Formula SUM, AVERAGE, MAX, MIN & Product Analytics)</li>
                <li>Penyusun Dokumen Resmi Laporan Penjualan & Kasir</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li>Otomasi 100% kalkulasi total pendapatan dan statistik penjualan tanpa komputasi manual.</li>
                <li>Penyajian data visual penjualan instan untuk evaluasi produk terlaris (Laptop ASUS VivoBook & Apple iPad).</li>
                <li>Dokumen resmi siap cetak lengkap dengan lembar validasi Staff Keuangan/Kasir dan Manager Operasional.</li>
            </ul>
        `,
        descEn: `
            <p>A commercial sales report built on spreadsheets to consolidate transaction volumes, revenue performance across 15 product lines, and transaction benchmarks.</p>
            <br>
            <strong>Core Modules:</strong>
            <ul>
                <li><strong>Sales Summary Dashboard:</strong> Scorecard featuring Rp 219,000,000 gross revenue, 123 units sold, Rp 14,600,000 average order, and Rp 34,000,000 peak transaction.</li>
                <li><strong>15-Product Line Registry:</strong> Granular inventory log covering hardware, gadgets, and peripherals with automated price extensions.</li>
                <li><strong>Visual Sales Comparison:</strong> Horizontal bar charts delivering clear visual contrast of product revenue contributions.</li>
            </ul>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Sales Administration & Financial Reporting Specialist</li>
                <li>Spreadsheet Modeler (SUM, AVERAGE, MAX, MIN & Product Analytics)</li>
                <li>Official Sales Summary & Cashier Documentation Author</li>
            </ul>
            <br>
            <strong>Key Impact:</strong>
            <ul>
                <li>100% automated revenue math and statistical benchmarking without manual calculations.</li>
                <li>Instant visibility into flagship revenue drivers (ASUS VivoBook Laptop & Apple iPad).</li>
                <li>Print-ready commercial report complete with verification sign-offs by Finance/Cashier and Sales Manager.</li>
            </ul>
        `,
        featuresId: [
            "Dashboard Penjualan: Scorecard pendapatan Rp 219 Juta, 123 unit terjual, dan rata-rata per transaksi.",
            "Tabel 15 Lini Produk: Rekapitulasi lengkap unit, harga satuan, dan kalkulasi omzet otomatis.",
            "Grafik Komparasi Visual: Diagram batang komparasi kontribusi pendapatan antar-produk.",
            "Statistik Penjualan Otomatis: Formula dinamis untuk rata-rata, transaksi tertinggi, dan terendah.",
            "Pengesahan Dua Lapis: Lembar validasi resmi dari Staff Keuangan & Kasir serta Manager Sales."
        ],
        featuresEn: [
            "Sales Dashboard: Scorecards for Rp 219M revenue, 123 units sold, and average order value.",
            "15-Product Line Registry: Structured summary of quantities, unit prices, and revenue calculations.",
            "Visual Comparison Chart: Horizontal bar diagram highlighting comparative product performance.",
            "Automated Sales Stats: Dynamic formulas computing average, maximum, and minimum transaction values.",
            "Two-Tier Approval: Formal sign-off workflow covering Finance/Cashier Staff and Sales Operations Manager."
        ]
    }
};

/* ==========================================================================
   PROJECT MODAL & CAROUSEL CONTROLLER
   ========================================================================== */
let currentSlideIndex = 0;
let modalSlides = [];

function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    window.activeProjectId = projectId;

    const modal = document.getElementById('projectModal');
    const titleSpan = document.getElementById('projectModalTitle');
    const tagsContainer = document.getElementById('projectModalTags');
    const descContainer = document.getElementById('projectModalDesc');
    const mediaContainer = document.getElementById('projectModalMedia');
    const slidesContainer = document.getElementById('carouselSlides');
    const dotsContainer = document.getElementById('carouselDots');
    const featuresLeftContainer = document.getElementById('projectModalFeaturesLeft');
    const featuresRightContainer = document.getElementById('projectModalFeaturesRight');

    const currentLang = document.documentElement.getAttribute('data-lang') || 'id';

    // 1. Set Title & Description
    titleSpan.textContent = currentLang === 'id' ? project.titleId : project.titleEn;
    descContainer.innerHTML = currentLang === 'id' ? project.descId : project.descEn;

    // 2. Set Tags
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // 3. Clear Features containers
    featuresLeftContainer.innerHTML = '';
    featuresRightContainer.innerHTML = '';
    featuresLeftContainer.style.display = 'none';
    featuresRightContainer.style.display = 'none';

    // 4. Setup Carousel Images
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    currentSlideIndex = 0;

    const hasImages = project.images && project.images.length > 0;

    if (hasImages) {
        mediaContainer.style.display = 'block';
        modalSlides = project.images;

        project.images.forEach((imgUrl, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `${project.titleId} Slide ${index + 1}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.style.cursor = 'zoom-in';
            img.title = 'Klik untuk memperbesar gambar';
            img.onclick = () => openImageModal(imgUrl);
            slide.appendChild(img);
            slidesContainer.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.onclick = () => showSlide(index);
            dotsContainer.appendChild(dot);
        });

        showSlide(0);

        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');
        if (project.images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';
        }
    } else {
        mediaContainer.style.display = 'none';
        modalSlides = [];
    }

    // 5. Populate Key Features
    const targetFeaturesContainer = hasImages ? featuresLeftContainer : featuresRightContainer;
    const featuresList = currentLang === 'id' ? project.featuresId : project.featuresEn;

    if (featuresList && featuresList.length > 0) {
        targetFeaturesContainer.style.display = 'block';

        const heading = document.createElement('h3');
        heading.textContent = currentLang === 'id' ? 'Fitur Unggulan:' : 'Key Features:';
        targetFeaturesContainer.appendChild(heading);

        const ul = document.createElement('ul');
        featuresList.forEach(feat => {
            const li = document.createElement('li');
            li.innerHTML = feat;
            ul.appendChild(li);
        });
        targetFeaturesContainer.appendChild(ul);
    }

    // 6. Display Modal & Lock Background Scroll
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.activeProjectId = null;
    }
}

function showSlide(index) {
    if (modalSlides.length === 0) return;

    if (index >= modalSlides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = modalSlides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    const slidesContainer = document.getElementById('carouselSlides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    const dots = document.querySelectorAll('#carouselDots .dot');
    dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function moveSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

// Touch / Swipe Navigation Support on Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });
    }

    function handleGesture() {
        if (touchEndX < touchStartX - 40) {
            moveSlide(1); // Swipe Left -> Next Slide
        }
        if (touchEndX > touchStartX + 40) {
            moveSlide(-1); // Swipe Right -> Previous Slide
        }
    }
});

/* ==========================================================================
   CV VIEWER MODAL
   ========================================================================== */
function openCVModal(pdfUrl = 'pdf/CV%20Rusi%20Adristi-IT.pdf') {
    const modal = document.getElementById('cvModal');
    const frame = document.getElementById('cvFrame');
    const downloadBtn = document.getElementById('cvDownloadBtn');
    const openNewTabBtn = document.getElementById('cvOpenNewTabBtn');

    const cleanUrl = pdfUrl ? encodeURI(decodeURI(pdfUrl)) : 'pdf/CV%20Rusi%20Adristi-IT.pdf';
    const viewerUrl = cleanUrl.includes('#') ? cleanUrl : `${cleanUrl}#view=FitH`;

    if (modal && frame) {
        frame.src = viewerUrl;
        if (downloadBtn) downloadBtn.href = cleanUrl;
        if (openNewTabBtn) openNewTabBtn.href = cleanUrl;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCVModal() {
    const modal = document.getElementById('cvModal');
    const frame = document.getElementById('cvFrame');

    if (modal) {
        modal.style.display = 'none';
        if (frame) frame.src = '';
        document.body.style.overflow = 'auto';
    }
}

/* ==========================================================================
   IMAGE LIGHTBOX MODAL
   ========================================================================== */
function openImageModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imgModalContent');

    if (modal && modalImg) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modalImg.src = imgSrc;
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close Modals when clicking on backdrop
window.addEventListener('click', (event) => {
    const cvModal = document.getElementById('cvModal');
    const projectModal = document.getElementById('projectModal');
    const imageModal = document.getElementById('imageModal');

    if (event.target === cvModal) closeCVModal();
    if (event.target === projectModal) closeProjectModal();
    if (event.target === imageModal) closeImageModal();
});
