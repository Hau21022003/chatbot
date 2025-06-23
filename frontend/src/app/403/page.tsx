import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1
        className="relative"
        style={{
          fontSize: "10rem",
          fontWeight: "900",
          color: "#fff",
          textShadow: `
          0 0 10px orange,
          0 0 20px orange,
          0 0 40px orange
        `,
        }}
      >
        403
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
              stroke="orange"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        Access forbidden
      </h2>
      <p className="text-gray-500 mb-1 text-center">
        You tried to access a page you did not have prior authorization for.
      </p>
      <div className="flex space-x-2">
        <Link href="/">
          <span className="text-orange-500 font-medium hover:underline cursor-pointer">
            Go back
          </span>
        </Link>
        <p className="text-gray-500 text-center">or</p>
        <Link href="/request-access">
          <span className="text-orange-500 font-medium hover:underline cursor-pointer">
            request access
          </span>
        </Link>
      </div>
    </div>
  );
}
