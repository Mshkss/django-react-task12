export default function Loading() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <div
        style={{
          margin: "0 auto 1rem",
          border: "4px solid #eee",
          borderTop: "4px solid #0070f3",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite",
        }}
        className="spinner"
      />
      <p>Загрузка страницы...</p>
      <style>
        {`
			@keyframes spin {
			  0% { transform: rotate(0deg);}
			  100% { transform: rotate(360deg);}
			}
			.spinner {
			  animation: spin 1s linear infinite;
			}
		  `}
      </style>
    </div>
  );
}
