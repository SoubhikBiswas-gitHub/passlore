export function PasswordText({ value }: { value: string }) {
  return (
    <>
      {value.split("").map((ch, i) => (
        <span key={i} className={/\d/.test(ch) ? "text-digit" : /[A-Za-z·]/.test(ch) ? undefined : "text-sym"}>
          {ch}
        </span>
      ))}
    </>
  )
}
