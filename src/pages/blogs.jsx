"use client";

import { useState, useMemo } from "react";

// ─── Sample Blog Data ────────────────────────────────────────────────────────
const BLOGS = [
  {
    id: 1,
    slug: "maximizing-solar-plant-efficiency",
    title: "Maximizing Solar Plant Efficiency Through Predictive Maintenance",
    excerpt:
      "Predictive maintenance powered by IoT sensors and AI analytics is transforming how solar plants operate — cutting unplanned downtime by up to 40% and boosting energy yield significantly.",
    category: "O&M Strategy",
    date: "March 10, 2025",
    readTime: "6 min read",
    author: "Rajesh Kumar",
    image: "/blog/predictive-maintenance.jpg",
    featured: true,
  },
  {
    id: 2,
    slug: "robotic-cleaning-solutions",
    title: "Robotic Panel Cleaning: The Future of Solar O&M",
    excerpt:
      "Dust accumulation on solar panels can reduce output by 20–40% in arid regions. We explore how autonomous robotic cleaning systems are revolutionizing maintenance cycles.",
    category: "Technology",
    date: "February 28, 2025",
    readTime: "5 min read",
    author: "Priya Nair",
    image: "/blog/robotic-cleaning.jpg",
    featured: false,
  },
  {
    id: 3,
    slug: "inverter-monitoring-best-practices",
    title: "Inverter Monitoring Best Practices for Large-Scale Solar Farms",
    excerpt:
      "Inverter failures account for over 60% of solar plant downtime. Learn the monitoring strategies that keep your plant running at peak capacity year-round.",
    category: "Technical Insights",
    date: "February 14, 2025",
    readTime: "8 min read",
    author: "Ankit Sharma",
    image: "/blog/inverter-monitoring.jpg",
    featured: false,
  },
  {
    id: 4,
    slug: "solar-plant-performance-benchmarks",
    title: "Understanding Solar Plant Performance Benchmarks in India",
    excerpt:
      "What does 'good performance' look like for a 10 MW solar plant in Rajasthan vs. one in Tamil Nadu? We break down the key KPIs and regional benchmarks every operator should track.",
    category: "Case Study",
    date: "January 30, 2025",
    readTime: "7 min read",
    author: "Divya Menon",
    image: "/blog/performance-benchmarks.jpg",
    featured: false,
  },
  {
    id: 5,
    slug: "thermal-imaging-inspections",
    title: "How Thermal Imaging Is Catching Faults Before They Become Failures",
    excerpt:
      "Drone-based thermal imaging inspections are uncovering hidden cell degradation, hot spots, and bypass diode failures that traditional visual inspection misses entirely.",
    category: "Technology",
    date: "January 18, 2025",
    readTime: "5 min read",
    author: "Rajesh Kumar",
    image: "/blog/thermal-imaging.jpg",
    featured: false,
  },
  {
    id: 6,
    slug: "om-contract-what-to-look-for",
    title: "Solar O&M Contracts: What Every Developer Should Look For",
    excerpt:
      "Not all O&M contracts are created equal. We outline the key clauses, SLA benchmarks, and performance guarantees that protect your plant's long-term ROI.",
    category: "O&M Strategy",
    date: "January 5, 2025",
    readTime: "9 min read",
    author: "Ankit Sharma",
    image: "/blog/om-contract.jpg",
    featured: false,
  },
];

const CATEGORIES = ["All", "O&M Strategy", "Technology", "Technical Insights", "Case Study"];

// ─── Category Pill Colors ─────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "O&M Strategy": { bg: "#1A3A2A", text: "#4ADE80", border: "#166534" },
  Technology: { bg: "#1A2A3A", text: "#60A5FA", border: "#1E3A5F" },
  "Technical Insights": { bg: "#2A1A1A", text: "#FB923C", border: "#7C2D12" },
  "Case Study": { bg: "#2A2A1A", text: "#FACC15", border: "#713F12" },
};

// ─── Placeholder Image Component ─────────────────────────────────────────────
function BlogImagePlaceholder({ category }) {
  const icons = {
    "O&M Strategy": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M8 40V20L24 8L40 20V40H28V30H20V40H8Z" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <circle cx="24" cy="22" r="4" stroke="#F97316" strokeWidth="2" fill="none" />
      </svg>
    ),
    Technology: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="14" width="36" height="24" rx="3" stroke="#60A5FA" strokeWidth="2" fill="none" />
        <path d="M16 38v4M32 38v4M12 42h24" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 22h6M14 28h10M14 34h4" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    "Technical Insights": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L28 18H42L31 26L35 38L24 30L13 38L17 26L6 18H20L24 6Z" stroke="#FB923C" strokeWidth="2" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    "Case Study": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="6" width="32" height="38" rx="3" stroke="#FACC15" strokeWidth="2" fill="none" />
        <path d="M14 16h20M14 22h20M14 28h12" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M20 35l4 4 8-8" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F1A2E 0%, #162233 100%)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {icons[category]}
        <span style={{ color: "#4B6A8A", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {category}
        </span>
      </div>
    </div>
  );
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ category, small = false }) {
  const colors = CATEGORY_COLORS[category] || { bg: "#1A1A2A", text: "#A0AEC0", border: "#2D3748" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: small ? "2px 10px" : "4px 12px",
        borderRadius: 100,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {category}
    </span>
  );
}

// ─── Featured Blog Card ───────────────────────────────────────────────────────
function FeaturedCard({ blog }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #1E3A5A",
        background: "#0D1B2E",
        cursor: "pointer",
        transition: "border-color 0.25s, box-shadow 0.25s",
        borderColor: hovered ? "#F97316" : "#1E3A5A",
        boxShadow: hovered ? "0 0 0 1px #F97316" : "none",
        marginBottom: 32,
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <BlogImagePlaceholder category={blog.category} />
        {/* Featured badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "#F97316",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 100,
          }}
        >
          Featured
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CategoryPill category={blog.category} />
          <span style={{ color: "#4B6A8A", fontSize: 12 }}>{blog.date}</span>
          <span style={{ color: "#4B6A8A", fontSize: 12 }}>·</span>
          <span style={{ color: "#4B6A8A", fontSize: 12 }}>{blog.readTime}</span>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#EDF2F7",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {blog.title}
        </h2>

        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#718096" }}>
          {blog.excerpt}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ color: "#4B6A8A", fontSize: 13 }}>By {blog.author}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#F97316",
              fontSize: 14,
              fontWeight: 600,
              transition: "gap 0.2s",
              gap: hovered ? 10 : 6,
            }}
          >
            Read Article
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid",
        borderColor: hovered ? "#F97316" : "#1E3A5A",
        background: "#0D1B2E",
        cursor: "pointer",
        transition: "border-color 0.25s, transform 0.2s, box-shadow 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(249,115,22,0.12)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ height: 200, overflow: "hidden", flexShrink: 0 }}>
        <BlogImagePlaceholder category={blog.category} />
      </div>

      {/* Content */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <CategoryPill category={blog.category} small />
          <span style={{ color: "#4B6A8A", fontSize: 11 }}>{blog.date}</span>
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#EDF2F7",
            fontFamily: "'Sora', sans-serif",
            flex: 1,
          }}
        >
          {blog.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.65,
            color: "#718096",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {blog.excerpt}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #1A2E45",
          }}
        >
          <span style={{ color: "#4B6A8A", fontSize: 12 }}>{blog.readTime}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#F97316",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Read more
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7.5 3.5L11 7l-3.5 3.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Blog Listing Page ───────────────────────────────────────────────────
export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const featuredBlog = BLOGS.find((b) => b.featured);
  const regularBlogs = BLOGS.filter((b) => !b.featured);

  const filteredBlogs = useMemo(() => {
    return regularBlogs.filter((blog) => {
      const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />

      <div
        style={{
          minHeight: "100vh",
          background: "#060F1C",
          color: "#EDF2F7",
          fontFamily: "'Sora', -apple-system, sans-serif",
        }}
      >
        {/* ── Hero / Header ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "80px 0 72px",
            overflow: "hidden",
            borderBottom: "1px solid #0D1B2E",
          }}
        >
          {/* Background grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: -120,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 300,
              background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "#4B6A8A", fontSize: 13 }}>
              <span>Home</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l4 4-4 4" stroke="#4B6A8A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ color: "#F97316" }}>Blogs</span>
            </div>

            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(249,115,22,0.1)",
                  border: "1px solid rgba(249,115,22,0.25)",
                  borderRadius: 100,
                  padding: "6px 16px",
                  marginBottom: 20,
                }}
              >
                <span style={{ color: "#F97316", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Insights & Resources
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Solar O&M{" "}
                <span style={{ color: "#F97316" }}>Knowledge Hub</span>
              </h1>

              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#718096", maxWidth: 520 }}>
                Expert insights on solar plant operations, maintenance strategies, and emerging technologies — from practitioners in the field.
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters & Search Bar ───────────────────────────────────────────── */}
        <div style={{ background: "#080F1A", borderBottom: "1px solid #0D1B2E", position: "sticky", top: 0, zIndex: 10 }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 64,
              flexWrap: "wrap",
            }}
          >
            {/* Category filters */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 100,
                    border: "1px solid",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    background: activeCategory === cat ? "#F97316" : "transparent",
                    borderColor: activeCategory === cat ? "#F97316" : "#1E3A5A",
                    color: activeCategory === cat ? "#fff" : "#718096",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="6.5" cy="6.5" r="4.5" stroke="#4B6A8A" strokeWidth="1.5" />
                <path d="M10 10l3.5 3.5" stroke="#4B6A8A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  background: "#0D1B2E",
                  border: "1px solid",
                  borderColor: searchFocused ? "#F97316" : "#1E3A5A",
                  borderRadius: 8,
                  padding: "8px 12px 8px 36px",
                  color: "#EDF2F7",
                  fontSize: 13,
                  outline: "none",
                  width: 220,
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Main Content ───────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* Featured Post (only shown when no filters active) */}
          {activeCategory === "All" && searchQuery === "" && featuredBlog && (
            <FeaturedCard blog={featuredBlog} />
          )}

          {/* Results count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <p style={{ margin: 0, color: "#4B6A8A", fontSize: 14 }}>
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </p>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 24,
              }}
            >
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            // Empty state
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                color: "#4B6A8A",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto 16px", display: "block" }}>
                <circle cx="21" cy="21" r="14" stroke="#1E3A5A" strokeWidth="2" />
                <path d="M31 31l8 8" stroke="#1E3A5A" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, color: "#718096" }}>No articles found</p>
              <p style={{ margin: 0, fontSize: 14 }}>Try a different search term or category.</p>
            </div>
          )}

          {/* Newsletter CTA Banner */}
          <div
            style={{
              marginTop: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #0F2035 0%, #0D1B2E 100%)",
              border: "1px solid #1E3A5A",
              padding: "48px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#EDF2F7" }}>
                Stay ahead in solar O&M
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: "#718096" }}>
                Get the latest insights delivered to your inbox — no spam, unsubscribe anytime.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  background: "#080F1A",
                  border: "1px solid #1E3A5A",
                  borderRadius: 8,
                  padding: "10px 16px",
                  color: "#EDF2F7",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                  width: 220,
                }}
              />
              <button
                style={{
                  background: "#F97316",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}