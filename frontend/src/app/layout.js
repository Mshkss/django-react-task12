"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="ru">
      <body>
        <nav>
          <h1>Навигация</h1>
          <Link
            href="/"
            style={{
              fontWeight: pathname === "/" ? "bold" : "normal",
            }}
          >
            На главную
          </Link>
          <br />

          <Link
            href="/courses"
            style={{
              fontWeight: pathname === "/courses" ? "bold" : "normal",
            }}
          >
            Перейти к курсам
          </Link>

          <br />
          <Link
            href="/courses_table"
            style={{
              fontWeight: pathname.startsWith("/courses_table") ? "bold" : "normal",
            }}
          >
            Все курсы [список]
          </Link>
          <br />
          <Link
            href="/profile"
            style={{
              fontWeight: pathname.startsWith("/users") ? "bold" : "normal",
            }}
          >
            Профиль
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
