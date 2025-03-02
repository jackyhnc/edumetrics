import { TUseSession, useSession } from "@/context"


export function CoursesSelection() {
  const { userData } = useSession() as TUseSession

  const data = ["engl", "math", "physics"]
  return (
    <div className="flex justify-center gap-2">
      {data.map((d) => {
        return (
          <div className="rounded-md p-2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer">{d}</div>
        )
      })}
    </div>
  )
}