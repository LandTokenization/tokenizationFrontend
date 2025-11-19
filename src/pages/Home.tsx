

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(135deg, #6A11CB, #2575FC)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          fontWeight: "800",
          marginBottom: "10px",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Coming Soon
      </h1>

      <p
        style={{
          fontSize: "1.4rem",
          opacity: 0.9,
          maxWidth: "700px",
          marginBottom: "40px",
        }}
      >
        We’re crafting something exciting. Stay tuned — big things are on the way.
      </p>

      {/* Animated glowing circle loader */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "6px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
