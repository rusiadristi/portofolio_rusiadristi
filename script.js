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

    // 2. Navbar Background Blur & Scroll State
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

    // 4. ScrollSpy: Highlight Active Nav Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    const highlightNavLink = () => {
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNavLink, { passive: true });

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
    const wordsId = ["Web Development", "IT Business Analyst", "System Analysis", "UI/UX Design", "Mobile Development"];
    const wordsEn = ["Web Development", "IT Business Analyst", "System Analysis", "UI/UX Design", "Mobile Development"];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterSpan = document.getElementById('typewriter');
    if (!typewriterSpan) return;

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
            "gambar/sc-katalog.png",
            "gambar/sc-laporan-omzet.png",
            "gambar/sc-kelola-katalog.png",
            "gambar/sc-kelola-staf.png"
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
function openCVModal(pdfUrl) {
    const modal = document.getElementById('cvModal');
    const frame = document.getElementById('cvFrame');

    if (modal && frame) {
        frame.src = pdfUrl;
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
