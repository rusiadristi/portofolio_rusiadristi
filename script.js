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
            <p><strong>Sweet & Crust</strong> merupakan konsep platform <em>Point of Sale (POS) & Management for Modern Bakeries</em> berbasis mobile yang dirancang di <strong>Figma</strong> untuk mendukung modernisasi operasional toko roti. Proyek ini mencakup perancangan antarmuka pengguna (UI/UX), riset kebutuhan operasional toko bakery, penyusunan alur kasir terintegrasi (<em>seamless cashier interface</em>), serta perencanaan fitur pelaporan omzet real-time dan manajemen multi-user role. Solusi yang dirancang bertujuan membantu pemilik bakery dan staf dalam efisiensi pencatatan transaksi, katalog varian kue, pengelolaan stok, dan pemantauan performa bisnis secara terintegrasi.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Business Analyst</li>
                <li>Market Researcher</li>
                <li>Information Architecture & User Flow Designer</li>
                <li>Interactive Prototyping (Figma)</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Perancangan Desain POS Bakery Modern:</strong> Berhasil merancang antarmuka UI/UX aplikasi Point of Sale toko roti modern yang intuitif, mencakup alur kasir cepat, katalog menu dinamis, dan sistem cetak struk digital.</li>
                <li><strong>High-Fidelity Prototype & Design System:</strong> Menghasilkan komponen desain yang konsisten, wireframe detail, dan prototipe interaktif lengkap di Figma untuk simulasi transaksi dan pengujian pengguna.</li>
                <li><strong>Solusi Digitalisasi Manajemen Toko Roti:</strong> Merancang konsep pelaporan omzet real-time, manajemen tim multi-role, dan pemantauan stok untuk meningkatkan efisiensi operasional bisnis bakery.</li>
            </ul>
        `,
        descEn: `
            <p><strong>Sweet & Crust</strong> is a mobile <em>Point of Sale (POS) & Management for Modern Bakeries</em> concept platform designed in <strong>Figma</strong> to accelerate the digital transformation of bakery store operations. The project encompasses user interface & user experience (UI/UX) design, bakery workflow market research, seamless cashier interface structuring, real-time revenue analytics planning, and multi-user role management. The solution aims to empower bakery owners and staff with streamlined order handling, cake catalog management, live inventory tracking, and integrated business insights.</p>
            <br>
            <strong>My Key Roles:</strong>
            <ul>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Business Analyst</li>
                <li>Market Researcher</li>
                <li>Information Architecture & User Flow Designer</li>
                <li>Interactive Prototyping (Figma)</li>
            </ul>
            <br>
            <strong>Key Achievements & Outcomes:</strong>
            <ul>
                <li><strong>Modern Bakery POS Design:</strong> Successfully designed an intuitive UI/UX for a modern bakery Point of Sale system featuring fast cashier workflows, dynamic menu catalogs, and digital receipt printing.</li>
                <li><strong>High-Fidelity Prototype & Design System:</strong> Created a consistent design system, high-fidelity wireframes, and a comprehensive interactive prototype in Figma for usability testing and user flow simulation.</li>
                <li><strong>Digitalization Solution for Bakery Management:</strong> Conceptualized real-time revenue reporting, multi-user role administration, and inventory monitoring to elevate operational efficiency for bakery businesses.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Seamless Kasir Interface (Transactions):</strong> Antarmuka kasir cepat dan mudah untuk pencatatan transaksi pesanan dine-in & takeaway.",
            "<strong>Realtime Sales Reports (Dashboards):</strong> Dasbor laporan omzet real-time dan visualisasi grafik tren penjualan 7 hari terakhir.",
            "<strong>Online Product Catalog (Cake Management):</strong> Katalog produk kue interaktif dengan kontrol varian, harga, dan ketersediaan stok.",
            "<strong>Multi-user Roles (Staff & Admin):</strong> Pemisahan hak akses kerja yang aman antara Admin (manajemen & laporan) dan Kasir (transaksi).",
            "<strong>Easy Bakery Accounting & Print Struk:</strong> Rekap histori transaksi otomatis dan detail transaksi dengan fitur cetak struk kasir.",
            "<strong>Manajemen Tim & Pengelolaan Stok:</strong> Pengawasan operasional staf toko dan monitoring stok ketersediaan kue."
        ],
        featuresEn: [
            "<strong>Seamless Cashier Interface (Transactions):</strong> Fast and intuitive POS cashier order logging for dine-in and takeaway.",
            "<strong>Realtime Sales Reports (Dashboards):</strong> Real-time revenue reports and 7-day sales trend visualization graphs.",
            "<strong>Online Product Catalog (Cake Management):</strong> Interactive cake product catalog with variant, pricing, and stock status control.",
            "<strong>Multi-user Roles (Staff & Admin):</strong> Role-based access control strictly separating Admin and Cashier permissions.",
            "<strong>Easy Bakery Accounting & Receipt Printing:</strong> Automated transaction history recaps and instant receipt printing.",
            "<strong>Team Management & Stock Control:</strong> Store staff operational oversight and live cake inventory monitoring."
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
            "gambar/waroeng-ngemil.png"
        ],
        descId: `
            <p><strong>Sistem Kasir dan Pemesanan F&B Waroeng Ngemil</strong> merupakan aplikasi mobile berbasis Flutter dan Firebase untuk mengoptimalkan operasional transaksi kuliner secara digital. Sistem ini mengintegrasikan pemilihan katalog menu dinamis, autentikasi akun kasir terenkripsi, manajemen keranjang pesanan interaktif, kalkulasi otomatis subtotal dan pajak, hingga penerbitan struk transaksi digital (paperless) secara real-time.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Full-Stack Mobile Developer (Flutter, Dart, Firebase)</li>
                <li>Mobile UI/UX Designer & Prototyper (Mobile-First Experience)</li>
                <li>Cloud Database & Authentication Architect (Firebase)</li>
                <li>Mobile State Management & Business Logic Engineer</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Digitalisasi Alur Transaksi Kasir:</strong> Mentransformasi pencatatan pesanan manual ke aplikasi mobile POS untuk meminimalkan antrean dan mempercepat checkout pesanan.</li>
                <li><strong>Integrasi Cloud Backend (Firebase):</strong> Mengamankan autentikasi kasir serta menyinkronkan data katalog produk dan transaksi secara instan via cloud realtime database.</li>
                <li><strong>Kalkulasi Pesanan Presisi:</strong> Mengembangkan keranjang belanja reaktif dengan kalkulasi otomatis subtotal, diskon, pajak, dan kembalian secara akurat tanpa redundansi data.</li>
                <li><strong>Struk Transaksi Digital (Paperless):</strong> Menghasilkan bukti pembayaran digital instan berbasis kode transaksi unik guna meningkatkan efisiensi dan transparansi operasional.</li>
            </ul>
        `,
        descEn: `
            <p>The <strong>Waroeng Ngemil F&B POS and Ordering System</strong> is a mobile application built with Flutter and Firebase designed to optimize digital culinary transactions. The platform integrates dynamic menu catalogs, encrypted cashier authentication, interactive cart management, automated subtotal and tax calculations, and instant paperless digital receipt generation in real-time.</p>
            <br>
            <strong>My Key Roles:</strong>
            <ul>
                <li>Full-Stack Mobile Developer (Flutter, Dart, Firebase)</li>
                <li>Mobile UI/UX Designer & Prototyper (Mobile-First Experience)</li>
                <li>Cloud Database & Authentication Architect (Firebase)</li>
                <li>Mobile State Management & Business Logic Engineer</li>
            </ul>
            <br>
            <strong>Key Achievements:</strong>
            <ul>
                <li><strong>Operational Cashier Digitalization:</strong> Streamlined manual order taking into a mobile POS app, reducing queue times and accelerating checkout.</li>
                <li><strong>Serverless Cloud Integration (Firebase):</strong> Secured cashier authentication and synchronized menu catalogs and transaction data in real-time.</li>
                <li><strong>Accurate Order Calculation:</strong> Engineered a reactive cart computing subtotals, discounts, taxes, and change accurately without data redundancy.</li>
                <li><strong>Paperless Digital Receipts:</strong> Generated instant digitized payment receipts with unique transaction IDs for operational efficiency.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Katalog Menu & Produk Dinamis:</strong> Pengelolaan dan penataan daftar menu kuliner secara fleksibel.",
            "<strong>Autentikasi Kasir (Firebase Auth):</strong> Sistem verifikasi login akun kasir yang terenkripsi dan aman.",
            "<strong>Keranjang Pesanan Interaktif:</strong> Penambahan, pengurangan, dan penyesuaian item menu secara responsif.",
            "<strong>Kalkulasi Total Otomatis:</strong> Perhitungan tagihan pesanan, pajak, diskon, hingga uang kembalian secara presisi.",
            "<strong>Struk Digital Real-Time:</strong> Pembuatan tanda bukti transaksi digital tanpa kertas (paperless) sesaat setelah pembayaran selesai."
        ],
        featuresEn: [
            "<strong>Dynamic Menu Catalog:</strong> Flexible organization and presentation of food & beverage listings.",
            "<strong>Cashier Authentication (Firebase Auth):</strong> Secure, encrypted cashier account authorization.",
            "<strong>Interactive Order Cart:</strong> Responsive real-time increment, decrement, and item adjustments.",
            "<strong>Automated Bill Calculation:</strong> Accurate calculation of subtotal, discounts, taxes, and change.",
            "<strong>Real-Time Digital Receipt:</strong> Instant paperless digital proof of payment generated upon checkout."
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
            <p><strong>GoSwift</strong> merupakan konsep platform penjualan tiket bus AKDP berbasis digital yang dirancang untuk mendukung transformasi digital transportasi darat di Sumatera Barat. Proyek ini mencakup penyusunan Business Model Canvas (BMC), market research, business plan, strategi monetisasi, serta perancangan UI/UX aplikasi. Solusi yang dirancang bertujuan membantu perusahaan otobus dalam digitalisasi penjualan tiket, manajemen kursi, pembayaran digital, serta pelaporan operasional secara terintegrasi untuk meningkatkan efisiensi layanan dan operasional bisnis.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Business Analyst</li>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Market Researcher</li>
                <li>Business Model Canvas (BMC) Development</li>
                <li>Business Plan Development</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Entrepreneurship Award IX (Rencana Bisnis):</strong> Berhasil mempresentasikan inovasi ini di hadapan dewan juri nasional dan terpilih sebagai finalis.</li>
                <li><strong>GEMASTIK XVIII (Pengembangan Bisnis TIK):</strong> Berhasil menghasilkan Business Model Canvas, analisis pasar, dan strategi monetisasi untuk mendukung pengembangan platform GoSwift.</li>
                <li>Solusi digitalisasi transportasi darat AKDP di wilayah Sumatera Barat.</li>
            </ul>
        `,
        descEn: `
            <p><strong>GoSwift</strong> is a digital AKDP bus ticketing platform concept designed to accelerate the digital transformation of land passenger transport in West Sumatra. The project encompasses Business Model Canvas (BMC) formulation, market research, business plan development, monetization strategy, and comprehensive UI/UX application design. The designed solution aims to assist bus operators in digitizing ticket sales, seat management, digital payments, and integrated operational reporting to enhance service efficiency and business operations.</p>
            <br>
            <strong>My Roles:</strong>
            <ul>
                <li>Business Analyst</li>
                <li>UI/UX Designer</li>
                <li>Product Planner</li>
                <li>Market Researcher</li>
                <li>Business Model Canvas (BMC) Development</li>
                <li>Business Plan Development</li>
            </ul>
            <br>
            <strong>Achievements:</strong>
            <ul>
                <li><strong>Entrepreneurship Award IX (Business Plan):</strong> Successfully pitched the innovation before the national jury panel and selected as a finalist.</li>
                <li><strong>GEMASTIK XVIII (ICT Business Development):</strong> Successfully formulated Business Model Canvas, market analysis, and monetization strategy to support GoSwift platform development.</li>
                <li>Digitalization solution for AKDP intercity land transport across West Sumatra.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Pemesanan Tiket Online:</strong> Pemesanan tiket bus AKDP secara online.",
            "<strong>Jadwal & Rute Real-Time:</strong> Informasi jadwal, rute, dan ketersediaan kursi secara real-time.",
            "<strong>Pemilihan Kursi Interaktif:</strong> Pemilihan kursi interaktif.",
            "<strong>E-Ticket Berbasis QR Code:</strong> E-Ticket berbasis QR Code.",
            "<strong>Pembayaran Digital:</strong> Pembayaran digital (QRIS, E-Wallet, Virtual Account, Transfer Bank).",
            "<strong>Dashboard Laporan Operasional:</strong> Dashboard laporan penjualan dan operasional.",
            "<strong>Sistem Notifikasi:</strong> Sistem notifikasi perjalanan dan status pemesanan.",
            "<strong>Manajemen Data Pelanggan:</strong> Manajemen data pelanggan dan analisis transaksi."
        ],
        featuresEn: [
            "<strong>Online Ticket Booking:</strong> Online booking for AKDP bus tickets.",
            "<strong>Real-Time Schedule & Route:</strong> Real-time schedule, route, and seat availability information.",
            "<strong>Interactive Seat Selection:</strong> Interactive seat selection layout.",
            "<strong>QR Code E-Ticket:</strong> QR Code-based digital E-Ticket.",
            "<strong>Digital Payments:</strong> Digital payment integration (QRIS, E-Wallet, Virtual Account, Bank Transfer).",
            "<strong>Operational Dashboard:</strong> Sales and operational reporting dashboard.",
            "<strong>Trip Notification System:</strong> Travel alerts and order status notifications.",
            "<strong>Customer Data Management:</strong> Customer data management and transaction analytics."
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
            "gambar/gj-pengaturan.png"
        ],
        descId: `
            <p><strong>Sistem Informasi Manajemen Percetakan dan Penjualan</strong> pada <strong>PT. Grafika Jaya Sumbar</strong> merupakan solusi digital berbasis web (PHP Native OOP & MySQL) untuk mengatasi kendala pencatatan manual operasional percetakan. Sistem ini mengintegrasikan manajemen inventaris produk, modul kasir Point of Sale (POS) dengan kalkulasi PPN 11%, alur verifikasi bukti pembayaran digital, hingga penyusunan laporan keuangan otomatis dan visualisasi tren penjualan real-time.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Full-Stack Web Developer (PHP Native OOP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Dashboard Analytics Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Digitalisasi Alur Transaksi:</strong> Mentransformasi pencatatan konvensional ke sistem POS digital untuk meminimalkan <em>human error</em> serta mengotomatiskan kalkulasi harga dan PPN 11%.</li>
                <li><strong>Otomatisasi Laporan Keuangan:</strong> Memangkas waktu penyusunan laporan penjualan harian dan bulanan menjadi instan dengan filter tanggal dan ekspor data siap cetak (CSV/Print).</li>
                <li><strong>Pengendalian Stok Real-Time:</strong> Menjaga akurasi persediaan fisik dan sistem melalui sinkronisasi stok otomatis pasca-transaksi.</li>
                <li><strong>Transparansi Verifikasi Pembayaran:</strong> Mempercepat validasi transaksi non-tunai melalui peninjauan bukti transfer digital secara terpusat.</li>
            </ul>
        `,
        descEn: `
            <p>The <strong>Printing and Sales Management Information System</strong> at <strong>PT. Grafika Jaya Sumbar</strong> is a web-based enterprise solution (PHP Native OOP & MySQL) built to eliminate operational bottlenecks in manual logging. The platform centralizes product inventory management, Point of Sale (POS) checkout with automated 11% VAT calculation, multi-stage order workflows with digital payment slip verification, and automated financial reporting.</p>
            <br>
            <strong>My Key Roles:</strong>
            <ul>
                <li>Full-Stack Web Developer (PHP Native OOP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Dashboard Analytics Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            <strong>Key Achievements:</strong>
            <ul>
                <li><strong>Operational Workflow Digitalization:</strong> Streamlined conventional receipts into a digital POS, eliminating human errors and automating price and 11% VAT calculations.</li>
                <li><strong>Automated Financial Reporting:</strong> Cut report preparation times into instant summaries with date filters, printable formats, and CSV exports.</li>
                <li><strong>Real-Time Stock Synchronization:</strong> Maintained inventory accuracy between physical stock and system records automatically upon transaction.</li>
                <li><strong>Payment Verification Transparency:</strong> Accelerated non-cash payment validation through centralized digital transfer slip verification.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Executive Dashboard & Sales Analytics:</strong> Metrik pendapatan bulanan, total produk aktif, dan grafik tren penjualan dinamis (Chart.js).",
            "<strong>Master Product & Inventory Control:</strong> Pengelolaan terpusat produk cetak & ATK dengan pembaruan stok otomatis.",
            "<strong>Point of Sale (POS) Module:</strong> Kasir terpadu (tunai & transfer), hitung subtotal & PPN 11%, kalkulasi kembalian, dan catatan transaksi.",
            "<strong>Order Processing & Payment Verification:</strong> Alur pesanan bertahap (Pending, Proses, Sukses, Tolak) dengan peninjauan bukti transfer digital.",
            "<strong>Role-Based Access Control (RBAC):</strong> Hak akses berjenjang untuk Direktur Utama/Admin, Kasir, dan Pelanggan.",
            "<strong>Financial Reporting & Export Engine:</strong> Rekap transaksi berkala dengan filter rentang tanggal, cetak dokumen, dan ekspor CSV.",
            "<strong>Store Profile & Receipt Settings:</strong> Kustomisasi identitas perusahaan, data kontak, unggah logo resmi, dan catatan struk."
        ],
        featuresEn: [
            "<strong>Executive Dashboard & Sales Analytics:</strong> Monthly revenue metrics, product counts, and dynamic sales trend graphs (Chart.js).",
            "<strong>Master Product & Inventory Control:</strong> Centralized printing & stationery product database with automated stock decrement.",
            "<strong>Point of Sale (POS) Module:</strong> Integrated cashier supporting cash/transfer, 11% VAT computation, and change calculation.",
            "<strong>Order Processing & Payment Verification:</strong> Multi-step order lifecycle (Pending, Processing, Completed, Rejected) with digital slip review.",
            "<strong>Role-Based Access Control (RBAC):</strong> Multi-level authorization for Director/Admin, Cashier, and Customers.",
            "<strong>Financial Reporting & Export Engine:</strong> Date-range filtered sales recapitulation with document printing and CSV exports.",
            "<strong>Store Profile & Receipt Settings:</strong> Corporate identity management, contact details, official logo, and custom receipt notes."
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
            <p><strong>Sweet & Crust Web App</strong> merupakan sistem informasi kasir dan manajemen operasional toko roti berbasis web yang dikembangkan menggunakan <strong>Laravel Framework (PHP & MySQL)</strong> sebagai proyek tugas akhir dan uji kompetensi program pelatihan <strong>Web Programmer</strong>. Sistem ini dirancang untuk mendigitalisasi proses transaksi kasir, manajemen stok kue harian, serta pelaporan keuangan operasional toko roti secara terintegrasi.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Database Architect & Relational Schema Designer (MySQL & Eloquent ORM)</li>
                <li>Backend API & Security Engineer (Role-Based Authentication & Session Management)</li>
                <li>Frontend Integration & Responsive UI Developer (Bootstrap & JavaScript)</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Implementasi Arsitektur MVC & CRUD Lengkap:</strong> Membangun sistem web terstruktur berbasis framework Laravel dengan modul CRUD inventaris kue, manajemen kategori, dan pengelolaan akun staf.</li>
                <li><strong>Multi-Role Authentication & Keamanan Akses:</strong> Menerapkan pemisahan hak akses kerja yang aman antara level Admin (analisis omzet, kontrol stok, kelola staf) dan Kasir (transaksi cepat dan cetak struk).</li>
                <li><strong>Otomatisasi Kalkulasi Transaksi & Omzet:</strong> Mengembangkan modul kasir interaktif dengan kalkulasi total otomatis, pencatatan histori pesanan, dan pembaruan stok real-time pasca-transaksi.</li>
                <li><strong>Kelulusan Uji Kompetensi Pelatihan:</strong> Berhasil menyelesaikan proyek akhir pelatihan Web Programmer dengan predikat sangat memuaskan dan memenuhi standar sertifikasi teknis.</li>
            </ul>
        `,
        descEn: `
            <p><strong>Sweet & Crust Web App</strong> is a digital Point of Sale (POS) and bakery operations management web application built with the <strong>Laravel Framework (PHP & MySQL)</strong> as the capstone certification project for the <strong>Web Programmer</strong> training program. The system digitalizes cashier checkout workflows, daily bakery inventory controls, and financial reporting into an integrated web ecosystem.</p>
            <br>
            <strong>My Key Roles:</strong>
            <ul>
                <li>Full-Stack Web Developer (Laravel Framework, PHP, MySQL, Blade Templating)</li>
                <li>Database Architect & Relational Schema Designer (MySQL & Eloquent ORM)</li>
                <li>Backend API & Security Engineer (Role-Based Authentication & Session Management)</li>
                <li>Frontend Integration & Responsive UI Developer (Bootstrap & JavaScript)</li>
            </ul>
            <br>
            <strong>Key Achievements:</strong>
            <ul>
                <li><strong>Full MVC Architecture & CRUD Implementation:</strong> Engineered a clean MVC web structure in Laravel covering dynamic catalog CRUD, category administration, and staff management.</li>
                <li><strong>Multi-Role Authentication & Security:</strong> Enforced role-based access control segregating Admin (revenue analytics, stock replenishment, staff control) and Cashier duties.</li>
                <li><strong>Automated Billing & Sales Recapitulation:</strong> Built an interactive POS cashier module automating order totals, live inventory decrement, and revenue aggregation.</li>
                <li><strong>Certification Project Distinction:</strong> Successfully accomplished the Web Programmer final capstone examination with outstanding distinction according to technical standards.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Seamless Web POS Interface:</strong> Modul kasir berbasis web yang cepat untuk pencatatan pesanan dan kalkulasi total otomatis.",
            "<strong>Real-time Sales & Revenue Analytics:</strong> Dasbor laporan omzet real-time dengan grafik tren penjualan 7 hari terakhir.",
            "<strong>Master Catalog & Inventory Management:</strong> Pengelolaan data produk kue, harga, varian, dan sinkronisasi stok otomatis (CRUD).",
            "<strong>Role-Based Authentication:</strong> Autentikasi berjenjang yang aman memisahkan wewenang antara Admin dan Kasir.",
            "<strong>Riwayat Transaksi & Cetak Struk:</strong> Rekap histori penjualan komprehensif dan pembuatan bukti transaksi digital.",
            "<strong>Manajemen Staf Toko:</strong> Pengelolaan data akun dan hak akses operasional kasir toko roti."
        ],
        featuresEn: [
            "<strong>Seamless Web POS Interface:</strong> High-speed web cashier module for rapid order processing and automated billing calculation.",
            "<strong>Real-time Sales & Revenue Analytics:</strong> Live revenue dashboards with 7-day sales trend visualization graphs.",
            "<strong>Master Catalog & Inventory Management:</strong> Dynamic cake product catalog, pricing, variants, and automated stock synchronization (CRUD).",
            "<strong>Role-Based Authentication:</strong> Secure multi-tier authentication strictly separating Admin and Cashier privileges.",
            "<strong>Transaction History & Receipt Printing:</strong> Comprehensive sales audit logs and digital receipt generation.",
            "<strong>Staff Account Management:</strong> Administration of cashier user credentials and store permissions."
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
            <p><strong>Apotek Asyifa</strong> merupakan sistem informasi manajemen operasional apotek berbasis web (<em>Pharmacy Back-Office System</em>) yang dikembangkan dengan <strong>PHP & MySQL</strong> untuk mengoptimalkan tata kelola inventaris obat, pengawasan masa kedaluwarsa, dan pencatatan riwayat transaksi farmasi.</p>
            <p>Berfokus pada administrasi <em>back-office</em>, sistem ini mengintegrasikan master data obat, kategori, unit sediaan, direktori pemasok (<em>supplier</em>), pemantauan stok kritis, deteksi dini obat kedaluwarsa (&lt; 60 hari) beserta lokasi rak penyimpanan, serta pencatatan audit log transaksi pembelian dan penjualan dengan visualisasi analitik omzet berbasis <strong>Chart.js</strong>.</p>
            <br>
            <strong>Peran Saya:</strong>
            <ul>
                <li>Full-Stack Web Developer (PHP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Data Visualization Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            <strong>Pencapaian:</strong>
            <ul>
                <li><strong>Digitalisasi Tata Kelola Farmasi:</strong> Menyatukan pengelolaan master obat, unit dosis, kategori, dan pemasok ke dalam sistem terpusat untuk mencegah selisih stok.</li>
                <li><strong>Mitigasi Risiko Obat Kedaluwarsa:</strong> Menerapkan sistem peringatan dini obat hampir kedaluwarsa (&lt; 60 hari) dan pemetaan rak guna menekan potensi kerugian dan menjaga mutu obat.</li>
                <li><strong>Pencatatan Transaksi & Audit Log:</strong> Mengotomatiskan pencatatan riwayat transaksi pembelian distributor dan penjualan dengan nomor referensi unik.</li>
                <li><strong>Visualisasi Data & Laporan Finansial:</strong> Mengembangkan grafik tren omzet, diagram komparasi kategori (Antibiotik vs Salep), serta rekapitulasi data siap ekspor.</li>
            </ul>
        `,
        descEn: `
            <p><strong>Apotek Asyifa</strong> is a web-based <em>Pharmacy Back-Office Management System</em> developed using <strong>PHP & MySQL</strong> to streamline pharmaceutical inventory control, expiration risk monitoring, and transaction auditing.</p>
            <p>Tailored for back-office administration, the platform centralizes master drug records, categories, dosage units, supplier profiles, out-of-stock tracking, early expiration detection (&lt; 60 days) with shelf/rack mapping, and structured sales and purchase logging backed by <strong>Chart.js</strong> revenue analytics.</p>
            <br>
            <strong>My Key Roles:</strong>
            <ul>
                <li>Full-Stack Web Developer (PHP, MySQL, JavaScript, Bootstrap)</li>
                <li>Database Architect & Relational Schema Designer</li>
                <li>Business Process Analyst & System Flow Designer</li>
                <li>Frontend & Data Visualization Engineer (Chart.js & DataTables)</li>
            </ul>
            <br>
            <strong>Key Achievements:</strong>
            <ul>
                <li><strong>Centralized Pharmacy Digitalization:</strong> Consolidated drug catalogs, dosage units, categories, and supplier records into an integrated relational database.</li>
                <li><strong>Drug Expiration Risk Mitigation:</strong> Implemented automated alerts for near-expiry drugs (&lt; 60 days) and shelf mapping to eliminate waste and uphold quality standards.</li>
                <li><strong>Structured Transaction Auditing:</strong> Automated purchase and sales record keeping with unique reference tracking codes.</li>
                <li><strong>Data Visualization & Reporting Engine:</strong> Delivered interactive sales trend graphs, category comparisons (Antibiotics vs Ointments), and export-ready financial logs.</li>
            </ul>
        `,
        featuresId: [
            "<strong>Dasbor Eksekutif:</strong> Metrik real-time total obat, kategori, pemasok, unit, serta ringkasan total pembelian dan penjualan.",
            "<strong>Deteksi Dini Obat Kedaluwarsa (< 60 Hari):</strong> Monitoring otomatis status obat kedaluwarsa dan peringatan mendekati batas kedaluwarsa beserta nomor rak simpan.",
            "<strong>Log Transaksi Penjualan & Pembelian:</strong> Pencatatan riwayat transaksi masuk (distributor) dan keluar (penjualan) dengan nomor referensi unik.",
            "<strong>Grafik Omzet & Varian Terlaris:</strong> Visualisasi tren penjualan berkala dan monitoring varian obat terlaris berbasis Chart.js.",
            "<strong>Grafik Komparasi Kategori Farmasi:</strong> Analisis perbandingan volume penjualan antar kelompok obat (misal: Antibiotik vs Salep).",
            "<strong>Master Data Obat & Pemasok:</strong> Pengelolaan basis data katalog obat, kategori, satuan unit sediaan, dan direktori supplier resmi.",
            "<strong>Ekspor Laporan Finansial (DataTables):</strong> Filter rentang tanggal dan ekspor data pembukuan lengkap (Copy, CSV, Print)."
        ],
        featuresEn: [
            "<strong>Executive Dashboard:</strong> Real-time overview of total medicines, categories, suppliers, units, and cumulative sales/purchases.",
            "<strong>Early Expiration Detection (< 60 Days):</strong> Automated alerts for expired and near-expiry drugs with designated shelf/rack storage numbers.",
            "<strong>Sales & Purchase Transaction Logs:</strong> Structured logging for distributor procurement and sales with unique reference codes.",
            "<strong>Revenue Trends & Bestseller Analytics:</strong> Interactive revenue trend lines and top-selling pharmaceutical variant tracking (Chart.js).",
            "<strong>Category Comparison Bar Chart:</strong> Comparative analytics visualizing sales distribution across drug categories.",
            "<strong>Master Medicine & Supplier Data:</strong> Comprehensive database management for drug items, categories, dosage units, and verified suppliers.",
            "<strong>DataTables Export Engine:</strong> Flexible date filtering with instant multi-format data export (Copy, CSV, Print)."
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
