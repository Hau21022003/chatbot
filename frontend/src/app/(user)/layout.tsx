import UserSidebar from "@/components/user-sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái */}
      <UserSidebar />
      
      {/* Nội dung chính */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}